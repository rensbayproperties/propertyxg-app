"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { searchParams } from "@/lib/searchParams";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";

const useTenants = (opt: string = "") => {
    const [open, setOpen] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const axiosAuth = useAxiosAuth();
   const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useQueryState(
        "full_name",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );
    const [assignedTo, setAssignedTo] = useQueryState(
        "assigned",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );
    const [minPrice, setMinPrice] = useQueryState(
        "min",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );
    const [maxPrice, setMaxPrice] = useQueryState(
        "max",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );
    const [beds, setBeds] = useQueryState(
        "beds",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );
    const [baths, setBaths] = useQueryState(
        "baths",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );

    const [category, setCategory] = useQueryState(
        "category",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );
    const [location, setLocation] = useQueryState(
        "location",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );

    const [listType, setListType] = useQueryState(
        "ad_type",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );

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

    const resetFilters = useCallback(() => {
        setSearchQuery(null);
        setCategory(null);
        setLocation(null);
        setListType(null);
        setMinPrice(null);
        setMaxPrice(null);
        setBeds(null);
        setBaths(null);
        setAssignedTo(null);
    }, [setSearchQuery, setCategory]);

    const isAnyFilterActive = useMemo(() => {
        return (
            !!searchQuery ||
            !!category ||
            !!category ||
            !!location ||
            !!listType ||
            !!beds ||
            !!baths ||
            !!minPrice ||
            !!assignedTo ||
            !!maxPrice
        );
    }, [
        searchQuery,
        category,
        category,
        location,
        listType,
        minPrice,
        maxPrice,
        beds,
        baths,
        assignedTo,
    ]);

    const { data: tenants, isLoading: gettingTenants } = useQuery({
        queryKey: [
            "tenants",
            {
                currentPage,
                pageSize,
                searchQuery,
                location,
                listType,
                category,
                minPrice,
                maxPrice,
                beds,
                baths,
                assignedTo,
            },
        ],
        queryFn: async () => {
            const response = await axiosAuth.get(
                `/tenant/${opt}?limit=${pageSize}&page=${currentPage}&full_name=${searchQuery}&location=${location}&ad_type=${listType}&category=${category}&min_price=${minPrice}&max_price=${maxPrice}&bedrooms=${beds}&bathrooms=${baths}&assigned=${assignedTo}`
            );
            const result = response.data.data;
            console.log("the tenants", result.tenants)
            return result;
        },
    });

        const { mutateAsync: deleteTenant, isPending } = useMutation({
        mutationFn: (id: any) => {
            const res = axiosAuth.delete(`/tenants/${id}`);
            return res;
        },
        onSuccess: () => {
            toast("Success", {
                description: "Tenant deleted successfully.",
            });
            queryClient.invalidateQueries({ queryKey: ["tenants"] });
        },
    });

    const { data: assignees, isLoading: isLoadingAssignees } = useQuery({
        queryKey: ["landlords"],
        queryFn: async () => fetchData("/properties/landlords"),
    });

    const modifiedAssignees = assignees?.map((assignee: any) => ({
        label: `${assignee?.name}`,
        value: assignee?.email,
    }));

    const fetchData = async (endpoint: string) => {
        const response = await axiosAuth.get(endpoint);
        return response.data.data.customfields_datapayload
            ? JSON.parse(response.data.data.customfields_datapayload)
            : response.data.data;
    };

    const handleTenantDelete = async (id: any) => {
        try {
            await deleteTenant(id);
            setOpen(false);
        } catch (err: any) {
            toast("Failed", {
                description: "Something went wrong. Please try again later",
            });
        }
    };

    const selectedRows = Object.keys(rowSelection).map(
        (index) => tenants?.data?.list[parseInt(index)]
    );
    const selectedIds = selectedRows.map((row) => row?.id);

    return {
        resetFilters,
        isAnyFilterActive,
        category,
        setCategory,
        location,
        setLocation,
        listType,
        setListType,
        searchQuery,
        setSearchQuery,
        tenants,
        gettingTenants,
        handleTenantDelete,
        open,
        setOpen,
        isPending,
        currentPage,
        setPageSize,
        pageSize,
        setCurrentPage,
        rowSelection,
        setRowSelection,
        selectedIds,
        setOpenShare,
        openShare,
        setMaxPrice,
        maxPrice,
        setMinPrice,
        minPrice,
        beds,
        setBeds,
        baths,
        setBaths,
        modifiedAssignees,
        isLoadingAssignees,
        assignedTo,
        setAssignedTo,
    };
};

export default useTenants;
