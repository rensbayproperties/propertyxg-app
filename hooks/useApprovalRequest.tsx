"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { RowSelectionState } from "@tanstack/react-table";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import { ApprovalRequest, RequestCredentials } from "@/types";

const sortByNewest = (items: ApprovalRequest[]) =>
  [...items].sort((a, b) => {
    const dateA = a.created_on ? new Date(a.created_on).getTime() : 0;
    const dateB = b.created_on ? new Date(b.created_on).getTime() : 0;

    if (dateA !== dateB) return dateB - dateA;
    return (b.id ?? 0) - (a.id ?? 0);
  });

export default function useApprovalRequest() {
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
      .withDefault(10)
  );

  const { data: allRequests, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const response = await axiosAuth.get("/approvals");
      return response?.data?.data ?? { approvals: [], total: 0 };
    },
  });

  const requests = useMemo(() => {
    const normalized = Array.isArray(allRequests?.approvals)
      ? (allRequests.approvals as ApprovalRequest[])
      : [];

    const filtered = normalized.filter((approval) => approval?.payload?.prev !== null);
    const sorted = sortByNewest(filtered);

    const start = (currentPage - 1) * pageSize;
    const paginated = sorted.slice(start, start + pageSize);

    return {
      approvals: paginated,
      total: sorted.length,
    };
  }, [allRequests, currentPage, pageSize]);

  const selectedIds = useMemo(
    () =>
      Object.keys(rowSelection)
        .map((rowId) => requests.approvals[Number(rowId)]?.id)
        .filter((id): id is number => typeof id === "number"),
    [requests.approvals, rowSelection]
  );

  const onMutationSuccess = (message: string) => {
    toast("Success", { description: message });
    queryClient.invalidateQueries({ queryKey: ["requests"] });
    setRowSelection({});
  };

  const onMutationError = (fallbackMessage: string, error: any) => {
    toast("Failed", {
      description: error?.response?.data?.message || fallbackMessage,
    });
  };

  const { mutateAsync: updateRequest, isPending: isUpdatingRequest } = useMutation({
    mutationFn: (payload: RequestCredentials) => axiosAuth.post("/approvals", payload),
    onSuccess: () => onMutationSuccess("Request updated successfully."),
    onError: (error: any) => onMutationError("Unable to update request.", error),
  });

  const { mutateAsync: massApprove, isPending: isMassApproving } = useMutation({
    mutationFn: (ids: number[]) => axiosAuth.post("/approvals/mass-approve", { ids }),
    onSuccess: () => onMutationSuccess("Requests approved successfully."),
    onError: (error: any) => onMutationError("Unable to approve selected requests.", error),
  });

  const { mutateAsync: massDecline, isPending: isMassDeclining } = useMutation({
    mutationFn: (ids: number[]) => axiosAuth.post("/approvals/mass-decline", { ids }),
    onSuccess: () => onMutationSuccess("Requests rejected successfully."),
    onError: (error: any) => onMutationError("Unable to reject selected requests.", error),
  });

  const { mutateAsync: massDelete, isPending: isMassDeleting } = useMutation({
    mutationFn: (ids: number[]) => axiosAuth.post("/approvals/mass-delete", { ids }),
    onSuccess: () => onMutationSuccess("Requests deleted successfully."),
    onError: (error: any) => onMutationError("Unable to delete selected requests.", error),
  });

  const handleApprove = async (id: number) => updateRequest({ id, status: "approve" });
  const handleReject = async (id: number) => updateRequest({ id, status: "decline" });
  const handleDelete = async (id: number) => massDelete([id]);

  const handleMassApprove = async () => {
    if (!selectedIds.length) {
      toast("Warning", { description: "No requests selected for approval." });
      return;
    }
    await massApprove(selectedIds);
  };

  const handleMassDecline = async () => {
    if (!selectedIds.length) {
      toast("Warning", { description: "No requests selected for rejection." });
      return;
    }
    await massDecline(selectedIds);
  };

  const handleMassDelete = async () => {
    if (!selectedIds.length) {
      toast("Warning", { description: "No requests selected for deletion." });
      return;
    }
    await massDelete(selectedIds);
  };

  return {
    requests,
    isLoading,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    rowSelection,
    setRowSelection,
    selectedIds,
    handleApprove,
    handleReject,
    handleDelete,
    handleMassApprove,
    handleMassDecline,
    handleMassDelete,
    isApproving: isMassApproving || isUpdatingRequest,
    isRejecting: isMassDeclining || isUpdatingRequest,
    isDeleting: isMassDeleting,
  };
}
