"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterData {
    areas: FilterOption[];
    developers: FilterOption[];
}

const useDxbProjectsFilters = () => {
    const axiosAuth = useAxiosAuth();

    // Fetch unique areas and developers for filters
    const { data: filterData, isLoading: isLoadingFilters } = useQuery<FilterData>({
        queryKey: ['dxb-projects-filters'],
        queryFn: async () => {
            const response = await axiosAuth.get('/dxb-projects/filters');
            return response?.data?.data;
        },
        refetchOnWindowFocus: false,
    });

    return {
        areas: filterData?.areas || [],
        developers: filterData?.developers || [],
        isLoadingFilters,
    };
};

export default useDxbProjectsFilters;

