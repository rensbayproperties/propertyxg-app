"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import { buildLeadImportPayload } from "@/lib/lead-import";
import { uploadSingleMediaFile } from "@/lib/media-upload";
import {
  LeadImportColumnOption,
  LeadImportResult,
  ListingImportMutationInput,
} from "@/types";

const fallbackPropertyColumns: LeadImportColumnOption[] = [
  { key: "title", label: "Title", required: true, type: "string" },
  { key: "price", label: "Price", type: "number" },
  { key: "location", label: "Location", type: "string" },
  { key: "category", label: "Category", type: "string" },
  { key: "ad_type", label: "Ad Type", type: "string" },
];

export const usePropertyBulkImport = () => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  const propertyColumnsQuery = useQuery({
    queryKey: ["listing-import-columns"],
    enabled: false,
    refetchOnMount: "always",
    staleTime: 0,
    queryFn: async (): Promise<LeadImportColumnOption[]> => {
      try {
        const response = await axiosAuth.get("/listing-import/columns");
        const payload = response?.data?.data ?? response?.data ?? [];
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.columns)) return payload.columns;
        return fallbackPropertyColumns;
      } catch {
        return fallbackPropertyColumns;
      }
    },
  });

  const importMutation = useMutation({
    mutationFn: async (input: ListingImportMutationInput): Promise<LeadImportResult> => {
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
      if (input.amenityMappings?.length) {
        payload.amenityMappings = input.amenityMappings;
      }
      const response = await axiosAuth.post("/listing-import", payload);
      const result = response?.data ?? response;

      if (!result) {
        throw new Error("Empty import response from server.");
      }

      if (result?.success === false || result?.status === "error") {
        throw new Error(result?.message || "Unable to import properties.");
      }

      return result;
    },
    onSuccess: (result) => {
      toast.success(result?.message || "Properties imported successfully.");
      queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || "Unable to import properties."
      );
    },
  });

  return {
    propertyColumns: propertyColumnsQuery.data ?? [],
    isLoadingColumns: propertyColumnsQuery.isLoading,
    isFetchingColumns: propertyColumnsQuery.isFetching,
    refetchPropertyColumns: propertyColumnsQuery.refetch,
    importProperties: importMutation.mutateAsync,
    isImporting: importMutation.isPending,
  };
};
