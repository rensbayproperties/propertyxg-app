"use client";
import { useQuery } from "@tanstack/react-query";
import { teamMemberSchema } from "@/lib/schemas";
import z from "zod";
import useAxiosAuth from "./useAxiosAuth";
import { parseAsInteger, useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchParams";
import { useCallback, useMemo } from "react";

type TeamMember = z.infer<typeof teamMemberSchema>;

export const useListTeamMembers = () => {
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1),
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [selectedRole, setSelectedRole] = useQueryState(
    "role",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(50),
  );
  const axiosAuth = useAxiosAuth();
  const {
    isLoading: isLoadingTeams,
    data: teammembers,
    isError,
  } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const response = await axiosAuth.get("/users/team-members");
      const data = response.data?.data;
      // console.log(`The team : ${data}`);
      return data;
    },
  });

  const { isLoading: isLoadingRoles, data: roles } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get(`/roles?search=${searchQuery}&role=${selectedRole}&page=${currentPage}&limit=${pageSize}`);
      const results = response.data.data;

      const modifiedRoles = results.map((role: any) => ({
        value: role.id,
        label: role.name,
      }));
      return modifiedRoles;
    },
    queryKey: ["roles"],
  });


  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setSelectedRole(null);
  }, [setSearchQuery, setSelectedRole]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!selectedRole;
  }, [searchQuery, selectedRole]);

  return {
    isLoadingTeams,
    isLoadingRoles,
    roles,
    teammembers,
    isError,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    pageSize,
    setPageSize,
    selectedRole,
    setSelectedRole,
    isAnyFilterActive,
    resetFilters
  };
};
