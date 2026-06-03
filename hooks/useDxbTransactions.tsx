"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useMemo, type Dispatch, type SetStateAction } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { parseAsInteger, useQueryState, type Options } from "nuqs";
import { searchParams } from "@/lib/searchParams";
import { RowSelectionState } from "@tanstack/react-table";
import { DxbTransaction } from "@/types";

interface DxbTransactionsApiResponse {
    data: DxbTransaction[];
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

interface UseDxbTransactionsReturn {
    transactions: DxbTransactionsApiResponse | undefined;
    isLoadingTransactions: boolean;
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
    transGroup: string;
    setTransGroup: StringQuerySetter;
    propertyType: string;
    setPropertyType: StringQuerySetter;
    areaFilter: string;
    setAreaFilter: StringQuerySetter;
    priceMin: number | null;
    setPriceMin: NullableNumberQuerySetter;
    priceMax: number | null;
    setPriceMax: NullableNumberQuerySetter;
    areaMin: number | null;
    setAreaMin: NullableNumberQuerySetter;
    areaMax: number | null;
    setAreaMax: NullableNumberQuerySetter;
    resetFilters: () => void;
    isAnyFilterActive: boolean;
}

const useDxbTransactions = (): UseDxbTransactionsReturn => {
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

    const [searchQuery, setSearchQuery] = useQueryState(
        "search",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );

    const [transGroup, setTransGroup] = useQueryState(
        "trans_group",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );

    const [propertyType, setPropertyType] = useQueryState(
        "property_type",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );

    const [areaFilter, setAreaFilter] = useQueryState(
        "area",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );

    const [priceMin, setPriceMin] = useQueryState(
        "price_min",
        parseAsInteger.withOptions({ shallow: false })
    );

    const [priceMax, setPriceMax] = useQueryState(
        "price_max",
        parseAsInteger.withOptions({ shallow: false })
    );

    const [areaMin, setAreaMin] = useQueryState(
        "area_min",
        parseAsInteger.withOptions({ shallow: false })
    );

    const [areaMax, setAreaMax] = useQueryState(
        "area_max",
        parseAsInteger.withOptions({ shallow: false })
    );

    // Fetch all DXB transactions
    const { data: transactions, isLoading: isLoadingTransactions } = useQuery<DxbTransactionsApiResponse>({
        queryKey: ['dxb-transactions', {
            currentPage,
            pageSize,
            searchQuery,
            transGroup,
            propertyType,
            areaFilter,
            priceMin,
            priceMax,
            areaMin,
            areaMax
        }],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', pageSize.toString());
            if (searchQuery) params.append('search', searchQuery);
            if (transGroup) params.append('trans_group', transGroup);
            if (propertyType) params.append('property_type', propertyType);
            if (areaFilter) params.append('area', areaFilter);
            if (priceMin) params.append('price_min', priceMin.toString());
            if (priceMax) params.append('price_max', priceMax.toString());
            if (areaMin) params.append('area_min', areaMin.toString());
            if (areaMax) params.append('area_max', areaMax.toString());

            const response = await axiosAuth.get(`/transactions?${params.toString()}`);
            return {
                data: response?.data?.data?.list || [],
                total: response?.data?.data?.total || 0,
                page: currentPage,
                limit: pageSize,
            };
        },
        refetchOnWindowFocus: false,
    });

    // Mutation for deleting transactions
    const { mutateAsync: deleteTransactions, isPending: isDeleting } = useMutation({
        mutationFn: async (ids: string[]) => {
            const deletePromises = ids.map(id => axiosAuth.delete(`/crm/dxb-transactions/${id}`));
            return Promise.all(deletePromises);
        },
        onSuccess: () => {
            toast.success("Selected transaction(s) deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['dxb-transactions'] });
            setRowSelection({});
        },
        onError: (error: any) => {
            console.error("Deletion failed:", error);
            toast.error("Deletion Failed", {
                description: error?.response?.data?.message || "Could not delete the selected transaction(s). Please try again.",
            });
        },
    });

    const handleDelete = async (ids: string[]) => {
        if (ids.length === 0) {
            toast.warning("No transactions selected for deletion.");
            return;
        }
        await deleteTransactions(ids);
    };

    const selectedIds = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(index => transactions?.data[parseInt(index, 10)]?.transaction_id)
        .filter(id => id !== undefined) as string[];

    const resetFilters = useCallback(() => {
        setSearchQuery(null);
        setTransGroup(null);
        setPropertyType(null);
        setAreaFilter(null);
        setPriceMin(null);
        setPriceMax(null);
        setAreaMin(null);
        setAreaMax(null);
    }, [
        setSearchQuery,
        setTransGroup,
        setPropertyType,
        setAreaFilter,
        setPriceMin,
        setPriceMax,
        setAreaMin,
        setAreaMax
    ]);

    const isAnyFilterActive = useMemo(() => {
        return !!searchQuery ||
            !!transGroup ||
            !!propertyType ||
            !!areaFilter ||
            !!priceMin ||
            !!priceMax ||
            !!areaMin ||
            !!areaMax;
    }, [searchQuery, transGroup, propertyType, areaFilter, priceMin, priceMax, areaMin, areaMax]);

    return {
        transactions,
        isLoadingTransactions,
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
        transGroup,
        setTransGroup,
        propertyType,
        setPropertyType,
        areaFilter,
        setAreaFilter,
        priceMin,
        setPriceMin,
        priceMax,
        setPriceMax,
        areaMin,
        setAreaMin,
        areaMax,
        setAreaMax,
        resetFilters,
        isAnyFilterActive,
    };
};

export default useDxbTransactions;

