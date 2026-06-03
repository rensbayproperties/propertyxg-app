"use client";

import { axiosAuth } from "@/lib/api";
import { searchParams } from "@/lib/searchParams";
import { Location } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

export const useLocations = () => {
  const [name] = useQueryState(
    "name",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 500 })
      .withDefault("")
  );

  const {
    data: allLocations = [],
    isLoading,
    error,
  } = useQuery<Location[]>({
    queryKey: ["locations", name],
    queryFn: async () => {
      const res = await axiosAuth.get(`/locations?name=${name}`);
      return res.data.data;
    },

    refetchOnWindowFocus: false,
  });

  return {
    allLocations,
    isLoading,
    error,
  };
};
