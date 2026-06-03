"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { useLocationsProjects } from "@/hooks/useLocationsProjects";
import { Location, Project } from "@/types";
import { useQueryState } from "nuqs";
import { Icons } from "@/components/icons";

const SKELETON_ROW_WIDTHS = ["70%", "55%", "80%", "60%", "75%"];
const LOADING_SKELETON_DELAY_MS = 200;

interface LocationWithProject {
  id: string;
  title: string;
  subtitle?: string;
  type: "location" | "project";
  location?: Location;
  project?: Project;
}

interface DefaultValue {
    id: number;
    project_name_en: string;
    project_name: string;
    area_name_en: string;
    project_number: string;
}

interface Props {
  onLocationSelect: (location: LocationWithProject) => void;
  defaultValue?: DefaultValue;
}

const normalizeText = (text: string = "") =>
  text.toLowerCase().trim().replace(/[^\w\s]/gi, "");

const ProjectSearchDropdown: React.FC<Props> = ({
  onLocationSelect,
  defaultValue,
}) => {
  const { allLocations, isLoading } = useLocationsProjects();

  /**
   * ✅ JUST USE BACKEND VALUE DIRECTLY
   */
  const [searchTerm, setSearchTerm] = useState(
    defaultValue?.project_name_en || ""
  );

  const [isOpen, setIsOpen] = useState(false);
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(false);

  const [, setName] = useQueryState("name");

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * UPDATE IF DEFAULT VALUE CHANGES
   */
  useEffect(() => {
    if (defaultValue?.project_name_en) {
      setSearchTerm(defaultValue.project_name_en);
    }
  }, [defaultValue]);

  const locationsWithProjects: LocationWithProject[] = useMemo(() => {
    const locations =
      allLocations?.locations?.map((location) => ({
        type: "location" as const,
        title: location?.name || "",
        subtitle: "Location",
        id: String(location?.id),
        location,
      })) || [];

    const projects =
      allLocations?.projects?.map((project) => ({
        type: "project" as const,
        title: project?.project_name_en || "",
        subtitle: project?.area_name_en || "Project",
        id: String(project?.id),
        project,
      })) || [];

    return [...locations, ...projects];
  }, [allLocations]);


  const filteredResults = useMemo(() => {
    /**
     * DO NOT SHOW ANYTHING
     * UNTIL USER TYPES
     */
    if (!searchTerm.trim()) {
      return [];
    }

    const normalizedSearch = normalizeText(searchTerm);

    return locationsWithProjects
      .map((item) => {
        const title = normalizeText(item.title);

        let score = 0;

        if (title === normalizedSearch) score += 1000;

        if (title.startsWith(normalizedSearch)) score += 700;

        if (title.includes(normalizedSearch)) score += 300;

        return {
          ...item,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, [searchTerm, locationsWithProjects]);

  /**
   * LOADING DELAY
   */
  useEffect(() => {
    if (!isLoading) {
      setShowLoadingSkeleton(false);
      return;
    }

    const timer = setTimeout(
      () => setShowLoadingSkeleton(true),
      LOADING_SKELETON_DELAY_MS
    );

    return () => clearTimeout(timer);
  }, [isLoading]);

  /**
   * CLOSE OUTSIDE
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  /**
   * SEARCH INPUT
   */
  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (!value.trim()) {
      setName(null);
    } else {
      setName(value);
    }

    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder="Search project"
        value={searchTerm}
        onChange={handleSearch}
        onFocus={() => setIsOpen(true)}
        icon={Icons.building}
      />

      {isOpen && searchTerm.trim() && (
        <ul className="absolute bg-white border mt-1 rounded-xl shadow-lg z-[9999] max-h-80 overflow-auto w-full p-2">
          {showLoadingSkeleton ? (
            SKELETON_ROW_WIDTHS.map((width, index) => (
              <li
                key={index}
                className="p-2 flex gap-2 items-center"
              >
                <Skeleton className="h-5 w-5 rounded-full shrink-0" />

                <Skeleton
                  className="h-4 flex-1"
                  style={{
                    maxWidth: width,
                  }}
                />
              </li>
            ))
          ) : filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <li
                key={`${item.type}-${item.id}`}
                className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg flex gap-3 items-start transition-all"
                onMouseDown={() => {
                  setSearchTerm(item.title);
                  setIsOpen(false);
                  setName(item.title);

                  onLocationSelect(item);
                }}
              >
                <div className="mt-0.5">
                  {item.type === "project" ? (
                    <i className="bi bi-building opacity-60 text-base"></i>
                  ) : (
                    <i className="bi bi-geo-alt opacity-60 text-base"></i>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </span>

                  <span className="text-xs text-gray-500 truncate">
                    {item.type === "project"
                      ? `Project • ${item.subtitle || "Area"}`
                      : "Location"}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <li className="p-3 text-sm text-muted-foreground text-center">
              No results found
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectSearchDropdown;