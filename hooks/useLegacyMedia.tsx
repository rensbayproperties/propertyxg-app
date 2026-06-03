"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";

export interface LegacyMediaItem {
  id: string;
  url: string;
  created_on?: string;
  caption?: string;
  filename?: string;
}

interface LegacyMediaResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: LegacyMediaItem[];
  timestamp?: string;
}

interface ConnectorMediaResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data?: any;
  timestamp?: string;
}

interface AssociateMediaParams {
  entity: string;
  entity_id: string;
  fileIds: string[];
}

/**
 * Hook for managing legacy uploaded media
 * 
 * @param enabled - Whether to fetch legacy media (default: true)
 * @returns Object containing legacy media data, loading states, and mutation functions
 */
export const useLegacyMedia = (enabled: boolean = true) => {
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  // Fetch legacy media from /crm/legacy-upload
  const {
    data: legacyMedia,
    isLoading: isLoadingLegacyMedia,
    error: legacyMediaError,
    refetch: refetchLegacyMedia,
  } = useQuery<LegacyMediaResponse>({
    queryKey: ['legacy-media'],
    queryFn: async () => {
      const response = await axiosAuth.get('/media');
      return response?.data?.data;
    },
    enabled,
    refetchOnWindowFocus: false,
  });

  // Fetch media for a specific entity using GET /media/connector
  const fetchConnectorMedia = (entity: string, entity_id: string) => {
    return useQuery<ConnectorMediaResponse>({
      queryKey: ['connector-media', entity, entity_id],
      queryFn: async () => {
        const response = await axiosAuth.get(
          `/media/connector/${entity}/${entity_id}`
        );
        return response?.data;
      },
      enabled: !!entity && !!entity_id,
      refetchOnWindowFocus: false,
    });
  };

  // Mutation to associate media with an entity using POST /media/connector
  const { mutateAsync: associateMedia, isPending: isAssociating } = useMutation({
    mutationFn: async (params: AssociateMediaParams) => {
      const response = await axiosAuth.post('/media/connector', {
        entity: params.entity,
        entity_id: params.entity_id,
        fileIds: params.fileIds,
      });
      return response?.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Media associated successfully");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['connector-media', variables.entity, variables.entity_id] });
      queryClient.invalidateQueries({ queryKey: ['legacy-media'] });
    },
    onError: (error: any) => {
      console.error("Failed to associate media:", error);
      toast.error("Failed to associate media", {
        description: error?.response?.data?.message || "Could not associate media. Please try again.",
      });
    },
  });

  /**
   * Associate legacy media with an entity
   * 
   * @param imageId - The ID of the selected image (used as entity_id)
   * @param fileIds - Array of file IDs to associate
   */
  const associateLegacyMedia = async (imageId: string, fileIds: string[]) => {
    return associateMedia({
      entity: "LEGACYMEDIA",
      entity_id: imageId,
      fileIds,
    });
  };

  return {
    // Legacy media data
    legacyMedia: legacyMedia?.data || [],
    isLoadingLegacyMedia,
    legacyMediaError,
    refetchLegacyMedia,

    // Connector media functions
    fetchConnectorMedia,

    // Association functions
    associateMedia,
    associateLegacyMedia,
    isAssociating,
  };
};

export default useLegacyMedia;

