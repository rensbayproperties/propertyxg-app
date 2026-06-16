"use client";

import React, { useState, useMemo, useCallback } from "react";
import Container from "@/components/Container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DataTableFilter } from "@/components/ui/table/data-table-filter";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import LocationProjectSearchDropdown from "@/components/LocationProjectSearchDropdown";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchParams";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";
import { Building, MapPin, Milestone, Calendar } from "lucide-react";

interface DxbProject {
  id: string;
  project_name?: string;
  project_name_en?: string;
  developer_name?: string;
  developer_name_en?: string;
  area_name_en?: string;
  area_id?: number;
  project_status?: string;
  percent_completed?: number;
  project_start_date?: string | null;
  project_end_date?: string | null;
  completion_date?: string | null;
  cancellation_date?: string | null;
  no_of_units?: number;
  no_of_villas?: number;
  no_of_buildings?: number;
  no_of_lands?: number;
  zoning_authority_en?: string;
  escrow_agent_name?: string;
  project_description_en?: string;
  master_project_en?: string;
  master_developer_name?: string;
  project_number?: number;
}

interface DxbProjectsPageWrapProps {
  projects: DxbProject[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  general: WebsiteGeneral;
  areas: { label: string; value: string }[];
}

export function DxbProjectsPageWrap({
  projects,
  meta,
  general,
  areas,
}: DxbProjectsPageWrapProps) {
  const accent = general.primaryColor || "#0166FF";

  // URL query states via nuqs
  const [locationId, setLocationId] = useQueryState(
    "locationId",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [projectId, setProjectId] = useQueryState(
    "projectId",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [projectStatus, setProjectStatus] = useQueryState(
    "project_status",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [page, setPage] = useQueryState(
    "page",
    searchParams.status.withOptions({ shallow: false }).withDefault("1")
  );

  // Remount key to reset search dropdown state
  const [resetKey, setResetKey] = useState(0);

  // Modal Dialog state for active project details
  const [selectedProject, setSelectedProject] = useState<DxbProject | null>(null);

  const resetFilters = useCallback(() => {
    setLocationId(null);
    setProjectId(null);
    setProjectStatus(null);
    setPage(null);
    setResetKey((prev) => prev + 1);
  }, [setLocationId, setProjectId, setProjectStatus, setPage]);

  const isAnyFilterActive = useMemo(() => {
    return !!locationId || !!projectId || !!projectStatus || page !== "1";
  }, [locationId, projectId, projectStatus, page]);

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "FINISHED", label: "Finished" },
    { value: "PENDING", label: "Pending" },
    { value: "CANCELLED", label: "Cancelled" },
  ];

  // Helper to format dates nicely: "2028-03-01T00:00:00.000Z" -> "March 2028"
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    } catch {
      return "N/A";
    }
  };

  // Generate page numbers for minimized windowed pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (meta.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= meta.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const currentPage = meta.page;
      const totalPages = meta.totalPages;

      // Always show page 1
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      if (start > 2) {
        pages.push("ellipsis-1");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis-2");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  // Client-side filtering fallback to ensure filters function correctly
  // even if the backend returns unfiltered project lists.
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (projectStatus) {
      result = result.filter(
        (p) => p.project_status?.toUpperCase() === projectStatus.toUpperCase()
      );
    }

    if (locationId) {
      const normalizedLoc = locationId.toLowerCase().trim();
      result = result.filter((p) => {
        if (p.area_id && String(p.area_id) === normalizedLoc) return true;
        if (p.area_name_en) {
          const areaName = p.area_name_en.toLowerCase();
          const areaSlug = areaName.replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
          if (
            areaName.includes(normalizedLoc) ||
            areaSlug === normalizedLoc ||
            normalizedLoc.includes(areaSlug)
          ) {
            return true;
          }
        }
        return false;
      });
    }

    if (projectId) {
      result = result.filter((p) => String(p.id) === String(projectId));
    }

    return result;
  }, [projects, projectStatus, locationId, projectId]);

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans antialiased text-slate-800 pb-12">
      {/* FILTER BAR SECTION */}
      <section className="border-b sticky top-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-[20] py-4 bg-white/95 backdrop-blur-md">
        <Container className="flex flex-wrap items-center gap-3">
          {/* Location Dropdown */}
          <div className="w-full md:max-w-md shrink-0">
            <LocationProjectSearchDropdown
              key={resetKey}
              onLocationSelect={(selectedItem) => {
                setPage(null);
                if (selectedItem.type === "project") {
                  setProjectId(selectedItem.id);
                  setLocationId(null);
                } else {
                  setLocationId(selectedItem.id);
                  setProjectId(null);
                }
              }}
            />
          </div>

          {/* Status Filter */}
          <DataTableFilter
            filterKey="status"
            title="Status"
            options={statusOptions}
            setFilterValue={(val) => {
              setPage(null);
              const valStr = typeof val === "function" ? val(projectStatus || "") : val;
              setProjectStatus(valStr || null);
              return Promise.resolve(new URLSearchParams());
            }}
            filterValue={projectStatus || ""}
          />

          {/* Reset Filters */}
          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />
        </Container>
      </section>

      {/* PROJECTS GRID SECTION */}
      <section className="py-8">
        <Container>
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Dubai DXB Projects
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredProjects.length} of {meta.total} premium projects matching your criteria.
            </p>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="p-16 text-center border border-slate-100 rounded-3xl bg-white shadow-sm flex flex-col items-center">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                <Building size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No projects match your search
              </h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Try removing some filters or check back later for new updates.
              </p>
              <Button
                onClick={resetFilters}
                className="mt-6 rounded-xl text-white font-semibold"
                style={{ backgroundColor: accent }}
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const percent = Math.min(100, Math.max(0, project.percent_completed || 0));
                  const isFinished = project.project_status === "FINISHED";
                  const isActive = project.project_status === "ACTIVE" || project.project_status === "STARTED";
                  const isPending = project.project_status === "PENDING";
                  const isCancelled = project.project_status === "CANCELLED";

                  return (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:shadow-[0_20px_50px_rgba(15,23,42,0.04)] hover:border-slate-200/60 transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      {/* CARD BANNER PLACEHOLDER */}
                      <div className="h-44 w-full bg-slate-900 shrink-0 relative flex flex-col justify-end p-5">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent z-[1]" />
                        
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <span
                            className={cn(
                              "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm",
                              isFinished && "bg-emerald-600",
                              isActive && "bg-indigo-600",
                              isPending && "bg-amber-500",
                              isCancelled && "bg-rose-600",
                              !isFinished && !isActive && !isPending && !isCancelled && "bg-slate-500"
                            )}
                          >
                            {project.project_status || "ACTIVE"}
                          </span>
                        </div>

                        {/* Title & Developer */}
                        <div className="relative z-10 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-350">
                            {project.developer_name_en || project.developer_name || "Nakheel PJSC"}
                          </span>
                          <h2 className="text-lg font-black tracking-tight line-clamp-1 mt-0.5 leading-snug">
                            {project.project_name_en || project.project_name || "Unnamed Project"}
                          </h2>
                        </div>
                      </div>

                      {/* CARD DETAILS */}
                      <div className="p-6 flex-1 flex flex-col justify-between gap-6">
                        <div className="space-y-4">
                          {/* Location */}
                          <div className="flex gap-2 items-center text-slate-500 text-sm">
                            <MapPin size={16} className="text-slate-400 shrink-0" />
                            <span className="font-semibold line-clamp-1">
                              {project.area_name_en || "Dubai, UAE"}
                            </span>
                          </div>

                          {/* Completion rate bar */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>Completion Progress</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${percent}%`,
                                  backgroundColor: accent,
                                }}
                              />
                            </div>
                          </div>

                          {/* Date details */}
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500 font-semibold">
                            <div className="space-y-1">
                              <span className="text-slate-400 font-bold block">STARTED</span>
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Calendar size={13} className="text-slate-400" />
                                <span>{formatDate(project.project_start_date)}</span>
                              </div>
                            </div>
                            <div className="space-y-1 border-l border-slate-100 pl-4">
                              <span className="text-slate-400 font-bold block">HANDOVER</span>
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Milestone size={13} className="text-slate-400" />
                                <span>{formatDate(project.project_end_date || project.completion_date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* STATS FOOTER */}
                        <div className="border-t border-slate-100 pt-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500 font-bold">
                          <div className="bg-slate-50 py-2.5 rounded-xl border border-slate-100/50">
                            <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-0.5 font-sans">UNITS</span>
                            <span className="text-slate-800 text-sm leading-none font-sans">{project.no_of_units || 0}</span>
                          </div>
                          <div className="bg-slate-50 py-2.5 rounded-xl border border-slate-100/50">
                            <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-0.5 font-sans">VILLAS</span>
                            <span className="text-slate-800 text-sm leading-none font-sans">{project.no_of_villas || 0}</span>
                          </div>
                          <div className="bg-slate-50 py-2.5 rounded-xl border border-slate-100/50">
                            <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-0.5 font-sans">BLDGS</span>
                            <span className="text-slate-800 text-sm leading-none font-sans">{project.no_of_buildings || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION CONTROLS */}
              {meta.totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const prevPage = Math.max(1, meta.page - 1);
                      setPage(String(prevPage));
                    }}
                    disabled={meta.page <= 1}
                    className="rounded-xl border-slate-200 text-slate-700 font-semibold px-4 hover:bg-slate-50 disabled:opacity-50 h-10"
                  >
                    Previous
                  </Button>

                  {getPageNumbers().map((p, idx) => {
                    if (typeof p === "string") {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-450 font-black font-sans">
                          ...
                        </span>
                      );
                    }
                    const isActive = meta.page === p;
                    return (
                      <Button
                        key={p}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => setPage(String(p))}
                        className={cn(
                          "w-10 h-10 rounded-xl font-bold transition-all text-xs",
                          isActive
                            ? "text-white shadow-md hover:opacity-90"
                            : "border-slate-200 text-slate-700 hover:bg-slate-50"
                        )}
                        style={isActive ? { backgroundColor: accent } : {}}
                      >
                        {p}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    onClick={() => {
                      const nextPage = Math.min(meta.totalPages, meta.page + 1);
                      setPage(String(nextPage));
                    }}
                    disabled={meta.page >= meta.totalPages}
                    className="rounded-xl border-slate-200 text-slate-700 font-semibold px-4 hover:bg-slate-50 disabled:opacity-50 h-10"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </Container>
      </section>

      {/* PROJECT DETAIL MODAL */}
      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] rounded-3xl bg-white border border-slate-100 shadow-xl p-0 font-sans">
          {selectedProject && (
            <div className="flex flex-col">
              {/* Header Banner */}
              <div className="bg-slate-900 text-white p-8 relative flex flex-col justify-end min-h-[160px]">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent z-[1]" />
                
                {/* Status Badge */}
                <div className="absolute top-6 right-6 z-10">
                  <span
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider text-white shadow-sm",
                      selectedProject.project_status === "FINISHED" && "bg-emerald-600",
                      (selectedProject.project_status === "ACTIVE" || selectedProject.project_status === "STARTED") && "bg-indigo-600",
                      selectedProject.project_status === "PENDING" && "bg-amber-500",
                      selectedProject.project_status === "CANCELLED" && "bg-rose-600",
                      selectedProject.project_status !== "FINISHED" && selectedProject.project_status !== "ACTIVE" && selectedProject.project_status !== "PENDING" && selectedProject.project_status !== "CANCELLED" && "bg-slate-500"
                    )}
                  >
                    {selectedProject.project_status || "ACTIVE"}
                  </span>
                </div>

                <div className="relative z-10">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-350">
                    {selectedProject.developer_name_en || selectedProject.developer_name || "Unknown Developer"}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1 text-white leading-tight">
                    {selectedProject.project_name_en || selectedProject.project_name || "Unnamed Project"}
                  </h2>
                  {selectedProject.project_name && selectedProject.project_name !== "." && selectedProject.project_name !== selectedProject.project_name_en && (
                    <p className="text-sm text-slate-400 font-medium mt-1 text-right">
                      {selectedProject.project_name}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8 overflow-y-auto">
                {/* Progress Tracker */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100/80">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-700 mb-2">
                    <span className="flex items-center gap-2">
                      <Milestone size={18} className="text-slate-500" />
                      Construction Progress
                    </span>
                    <span className="text-lg font-black" style={{ color: accent }}>
                      {Math.min(100, Math.max(0, selectedProject.percent_completed || 0))}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, selectedProject.percent_completed || 0))}%`,
                        backgroundColor: accent,
                      }}
                    />
                  </div>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Timeline section */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">TIMELINE & DATES</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500 font-semibold">Start Date</span>
                        <span className="text-slate-800 font-bold flex items-center gap-1.5">
                          <Calendar size={15} className="text-slate-400" />
                          {formatDate(selectedProject.project_start_date)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-t border-slate-50">
                        <span className="text-slate-500 font-semibold">End / Handover Date</span>
                        <span className="text-slate-800 font-bold flex items-center gap-1.5">
                          <Milestone size={15} className="text-slate-400" />
                          {formatDate(selectedProject.project_end_date || selectedProject.completion_date)}
                        </span>
                      </div>
                      {selectedProject.cancellation_date && (
                        <div className="flex justify-between py-1 border-t border-slate-50 text-rose-600">
                          <span className="font-semibold">Cancellation Date</span>
                          <span className="font-bold">{formatDate(selectedProject.cancellation_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project stats */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">PROJECT STATISTICS</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-1 font-sans">TOTAL UNITS</span>
                        <span className="text-slate-800 text-lg font-black font-sans">{selectedProject.no_of_units || 0}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-1 font-sans">TOTAL VILLAS</span>
                        <span className="text-slate-800 text-lg font-black font-sans">{selectedProject.no_of_villas || 0}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-1 font-sans">BUILDINGS</span>
                        <span className="text-slate-800 text-lg font-black font-sans">{selectedProject.no_of_buildings || 0}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <span className="text-[10px] text-slate-400 uppercase block font-extrabold mb-1 font-sans">LAND PLOTS</span>
                        <span className="text-slate-800 text-lg font-black font-sans">{selectedProject.no_of_lands || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial & Authority section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b pb-2">AUTHORITY & FINANCIAL DETAILS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-400 uppercase block font-extrabold mb-0.5">Zoning Authority</span>
                        <span className="text-slate-800 font-bold">{selectedProject.zoning_authority_en || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase block font-extrabold mb-0.5">Escrow Agent Bank</span>
                        <span className="text-slate-800 font-bold">{selectedProject.escrow_agent_name || "N/A"}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-slate-400 uppercase block font-extrabold mb-0.5">Master Developer</span>
                        <span className="text-slate-800 font-bold">{selectedProject.master_developer_name || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 uppercase block font-extrabold mb-0.5">Master Project</span>
                        <span className="text-slate-800 font-bold">{selectedProject.master_project_en || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProject.project_description_en && selectedProject.project_description_en !== "1" && selectedProject.project_description_en !== "." && (
                  <div className="space-y-3 border-t border-slate-100 pt-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">PROJECT DESCRIPTION</h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                      {selectedProject.project_description_en}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DxbProjectsPageWrap;
