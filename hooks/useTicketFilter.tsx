"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TicketData } from "@/types";
import { parseAsInteger, useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchParams";

export function useTicketFilter(option: 'ALL' | 'ASSIGNED' | 'MY') {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const axiosAuth = useAxiosAuth();
  const [customTickets, setCustomTickets] = useState<TicketData[]>([]);
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
  const [ticketType, setTicketType] = useQueryState(
    "type",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [ticketStatus, setTicketStatus] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  // const { data: assignees, isLoading: gettingAssignees } = useQuery({
  //   queryKey: ["assignees"],
  //   queryFn: async () => fetchData("/users/assignees"),
  // });

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data.customfields_datapayload
      ? JSON.parse(response.data.data.customfields_datapayload)
      : response.data.data;
  };

  // const modifiedAssignees = assignees?.users.map((assignee: any) => ({
  //   label: `${assignee?.first_name} ${assignee?.last_name}`,
  //   value: assignee?.email,
  // }))

  const [singleTicketId, setSingleTicketId] = useState<number | null>(null);

  const [columns, setColumns] = useState<any[] | null>(null);

  const columnId = useMemo(
    () => columns?.map((col) => col.ticketstatus_id!),
    [columns]
  );
  const [activeColumn, setActiveColumn] = useState<any>(null);
  const [activeLead, setActiveTicket] = useState<any>(null);


  const { mutateAsync: updateTicket, isPending } = useMutation({
    mutationFn: ({ ticketId }: { ticketId: string }) => {
      const res = axiosAuth.patch(`/tickets/${ticketId}`, {
        status: "CLOSED",
      });
      res.then((res) => {
        if (res.data.success === true) {
          toast("Success", {
            description: "Ticket successfully closed",
          });

          queryClient.invalidateQueries({ queryKey: ["all_tickets"] });
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
          queryClient.invalidateQueries({ queryKey: ["assigned_tickets"] });
        }
      });
      return res;
    },
  });

  const { isLoading: gettingAllTickets, data: all_tickets } = useQuery({
    queryFn: async () => {
      const response: any = await axiosAuth.get(
        `/tickets/all?limit=${pageSize
        }&page=${currentPage}&type=${ticketType}&status=${ticketStatus}&assigned=${assignedTo}`
      );
      const result = response.data;
      return result;
    },
    queryKey: ["all_tickets", { currentPage, pageSize, ticketType, searchQuery, ticketStatus, assignedTo }],
    enabled: option === 'ALL',
  });

  const { isLoading: gettingTickets, data: tickets } = useQuery({
    queryFn: async () => {
      const response: any = await axiosAuth.get(
        `/tickets?limit=${pageSize
        }&page=${currentPage}&type=${ticketType}&status=${ticketStatus}&assigned=${assignedTo}`
      );
      return response.data;
    },
    queryKey: ["tickets", { currentPage, pageSize, ticketType, searchQuery, ticketStatus, assignedTo }],
    enabled: option === 'MY',
  });

  const { isLoading: gettingassignedTickets, data: assigned_tickets } = useQuery({
    queryFn: async () => {
      const response: any = await axiosAuth.get(
        `/tickets/assigned?limit=${pageSize
        }&page=${currentPage}&type=${ticketType}&status=${ticketStatus}&assigned=${assignedTo}`
      );
      return response.data;
    },
    queryKey: ["assigned_tickets", { currentPage, pageSize, ticketType, searchQuery, ticketStatus, assignedTo }],
    enabled: option === 'ASSIGNED',
  });

  const { data: singleTicket, isLoading: gettingTicket } = useQuery({
    queryKey: ["ticket", { singleTicketId }],
    queryFn: async () => {
      const response: any = await axiosAuth.get(`/tickets/${singleTicketId}`);
      const result = response.data.data;
      return result;
    },
    enabled: !!singleTicketId,
  });

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
    if (event.active.data.current?.type === "Ticket") {
      setActiveTicket(event.active.data.current.ticket);
      return;
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTicket(null);
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

    if (!activeLead) return;
  }
  const handleOpen = (id: number) => {
    setSingleTicketId(id);
    setOpen(true);
  };

  useEffect(() => {
    if (tickets) {
      setCustomTickets(tickets?.data?.tickets);
    }
  }, [tickets]);

  return {
    updateTicket,
    assigned_tickets,
    tickets,
    all_tickets,
    gettingassignedTickets,
    gettingTickets,
    gettingAllTickets,
    customTickets,
    isPending,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    sensors,
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
    singleTicket,
    setSingleTicketId,
    gettingTicket,
    ticketType,
    setTicketType,
    ticketStatus,
    setTicketStatus,
    searchQuery,
    setSearchQuery,
    // gettingAssignees,
    // modifiedAssignees,
    setAssignedTo,
    assignedTo
  };
}
