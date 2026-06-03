"use client";

import { axiosAuth } from "@/lib/api";
import { searchParams } from "@/lib/searchParams";
import { Location, Project } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

type LocationWithProject = {
  locations: Location[];
  projects: Project[];
}

export const useLocationsProjects = () => {
  const [name] = useQueryState(
    "name",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 500 })
      .withDefault("")
  );

  const {
    data: allLocations = { locations: [], projects: [] },
    isLoading,
    error,
  } = useQuery<LocationWithProject>({
    queryKey: ["locations-projects", name],
    queryFn: async () => {
      const res = await axiosAuth.get(`/locations/with-project?name=${name}`);
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
