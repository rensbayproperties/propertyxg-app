"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import {
  buildLeadImportPayload,
  normalizeLeadImportColumn,
  parseLeadImportColumnsApiResponse,
} from "@/lib/lead-import";
import { uploadSingleMediaFile } from "@/lib/media-upload";
import { LeadImportColumnOption, LeadImportMutationInput, LeadImportResult } from "@/types";

/** Used when the columns API has not returned yet or failed. None are marked required client-side — the server validates on import. */
const fallbackLeadColumnsRaw = [
  { key: "lead_id", label: "Lead ID", required: false, type: "string", example: "LD-1001" },
  { key: "title", label: "Title", required: false, type: "string", example: "Looking for 2BR in Marina" },
  { key: "full_name", label: "Full Name", required: false, type: "string", example: "John Doe" },
  { key: "email", label: "Email", required: false, type: "email", example: "john@example.com" },
  { key: "phone", label: "Phone", required: false, type: "phone", example: "+971500000000" },
  { key: "source", label: "Lead Source", required: false, type: "string", example: "Website" },
  { key: "lead_status", label: "Lead Status", required: false, type: "string", example: "NEW" },
] as const;

const fallbackLeadColumns: LeadImportColumnOption[] = fallbackLeadColumnsRaw
  .map((c) => normalizeLeadImportColumn(c))
  .filter((c): c is LeadImportColumnOption => c != null);

export const useLeadBulkImport = () => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  const leadColumnsQuery = useQuery({
    queryKey: ["lead-import-columns"],
    enabled: false,
    refetchOnMount: "always",
    staleTime: 0,
    queryFn: async (): Promise<LeadImportColumnOption[]> => {
      try {
        const response = await axiosAuth.get("/lead-import/columns");
        const root = response?.data?.data ?? response?.data;
        const parsed = parseLeadImportColumnsApiResponse(root);
        if (parsed.length > 0) return parsed;
        return fallbackLeadColumns;
      } catch {
        return fallbackLeadColumns;
      }
    },
  });

  const importMutation = useMutation({
    mutationFn: async (input: LeadImportMutationInput): Promise<LeadImportResult> => {
      const uploadedMediaId = await uploadSingleMediaFile(axiosAuth, input.file);
      const payload = buildLeadImportPayload(
        input.fileMeta,
        input.sheetName,
        input.mapping,
        uploadedMediaId
      );
      if (input.relationshipMappings && Object.keys(input.relationshipMappings).length > 0) {
        payload.relationshipMappings = input.relationshipMappings;
      }
      const response = await axiosAuth.post("/lead-import", payload);
      const result = response?.data ?? response;

      if (!result) {
        throw new Error("Empty import response from server.");
      }

      if (result?.success === false || result?.status === "error") {
        throw new Error(result?.message || "Unable to import leads.");
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result?.message || "Leads imported successfully.");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["all_leads"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Unable to import leads."
      );
    },
  });

  const resolvedColumns =
    leadColumnsQuery.data && leadColumnsQuery.data.length > 0
      ? leadColumnsQuery.data
      : fallbackLeadColumns;

  return {
    /** Always non-empty: API result when fetched, otherwise UI fallback (no client-side required flags on fallback). */
    leadColumns: resolvedColumns,
    isLoadingColumns: leadColumnsQuery.isLoading,
    isFetchingColumns: leadColumnsQuery.isFetching,
    refetchLeadColumns: leadColumnsQuery.refetch,
    importLeads: importMutation.mutateAsync,
    isImporting: importMutation.isPending,
  };
};
