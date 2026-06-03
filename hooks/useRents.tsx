"use client";

import { searchParams } from "@/lib/searchParams";
import { RentColumns } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";

const getCollectionRows = (payload: any): RentColumns[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.collections)) return payload.collections;
  if (Array.isArray(payload?.collection)) return payload.collection;
  if (Array.isArray(payload?.rents)) return payload.rents;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const useRents = (opt: string = "") => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState({});

  const [searchQuery, setSearchQuery] = useQueryState(
    "title",
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault("")
  );
  const [assigned, setAssigned] = useQueryState(
    "assigned",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [min, setMin] = useQueryState(
    "min",
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault("")
  );
  const [max, setMax] = useQueryState(
    "max",
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault("")
  );
  const [beds, setBeds] = useQueryState(
    "beds",
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault("")
  );
  const [baths, setBaths] = useQueryState(
    "baths",
    searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault("")
  );
  const [category, setCategory] = useQueryState(
    "category",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [location, setLocation] = useQueryState(
    "location",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [adType, setAdType] = useQueryState(
    "ad_type",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withOptions({ shallow: false, history: "push" }).withDefault(50)
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setAssigned(null);
    setMin(null);
    setMax(null);
    setBeds(null);
    setBaths(null);
    setCategory(null);
    setLocation(null);
    setAdType(null);
  }, [
    setSearchQuery,
    setAssigned,
    setMin,
    setMax,
    setBeds,
    setBaths,
    setCategory,
    setLocation,
    setAdType,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return !!(
      searchQuery ||
      assigned ||
      min ||
      max ||
      beds ||
      baths ||
      category ||
      location ||
      adType
    );
  }, [searchQuery, assigned, min, max, beds, baths, category, location, adType]);

  const { data: rents, isLoading: gettingRents } = useQuery({
    queryKey: [
      "rents",
      {
        currentPage,
        pageSize,
        searchQuery,
        assigned,
        min,
        max,
        beds,
        baths,
        category,
        location,
        adType,
        opt,
      },
    ],
    queryFn: async () => {
      const resource = opt ? `/collection/${opt}` : "/collection";
      const res = await axiosAuth.get(
        `${resource}?limit=${pageSize}&page=${currentPage}&title=${searchQuery}&location=${location}&ad_type=${adType}&category=${category}&min_price=${min}&max_price=${max}&bedrooms=${beds}&bathrooms=${baths}&assigned=${assigned}`
      );
      const payload = res.data?.data ?? res.data;
      const rows = getCollectionRows(payload);
      return {
        data: rows,
        total:
          payload?.total ??
          payload?.pagination?.totalItems ??
          payload?.meta?.total ??
          rows.length,
      };
    },
  });

  const { mutateAsync: deleteRent, isPending: isDeletingRent } = useMutation({
    mutationFn: (id: string) => axiosAuth.delete(`/collection/${id}`),
    onSuccess: () => {
      toast("Success", { description: "Collection deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["rents"] });
    },
  });

  const { mutateAsync: updateRent, isPending: isUpdatingRent } = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: any;
    }) => axiosAuth.patch(`/collection/${id}`, values),
    onSuccess: () => {
      toast("Success", { description: "Collection updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["rents"] });
    },
  });

  const getRentById = async (id: string) => {
    const response = await axiosAuth.get(`/collection/${id}`);
    return response.data?.data ?? response.data;
  };

  const { data: assignees, isLoading: isLoadingAssignees } = useQuery({
    queryKey: ["landlords"],
    queryFn: async () => {
      const response = await axiosAuth.get("/users/landlords");
      const payload = response.data?.data ?? response.data;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.users)) return payload.users;
      if (Array.isArray(payload?.data)) return payload.data;
      return [];
    },
  });

  const modifiedAssignees = useMemo(
    () =>
      (Array.isArray(assignees) ? assignees : []).map((user: any) => ({
        label: `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
        value: String(user?.id ?? ""),
      })),
    [assignees]
  );

  const selectedRows = Object.keys(rowSelection).map(
    (index) => rents?.data?.[Number(index)]
  );
  const selectedIds = selectedRows
    .map((row) => row?.id)
    .filter(Boolean) as string[];

  return {
    rents,
    gettingRents,
    rowSelection,
    setRowSelection,
    selectedIds,
    deleteRent,
    isDeletingRent,
    updateRent,
    isUpdatingRent,
    getRentById,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetFilters,
    isAnyFilterActive,
    assigned,
    setAssigned,
    min,
    setMin,
    max,
    setMax,
    beds,
    setBeds,
    baths,
    setBaths,
    category,
    setCategory,
    location,
    setLocation,
    adType,
    setAdType,
    modifiedAssignees,
    isLoadingAssignees,
  };
};

export default useRents;
