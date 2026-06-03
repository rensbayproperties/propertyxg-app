"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";

interface FilterOption {
    label: string;
    value: string;
}

interface FilterData {
    areas: FilterOption[];
    propertyTypes: FilterOption[];
    transGroups: FilterOption[];
}

const useDxbTransactionsFilters = () => {
    const axiosAuth = useAxiosAuth();

    // Fetch unique options for filters
    const { data: filterData, isLoading: isLoadingFilters } = useQuery<FilterData>({
        queryKey: ['dxb-transactions-filters'],
        queryFn: async () => {
            const response = await axiosAuth.get('/crm/dxb-transactions/filters');
            return response?.data?.data;
        },
        refetchOnWindowFocus: false,
    });

    return {
        areas: filterData?.areas || [],
        propertyTypes: filterData?.propertyTypes || [],
        transGroups: filterData?.transGroups || [],
        isLoadingFilters,
    };
};

export default useDxbTransactionsFilters;

