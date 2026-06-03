"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { LeadData } from "@/types";
import { parseAsInteger, useQueryState } from "nuqs";
import { arrayMove } from "@dnd-kit/sortable";
import * as z from "zod";
import { commentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { searchParams } from "@/lib/searchParams";

type CommentFormData = z.infer<typeof commentSchema>;

export function useLeadsTableFilter(opt?: string) {
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
  const { data: assignees, isLoading: gettingAssignees } = useQuery({
    queryKey: ["assignees"],
    queryFn: async () => fetchData("/users/assignees"),
  });

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data.customfields_datapayload
      ? JSON.parse(response.data.data.customfields_datapayload)
      : response.data.data;
  };

  const modifiedAssignees = assignees?.users.map((assignee: any) => ({
    label: `${assignee?.first_name} ${assignee?.last_name}`,
    value: assignee?.email,
  }))

  const [leadId, setLeadId] = useState<string | null>(null);
  const [singleLeadId, setSingleLeadId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);

  const [columns, setColumns] = useState<any[] | null>(null);
  const [kanbanLeads, setKanbanLeads] = useState<LeadData[]>([]);
  const columnId = useMemo(
    () => columns?.map((col) => col.leadstatus_id!),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<any>(null);
  const [activeLead, setActiveLead] = useState<any>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">(() => {
    const savedViewMode = localStorage.getItem("viewMode");
    return savedViewMode === "card" ? "card" : "table";
  });

  const commentForm = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const { mutateAsync: comment, isPending: isCommentPending } = useMutation({
    mutationFn: (credentials: CommentFormData) => {
      const modifiedComment = {
        ...credentials,
        type: "lead",
        type_id: Number(singleLeadId),
      };
      const res = axiosAuth.post(`/comments`, modifiedComment);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/comments/lead/${singleLeadId}`] });
      queryClient.invalidateQueries({ queryKey: [`leads`] });
      queryClient.invalidateQueries({ queryKey: [`all_leads`] });
      toast("Success", {
        description: "Comment posted successfully.",
      });
      commentForm.reset();
    },
  });

  const { mutateAsync: updateLead, isPending } = useMutation({
    mutationFn: () => {
      const res = axiosAuth.put(`/leads/${leadId}/status`, {
        lead_status: newStatus,
      });
      res.then((modifiedData) => {
        return modifiedData;
      });
      return res;
    },
  });
  const { data: status, isLoading: gettingStatus } = useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const response = await axiosAuth.get("/leads/status/all");
      const result = response.data.data;
      setColumns(result);
      return result;
    },
  });
  // const { data: lStatus } = useQuery({
  //   queryKey: ["lStatus"],
  //   queryFn: async () => {
  //     const response = await axiosAuth.get("/leads/status/all");
  //     const result = response.data.data;

  //     const modifiedData = result?.map((o: any) => ({
  //       value: o.leadstatus_title,
  //       label: o.leadstatus_title,
  //     }));

  //     return modifiedData;
  //   },
  // });
  const lead_status = [
    "NEW",
    "HOT",
    "WARM",
    "COLD",
    "CONTACTED",
    "FOLLOW_UP",
    "INTERESTED",
    "QUALIFIED",
    "NOT_QUALIFIED",
    "VIEWING_SCHEDULED",
    "VIEWED",
    "OFFER_MADE",
    "NEGOTIATION",
    "BOOKED",
    "CLOSED_WON",
    "CLOSED_LOST",
    "UNRESPONSIVE",
    "DUPLICATE"
  ]
  const lStatus = lead_status.map((s: string) => ({ value: s, label: s }));

  const { data: lTypes, isLoading: gettingLeadType } = useQuery({
    queryKey: ["lTypes"],
    queryFn: async () => {
      const response = await axiosAuth.get("/leads/type/all");

      const result = response.data.data.customfields_datapayload
        ? JSON.parse(response.data.data.customfields_datapayload)
        : response.data.data;

      const modifiedData = result?.map((o: any) => ({
        value: o,
        label: o,
      }));

      return modifiedData;
    },
  });

  // referral
  let leadUrl = `/leads/all?limit=${viewMode === "card" ? 10 : pageSize
    }&page=${currentPage}&type=${leadType}&status=${leadStatus}&assigned=${assignedTo}`
  let queryKey = "all_leads"

  if (opt === 'referral') {
    leadUrl = `/leads/referral?limit=${viewMode === "card" ? 10 : pageSize
      }&page=${currentPage}&type=${leadType}&status=${leadStatus}&assigned=${assignedTo}`
    queryKey = "referral_leads"
  }
  const { isLoading: gettingAllLeads, data: all_leads } = useQuery({
    queryFn: async () => {
      const response: any = await axiosAuth.get(leadUrl);

      const result = response.data;
      return result;
    },
    queryKey: [queryKey, { currentPage, pageSize, viewMode, leadType, searchQuery, leadStatus, assignedTo }],
  });

  const { isLoading: gettingLeads, data: leads } = useQuery({
    queryFn: async () => {
      const response: any = await axiosAuth.get(
        `/leads?limit=${viewMode === "card" ? 10 : pageSize
        }&page=${currentPage}&type=${leadType}&status=${leadStatus}&assigned=${assignedTo}`
      );
      return response.data;
    },
    queryKey: ["leads", { currentPage, pageSize, viewMode, leadType, searchQuery, leadStatus, assignedTo }],
  });

  const { isLoading: isLoadingKanban, data: kLeads } = useQuery({
    queryKey: ["kanbanLeads", { leadType, searchQuery, assignedTo }],
    queryFn: async () => {
      const response: any = await axiosAuth.get(`/leads/kanban?type=${leadType}&assigned=${assignedTo}`);
      const result = response.data;
      setKanbanLeads(result?.data.leads);
      return result.data;
    },
    enabled: viewMode === "card",
  });
  const { isLoading: isLoadingAllKanban, data: allKanbanLeads } = useQuery({
    queryKey: ["allKanbanLeads", { leadType, searchQuery, assignedTo }],
    queryFn: async () => {
      const response: any = await axiosAuth.get(`/leads/kanban/all?type=${leadType}&assigned=${assignedTo}`);
      const result = response.data;
      setKanbanLeads(result?.data.leads);
      return result.data;
    },
    enabled: viewMode === "card",
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
  const { data: comments, isLoading: isLoadingComment } = useQuery({
    queryKey: [`/comments/lead/${singleLeadId}`, { singleLeadId }],
    queryFn: async () => {
      const response: any = await axiosAuth.get(
        `/comments/lead/${singleLeadId}`
      );
      const result = response.data.data;

      return result;
    },
    enabled: !!singleLeadId,
  });

  const handleLeadStatusChange = async () => {
    try {
      await updateLead();
    } catch (err) {
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const onStartDrag = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }
    if (event.active.data.current?.type === "Lead") {
      setActiveLead(event.active.data.current.lead);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveLead(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;
  };
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveLead = active.data.current?.type === "Lead";
    const isOverLead = over.data.current?.type === "Lead";

    if (!activeLead) return;

    if (isActiveLead && isOverLead) {
      setKanbanLeads((lead) => {
        const activeIndex = lead.findIndex((t) => t.id === activeId);
        const overIndex = lead.findIndex((t) => t.id === overId);

        // if (lead[activeIndex].lead_status !== lead[overIndex].lead_status) {
        //   setLeadId(lead[activeIndex].id);
        //   setNewStatus(lead[overIndex].lead_status);
        //   handleLeadStatusChange();
        // }

        lead[activeIndex].lead_status = lead[overIndex].lead_status;
        return arrayMove(lead, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";

    // if (isActiveLead && isOverAColumn) {
    //   setKanbanLeads((lead) => {
    //     const activeIndex = lead.findIndex((t) => t.id === activeId);

    //     if (lead[activeIndex].lead_status !== overId) {
    //       setLeadId(lead[activeIndex].id);
    //       setNewStatus(overId);
    //       handleLeadStatusChange();
    //     }

    //     lead[activeIndex].lead_status = overId;
    //     return arrayMove(lead, activeIndex, activeIndex);
    //   });
    // }
  };

  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "card" : "table"));
  };
  const handleOpen = (id: string) => {
    setSingleLeadId(id);
    setOpen(true);
  };
  const handleComment = async (values: CommentFormData) => {
    try {
      await comment(values);
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const { data: selectedLead, isLoading: isLoadingSelectedLead } =
    useQuery<LeadData | null>({
      queryKey: ["dxb-project", selectedLeadId],
      enabled: !!selectedLeadId && isDialogOpen,
      queryFn: async () => {
        if (!selectedLeadId) return null;

        const response = await axiosAuth.get(
          `/leads/${selectedLeadId}`
        );
        return response?.data?.data ?? null;
      },
      refetchOnWindowFocus: false,
    });

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setLeadType(null);
    setLeadStatus(null);
    setAssignedTo(null);
  }, [setSearchQuery, setLeadType]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      !!leadStatus ||
      !!assignedTo ||
      !!leadType
    );
  }, [searchQuery, leadType, leadStatus]);

  useEffect(() => {
    if (leads) {
      setCustomLeads(leads?.data.leads);
    }
  }, [leads]);
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  return {
    leads,
    all_leads,
    gettingLeads,
    gettingAllLeads,
    status,
    gettingStatus,
    customLeads,
    isPending,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    toggleView,
    viewMode,
    sensors,
    kanbanLeads,
    activeColumn,
    activeLead,
    onDragOver,
    onStartDrag,
    columnId,
    columns,
    onDragEnd,
    open,
    setOpen,
    handleOpen,
    singleLead,
    gettingLead,
    comments,
    isLoadingComment,
    handleComment,
    isCommentPending,
    commentForm,
    kLeads,
    isLoadingKanban,
    allKanbanLeads,
    isLoadingAllKanban,
    leadType,
    setLeadType,
    lStatus,
    leadStatus,
    setLeadStatus,
    lTypes,
    gettingLeadType,
    searchQuery,
    setSearchQuery,
    resetFilters,
    isAnyFilterActive,
    gettingAssignees,
    modifiedAssignees,
    setAssignedTo,
    assignedTo,
    selectedLeadId, setSelectedLeadId,
    isDialogOpen, setIsDialogOpen,
    isLoadingSelectedLead, selectedLead
  };
}
