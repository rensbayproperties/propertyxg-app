"use client";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import { Notification, NotificationsApiResponse } from "@/types";
import { RowSelectionState } from "@tanstack/react-table";
import { Options, parseAsInteger, useQueryState } from "nuqs";
import { searchParams } from "@/lib/searchParams";

type StringQuerySetter = (
  value: string | ((old: string) => string | null) | null,
  options?: Options<any>
) => Promise<URLSearchParams>;

type NumberQuerySetter = <Shallow>(
  value: number | ((old: number) => number | null) | null,
  options?: Options<Shallow>
) => Promise<URLSearchParams>;

interface UseNotificationsReturn {
  notifications: NotificationsApiResponse | undefined;
  isLoadingNotifications: boolean;
  handleMarkAsRead: (id: string) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;
  isMarkingAsRead: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  selectedIds: string[];
  currentPage: number;
  setCurrentPage: NumberQuerySetter;
  pageSize: number;
  setPageSize: NumberQuerySetter;
  filterStatus: "all" | "unread" | "read";
  setFilterStatus: StringQuerySetter;
  unreadCount: number;
}

const useNotifications = (): UseNotificationsReturn => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withOptions({ shallow: false, history: "push" }).withDefault(20)
  );

  const [filterStatus, setFilterStatus] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("all")
  );

  const effectiveFilterStatus =
    (filterStatus as "all" | "unread" | "read") ?? "all";

  // Fetch all notifications
  const { data: notifications, isLoading: isLoadingNotifications } = useQuery<NotificationsApiResponse>({
    queryKey: ["notifications", { currentPage, pageSize, filterStatus: effectiveFilterStatus }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', pageSize.toString());
      if (effectiveFilterStatus !== "all") {
        params.append("status", effectiveFilterStatus);
      }

      const response = await axiosAuth.get(`/notifications?${params.toString()}`);
      return response?.data?.data;
    },
    refetchOnWindowFocus: false,
  });

  // Calculate unread count
  const unreadCount = notifications?.data?.filter(n => !n.read_on).length ?? 0;

  // Mutation for marking notification as read
  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosAuth.patch('/notifications/mark-read', { id });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Notification marked as read");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      console.error("Mark as read failed:", error);
      toast.error("Failed to mark notification as read", {
        description: "Could not update the notification. Please try again.",
      });
    },
  });

  // Mutation for marking all notifications as read
  const { mutateAsync: markAllAsRead } = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notifications?.data?.filter(n => !n.read_on) ?? [];
      const markPromises = unreadNotifications.map(n =>
        axiosAuth.patch('/notifications/mark-read', { id: n.id })
      );
      return Promise.all(markPromises);
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setRowSelection({});
    },
    onError: (error: any) => {
      console.error("Mark all as read failed:", error);
      toast.error("Failed to mark all notifications as read", {
        description: "Could not update the notifications. Please try again.",
      });
    },
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    if ((notifications?.data?.filter(n => !n.read_on).length ?? 0) === 0) {
      toast.warning("No unread notifications");
      return;
    }
    await markAllAsRead();
  };

  const selectedIds = Object.keys(rowSelection)
    .filter(key => rowSelection[key])
    .map(index => notifications?.data[parseInt(index, 10)]?.id)
    .filter(id => id !== undefined) as string[];

  return {
    notifications,
    isLoadingNotifications,
    handleMarkAsRead,
    handleMarkAllAsRead,
    isMarkingAsRead,
    rowSelection,
    setRowSelection,
    selectedIds,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filterStatus: effectiveFilterStatus,
    setFilterStatus,
    unreadCount,
  };
};

export default useNotifications;

