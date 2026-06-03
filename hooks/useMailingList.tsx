"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { searchParams } from "@/lib/searchParams";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";

const useMailingList = (opt: string = '') => {
    const [open, setOpen] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const axiosAuth = useAxiosAuth();
    const [searchQuery, setSearchQuery] = useQueryState(
        "name",
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
    const { mutateAsync: deleteContact, isPending } = useMutation({
        mutationFn: (id: any) => {
            const res = axiosAuth.delete(`/list/${id}`);
            return res;
        },
        onSuccess: () => {
            toast("Success", {
                description: "Contact deleted successfully.",
            });
        },
    });

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
        // setCategory(null);
    }, [setSearchQuery]);

    const isAnyFilterActive = useMemo(() => {
        return (
            !!searchQuery
        );
    }, [searchQuery]);

    const { data: pType, isLoading: gettingCategory } = useQuery({
        queryKey: ["listCategories"],
        queryFn: async () => {
            const response = await axiosAuth.get("/list/categories/all");
            const result = response.data.data.categories_with_adtypes;

            const modifiedData = result?.map((o: any) => ({
                value: o.slug,
                label: o.name,
            }));
            return modifiedData;
        },
    });
    const { data: contacts, isLoading: gettingContacts } = useQuery({
        queryKey: [
            "contacts",
            {
                currentPage,
                pageSize,
                searchQuery,
                listType,
            },
        ],
        queryFn: async () => {
            const invOpt = opt === 'all' ? '/all' : ''
            const response = await axiosAuth.get(
                `/contacts${invOpt}?limit=${pageSize}&page=${currentPage}&name=${searchQuery}&client_type=MAILING_LIST`
            );
            const result = response.data.contacts;
            return result;
        },
    });
    const { data: locations, isLoading: isLoadingLocaions } = useQuery({
        queryKey: ["locations"],
        queryFn: async () => {
            const res = await axiosAuth.get(`/locations`);
            const results = res.data.data.locations;
            const modifiedData = results?.map((o: any) => ({
                value: o.slug,
                label: o.name,
            }));
            return modifiedData;
        },
    });
    const handleContactDelete = async (id: any) => {
        try {
            await deleteContact(id);
            setOpen(false);
        } catch (err: any) {
            toast("Failed", {
                description: "Something went wrong. Please try again later",
            });
        }
    };

    const selectedRows = Object.keys(rowSelection).map(
        (index) => contacts?.data?.list[parseInt(index)]
    );
    const selectedIds = selectedRows.map((row) => row?.id);

    return {
        resetFilters,
        isAnyFilterActive,
        listType,
        setListType,
        searchQuery,
        setSearchQuery,
        pType,
        contacts,
        gettingContacts,
        handleContactDelete,
        open,
        setOpen,
        isPending,
        currentPage,
        setPageSize,
        pageSize,
        setCurrentPage,
        rowSelection,
        setRowSelection,
    };
};

export default useMailingList;
