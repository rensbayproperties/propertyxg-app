"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useState,
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from "react";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { parseAsInteger, useQueryState, type Options } from "nuqs";
import { searchParams } from "@/lib/searchParams";
import { RowSelectionState } from "@tanstack/react-table";
import { DxbProject } from "@/types";

interface DxbProjectsApiResponse {
  data: DxbProject[];
  total: number;
  page: number;
  limit: number;
}

type StringQuerySetter = (
  value: string | ((old: string) => string | null) | null,
  options?: Options<any>
) => Promise<URLSearchParams>;

type NumberQuerySetter = <Shallow>(
  value: number | ((old: number) => number | null) | null,
  options?: Options<Shallow>
) => Promise<URLSearchParams>;

type NullableNumberQuerySetter = <Shallow>(
  value: number | ((old: number | null) => number | null) | null,
  options?: Options<Shallow>
) => Promise<URLSearchParams>;

type UseProps = {
  limit?: any;
};

interface UseDxbProjectsReturn {
  projects: DxbProjectsApiResponse | undefined;
  isLoadingProjects: boolean;
  handleDelete: (ids: string[]) => Promise<void>;
  isDeleting: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  selectedIds: string[];
  currentPage: number;
  setCurrentPage: NumberQuerySetter;
  pageSize: number;
  setPageSize: NumberQuerySetter;
  searchQuery: string;
  setSearchQuery: StringQuerySetter;
  projectStatus: string;
  setProjectStatus: StringQuerySetter;
  areaFilter: string;
  setAreaFilter: StringQuerySetter;
  developerFilter: string;
  setDeveloperFilter: StringQuerySetter;
  completionMin: number;
  setCompletionMin: NumberQuerySetter;
  completionMax: number;
  setCompletionMax: NumberQuerySetter;
  unitsMin: number | null;
  setUnitsMin: NullableNumberQuerySetter;
  unitsMax: number | null;
  setUnitsMax: NullableNumberQuerySetter;
  resetFilters: () => void;
  isAnyFilterActive: boolean;
}

const useDxbProjects = ({limit} : UseProps): UseDxbProjectsReturn => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(50)
  );

  const finalLimit = limit ?? pageSize ?? undefined;

  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [projectStatus, setProjectStatus] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [areaFilter, setAreaFilter] = useQueryState(
    "area",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [developerFilter, setDeveloperFilter] = useQueryState(
    "developer",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [completionMin, setCompletionMin] = useQueryState(
    "completion_min",
    parseAsInteger.withOptions({ shallow: false }).withDefault(0)
  );

  const [completionMax, setCompletionMax] = useQueryState(
    "completion_max",
    parseAsInteger.withOptions({ shallow: false }).withDefault(100)
  );

  const [unitsMin, setUnitsMin] = useQueryState(
    "units_min",
    parseAsInteger.withOptions({ shallow: false })
  );

  const [unitsMax, setUnitsMax] = useQueryState(
    "units_max",
    parseAsInteger.withOptions({ shallow: false })
  );

  // Fetch all DXB projects
  const { data: projects, isLoading: isLoadingProjects } =
    useQuery<DxbProjectsApiResponse>({
      queryKey: [
        "dxb-projects",
        {
          currentPage,
          finalLimit,
          searchQuery,
          projectStatus,
          areaFilter,
          developerFilter,
          completionMin,
          completionMax,
          unitsMin,
          unitsMax,
        },
      ],
      queryFn: async () => {
        const params = new URLSearchParams();
        params.append("page", currentPage.toString());
        params.append("limit", finalLimit.toString());
        if (searchQuery) params.append("search", searchQuery);
        if (projectStatus) params.append("status", projectStatus);
        if (areaFilter) params.append("area", areaFilter);
        if (developerFilter) params.append("developer", developerFilter);
        if (completionMin > 0)
          params.append("completion_min", completionMin.toString());
        if (completionMax < 100)
          params.append("completion_max", completionMax.toString());
        if (unitsMin) params.append("units_min", unitsMin.toString());
        if (unitsMax) params.append("units_max", unitsMax.toString());

        const response = await axiosAuth.get(
          `/dxb-projects?${params.toString()}`
        );
        return {
          data: response?.data?.data?.data || [],
          total: response?.data?.data?.total || 0,
          page: currentPage,
          limit: finalLimit,
        };
      },
      refetchOnWindowFocus: false,
    });

  // Mutation for deleting projects
  const { mutateAsync: deleteProjects, isPending: isDeleting } = useMutation({
    mutationFn: async (ids: string[]) => {
      const deletePromises = ids.map((id) =>
        axiosAuth.delete(`/dxb-projects/${id}`)
      );
      return Promise.all(deletePromises);
    },
    onSuccess: () => {
      toast.success("Selected project(s) deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["dxb-projects"] });
      setRowSelection({});
    },
    onError: (error: any) => {
      console.error("Deletion failed:", error);
      toast.error("Deletion Failed", {
        description:
          error?.response?.data?.message ||
          "Could not delete the selected project(s). Please try again.",
      });
    },
  });

  const handleDelete = async (ids: string[]) => {
    if (ids.length === 0) {
      toast.warning("No projects selected for deletion.");
      return;
    }
    await deleteProjects(ids);
  };

  const selectedIds = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map((index) => projects?.data[parseInt(index, 10)]?.id?.toString())
    .filter((id) => id !== undefined) as string[];

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setProjectStatus(null);
    setAreaFilter(null);
    setDeveloperFilter(null);
    setCompletionMin(0);
    setCompletionMax(100);
    setUnitsMin(null);
    setUnitsMax(null);
  }, [
    setSearchQuery,
    setProjectStatus,
    setAreaFilter,
    setDeveloperFilter,
    setCompletionMin,
    setCompletionMax,
    setUnitsMin,
    setUnitsMax,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      !!projectStatus ||
      !!areaFilter ||
      !!developerFilter ||
      completionMin > 0 ||
      completionMax < 100 ||
      !!unitsMin ||
      !!unitsMax
    );
  }, [
    searchQuery,
    projectStatus,
    areaFilter,
    developerFilter,
    completionMin,
    completionMax,
    unitsMin,
    unitsMax,
  ]);

  return {
    projects,
    isLoadingProjects,
    handleDelete,
    isDeleting,
    rowSelection,
    setRowSelection,
    selectedIds,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    searchQuery,
    setSearchQuery,
    projectStatus,
    setProjectStatus,
    areaFilter,
    setAreaFilter,
    developerFilter,
    setDeveloperFilter,
    completionMin,
    setCompletionMin,
    completionMax,
    setCompletionMax,
    unitsMin,
    setUnitsMin,
    unitsMax,
    setUnitsMax,
    resetFilters,
    isAnyFilterActive,
  };
};

export default useDxbProjects;
