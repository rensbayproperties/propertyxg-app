"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import {
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { LeadData } from "@/types";
import { parseAsInteger, useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchParams";

export function useLeads(option: 'ALL' | 'MY') {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const axiosAuth = useAxiosAuth();
    const [customLeads, setCustomLeads] = useState<LeadData[]>([]);
    const [currentPage, setCurrentPage] = useQueryState(
        "page",
        parseAsInteger.withOptions({ shallow: false }).withDefault(1)
    );
    const [searchQuery, setSearchQuery] = useQueryState(
        "search",
        searchParams.q
            .withOptions({ shallow: false, throttleMs: 1000 })
            .withDefault("")
    );
    const [pageSize, setPageSize] = useQueryState(
        "limit",
        parseAsInteger
            .withOptions({ shallow: false, history: "push" })
            .withDefault(50)
    );
    const [assignedTo, setAssignedTo] = useQueryState(
        "assigned",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );
    const [leadType, setLeadType] = useQueryState(
        "type",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );
    const [leadStatus, setLeadStatus] = useQueryState(
        "status",
        searchParams.status.withOptions({ shallow: false }).withDefault("")
    );

    // const { data: assignees, isLoading: gettingAssignees } = useQuery({
    //   queryKey: ["assignees"],
    //   queryFn: async () => fetchData("/users/assignees"),
    // });

    // const fetchData = async (endpoint: string) => {
    //     const response = await axiosAuth.get(endpoint);
    //     return response.data.data.customfields_datapayload
    //         ? JSON.parse(response.data.data.customfields_datapayload)
    //         : response.data.data;
    // };

    // const modifiedAssignees = assignees?.users.map((assignee: any) => ({
    //   label: `${assignee?.first_name} ${assignee?.last_name}`,
    //   value: assignee?.email,
    // }))

    const [singleLeadId, setSingleLeadId] = useState<number | null>(null);

    const [columns, setColumns] = useState<any[] | null>(null);

    const columnId = useMemo(
        () => columns?.map((col) => col.leadstatus_id!),
        [columns]
    );
    const [activeColumn, setActiveColumn] = useState<any>(null);
    const [activeLead, setActiveLead] = useState<any>(null);

    const { mutateAsync: updateLead, isPending } = useMutation({
        mutationFn: ({ leadId }: { leadId: string }) => {
            const res = axiosAuth.patch(`/leads/${leadId}`, {
                status: "CLOSED",
            });
            res.then((res) => {
                if (res.data.status === 'success') {
                    queryClient.invalidateQueries({ queryKey: ["all_leads"] });
                    queryClient.invalidateQueries({ queryKey: ["leads"] });
                    queryClient.invalidateQueries({ queryKey: ["assigned_leads"] });
                }
            });
            return res;
        },
    });

    const { isLoading: gettingAllLeads, data: all_leads } = useQuery({
        queryFn: async () => {
            const response: any = await axiosAuth.get(
                `/leads/all?limit=${pageSize
                }&page=${currentPage}&type=${leadType}&status=${leadStatus}&assigned=${assignedTo}`
            );
            const result = response.data;
            return result;
        },
        queryKey: ["all_leads", { currentPage, pageSize, leadType, searchQuery, leadStatus, assignedTo }],
        enabled: option === 'ALL',
    });

    const { isLoading: gettingLeads, data: leads } = useQuery({
        queryFn: async () => {
            const response: any = await axiosAuth.get(
                `/leads?limit=${pageSize
                }&page=${currentPage}&type=${leadType}&status=${leadStatus}&assigned=${assignedTo}`
            );
            return response.data;
        },
        queryKey: ["leads", { currentPage, pageSize, leadType, searchQuery, leadStatus, assignedTo }],
        enabled: option === 'MY',
    });

    const { data: singleLead, isLoading: gettingLead } = useQuery({
        queryKey: ["lead", { singleLeadId }],
        queryFn: async () => {
            const response: any = await axiosAuth.get(`/leads/${singleLeadId}`);
            const result = response.data.data;
            return result;
        },
        enabled: !!singleLeadId,
    });

    const handleOpen = (id: number) => {
        setSingleLeadId(id);
        setOpen(true);
    };

    useEffect(() => {
        if (leads) {
            setCustomLeads(leads?.data?.leads);
        }
    }, [leads]);

    return {
        updateLead,
        leads,
        all_leads,
        gettingLeads,
        gettingAllLeads,
        customLeads,
        isPending,
        currentPage,
        setPageSize,
        pageSize,
        setCurrentPage,
        activeColumn,
        activeLead,
        columnId,
        columns,
        open,
        setOpen,
        handleOpen,
        singleLead,
        setSingleLeadId,
        gettingLead,
        leadType,
        setLeadType,
        leadStatus,
        setLeadStatus,
        searchQuery,
        setSearchQuery,
        // gettingAssignees,
        // modifiedAssignees,
        setAssignedTo,
        assignedTo
    };
}
