"use client";

import { useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RowSelectionState } from "@tanstack/react-table";

export interface MediaItem {
    id: string;
    url: string;
    file_type?: string;
    created_on: string;
    caption?: string;
    _count?: {
        fileConnectors?: number | null;
    };
    user?: {
        first_name?: string | null;
        last_name?: string | null;
    };
}

interface ApiResponse {
    status: string;
    message: string;
    data: MediaItem[];
    error: null | string;
}

const useMedia = (baseQuery?: string) => {
    const axiosAuth = useAxiosAuth();
    const queryClient = useQueryClient();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    // Fetch all media
    const { data: media, isLoading: isLoadingMedia } = useQuery<ApiResponse>({
        queryKey: ['media'],
        queryFn: async () => {
            const response = await axiosAuth.get('/media');
            return response?.data?.data;
        },
        refetchOnWindowFocus: false,
    });

    // Mutation for deleting media
    const { mutateAsync: deleteMedia, isPending: isDeleting } = useMutation({
        mutationFn: async (ids: string[]) => {
            const deletePromises = ids.map(id => axiosAuth.delete(`/media/${id}`));
            return Promise.all(deletePromises);
        },
        onSuccess: () => {
            toast.success("Selected media deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ['media'] });
            setRowSelection({});
        },
        onError: (error: any) => {
            console.error("Deletion failed:", error);
            toast.error("Deletion Failed", {
                description: "Could not delete the selected media. Please try again.",
            });
        },
    });

    const handleDelete = async (ids: string[]) => {
        if (ids.length === 0) {
            toast.warning("No media selected for deletion.");
            return;
        }
        await deleteMedia(ids);
    };

    const selectedIds = Object.keys(rowSelection)
        .filter(key => rowSelection[key])
        .map(index => media?.data[parseInt(index, 10)]?.id)
        .filter(id => id !== undefined);

    return {
        media,
        isLoadingMedia,
        handleDelete,
        isDeleting,
        rowSelection,
        setRowSelection,
        selectedIds,
    };
};

export default useMedia;