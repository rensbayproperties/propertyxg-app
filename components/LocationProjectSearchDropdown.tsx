"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { useLocationsProjects } from "@/hooks/useLocationsProjects";
import { Location, Project } from "@/types";
import { useQueryState } from "nuqs";
import { Icons } from "@/components/icons";

const SKELETON_ROW_WIDTHS = [
  "70%",
  "55%",
  "80%",
  "60%",
  "75%",
];

const LOADING_SKELETON_DELAY_MS = 200;

interface LocationWithProject {
  id: string;
  title: string;
  subtitle?: string;
  type: "location" | "project";
  location?: Location;
  project?: Project;
}

/**
 * NORMALIZE TEXT
 */
const normalizeText = (text: string = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, "");

/**
 * LEVENSHTEIN DISTANCE
 */
const levenshtein = (
  a: string,
  b: string,
) => {
  const matrix = Array.from(
    { length: b.length + 1 },
    (_, i) => [i],
  );

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (
      let j = 1;
      j <= a.length;
      j++
    ) {
      if (
        b.charAt(i - 1) ===
        a.charAt(j - 1)
      ) {
        matrix[i][j] =
          matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

interface LocationProjectSearchDropdownProps {
  onLocationSelect: (
    location: LocationWithProject,
  ) => void;
  defaultValue?: LocationWithProject;
}

const LocationProjectSearchDropdown: React.FC<
  LocationProjectSearchDropdownProps
> = ({ onLocationSelect, defaultValue }) => {
  const { allLocations, isLoading } =
    useLocationsProjects();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [isOpen, setIsOpen] =
    useState(false);

  const [
    showLoadingSkeleton,
    setShowLoadingSkeleton,
  ] = useState(false);

  const [, setName] =
    useQueryState("name");

  const containerRef =
    useRef<HTMLDivElement>(null);

  /**
   * COMBINED DATA
   */
  const locationsWithProjects: LocationWithProject[] =
    useMemo(() => {
      const locations =
        allLocations?.locations?.map(
          (location) => ({
            type: "location" as const,
            title:
              location?.name || "",
            subtitle: "Location",
            id: String(
              location?.id,
            ),
            location,
          }),
        ) || [];

      const projects =
        allLocations?.projects?.map(
          (project) => ({
            type: "project" as const,
            title:
              project?.project_name_en ||
              "",
            subtitle:
              project?.area_name_en ||
              "Project",
            id: String(project?.id),
            project,
          }),
        ) || [];

      return [
        ...locations,
        ...projects,
      ];
    }, [allLocations]);

  /**
   * FILTERED RESULTS
   */
  const filteredResults =
    useMemo(() => {
      /**
       * DO NOT SHOW ANYTHING
       * UNTIL USER TYPES
       */
      if (
        !searchTerm.trim()
      ) {
        return [];
      }

      const normalizedSearch =
        normalizeText(
          searchTerm,
        );

      const scored =
        locationsWithProjects
          .map((item) => {
            const title =
              normalizeText(
                item.title,
              );

            const subtitle =
              normalizeText(
                item.subtitle ||
                  "",
              );

            let score = 0;

            /**
             * EXACT MATCH
             */
            if (
              title ===
              normalizedSearch
            ) {
              score += 1000;
            }

            /**
             * STARTS WITH
             */
            if (
              title.startsWith(
                normalizedSearch,
              )
            ) {
              score += 700;
            }

            /**
             * WORD STARTS WITH
             */
            if (
              title
                .split(" ")
                .some((word) =>
                  word.startsWith(
                    normalizedSearch,
                  ),
                )
            ) {
              score += 500;
            }

            /**
             * INCLUDES
             */
            if (
              title.includes(
                normalizedSearch,
              )
            ) {
              score += 300;
            }

            /**
             * SUBTITLE
             */
            if (
              subtitle.includes(
                normalizedSearch,
              )
            ) {
              score += 120;
            }

            /**
             * TYPO SUPPORT
             */
            const distance =
              levenshtein(
                normalizedSearch,
                title,
              );

            if (
              distance <= 2
            ) {
              score +=
                200 -
                distance * 40;
            }

            /**
             * PARTIAL TYPO
             */
            title
              .split(" ")
              .forEach(
                (word) => {
                  const wordDistance =
                    levenshtein(
                      normalizedSearch,
                      word,
                    );

                  if (
                    wordDistance <=
                    2
                  ) {
                    score +=
                      180 -
                      wordDistance *
                        30;
                  }
                },
              );

            return {
              ...item,
              score,
            };
          })
          .filter(
            (item) =>
              item.score > 0,
          )
          .sort(
            (a, b) =>
              b.score -
              a.score,
          )
          .slice(0, 20);

      return scored;
    }, [
      searchTerm,
      locationsWithProjects,
    ]);

  /**
   * DEFAULT VALUE
   */
  useEffect(() => {
    if (defaultValue) {
      setSearchTerm(
        defaultValue.title,
      );
    }
  }, [defaultValue]);

  /**
   * CLOSE OUTSIDE
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, [isOpen]);

  /**
   * LOADING DELAY
   */
  useEffect(() => {
    if (!isLoading) {
      setShowLoadingSkeleton(
        false,
      );

      return;
    }

    const timer = setTimeout(
      () =>
        setShowLoadingSkeleton(
          true,
        ),
      LOADING_SKELETON_DELAY_MS,
    );

    return () =>
      clearTimeout(timer);
  }, [isLoading]);

  /**
   * SEARCH
   */
  const handleLocationSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value =
      e.target.value;

    setSearchTerm(value);

    /**
     * REMOVE PARAM
     * IF EMPTY
     */
    if (!value.trim()) {
      setName(null);
    } else {
      setName(value);
    }

    setIsOpen(true);
  };

  /**
   * ESCAPE
   */
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <Input
        placeholder="Search location or project"
        value={searchTerm}
        onChange={
          handleLocationSearch
        }
        onFocus={() =>
          setIsOpen(true)
        }
        onKeyDown={
          handleKeyDown
        }
        icon={Icons.location}
      />

      {isOpen &&
        searchTerm.trim() && (
          <ul className="absolute bg-white border mt-1 rounded-xl shadow-lg z-[9999] max-h-80 overflow-auto w-full p-2">
            {showLoadingSkeleton ? (
              SKELETON_ROW_WIDTHS.map(
                (
                  width,
                  index,
                ) => (
                  <li
                    key={
                      index
                    }
                    className="p-2 flex gap-2 items-center pointer-events-none"
                  >
                    <Skeleton className="h-5 w-5 rounded-full shrink-0" />

                    <Skeleton
                      className="h-4 flex-1"
                      style={{
                        maxWidth:
                          width,
                      }}
                    />
                  </li>
                ),
              )
            ) : filteredResults.length >
              0 ? (
              filteredResults.map(
                (item) => (
                  <li
                    key={`${item.type}-${item.id}`}
                    className="p-3 cursor-pointer hover:bg-gray-100 rounded-lg flex gap-3 items-start transition-all"
                    onMouseDown={() => {
                      setSearchTerm(
                        item?.title ||
                          "",
                      );

                      setIsOpen(
                        false,
                      );

                      onLocationSelect(
                        item,
                      );
                    }}
                  >
                    <div className="mt-0.5">
                      {item.type ===
                      "project" ? (
                        <i className="bi bi-building opacity-60 text-base"></i>
                      ) : (
                        <i className="bi bi-geo-alt opacity-60 text-base"></i>
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {
                          item.title
                        }
                      </span>

                      <span className="text-xs text-gray-500 truncate">
                        {item.type ===
                        "project"
                          ? `Project • ${
                              item.subtitle ||
                              "Area"
                            }`
                          : "Location"}
                      </span>
                    </div>
                  </li>
                ),
              )
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

export default LocationProjectSearchDropdown;