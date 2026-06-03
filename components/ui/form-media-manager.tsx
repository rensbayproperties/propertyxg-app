"use client";

import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface MediaItem {
  id: string;
  filename?: string;
  file: {
    url: string;
    filename?: string;
  };
  created_on?: string;
  caption?: string;
}

interface MediaResponse {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data: MediaItem[];
  timestamp?: string;
}

interface FormMediaManagerProps {
  /** Whether the dialog is open */
  open?: boolean;
  /** Callback when dialog open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Trigger button (if not provided, component won't render a trigger) */
  trigger?: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Callback when media is deleted */
  onDelete?: (mediaId: string) => void;
  /** Custom API endpoint for fetching media (default: /media/connector) */
  fetchEndpoint?: string;
  entity?: string;
  entity_id?: string;
  /** Custom API endpoint for deleting media (default: /media/{id}) */
  deleteEndpoint?: (id: string) => string;
}

/**
 * FormMediaManager - A component for viewing and managing uploaded media
 *
 * Upload-on-drop is handled by FormMediaUpload / MediaUpload; this dialog only lists and deletes media from the connector.
 *
 * Displays media in a modal gallery format with delete functionality.
 * Perfect for managing media files without leaving the popup.
 * 
 * Usage:
 * 
 * ```tsx
 * import { FormMediaManager } from "@/components/ui/form-media-manager";
 * import { Button } from "@/components/ui/button";
 * 
 * function MyComponent() {
 *   const [open, setOpen] = useState(false);
 * 
 *   return (
 *     <>
 *       <Button onClick={() => setOpen(true)}>
 *         Manage Media
 *       </Button>
 *       <FormMediaManager
 *         open={open}
 *         onOpenChange={setOpen}
 *         onDelete={(id) => {
 *           console.log("Deleted:", id);
 *         }}
 *       />
 *     </>
 *   );
 * }
 * ```
 * 
 * Or with a trigger:
 * ```tsx
 * <FormMediaManager
 *   trigger={<Button>Manage Media</Button>}
 *   onDelete={(id) => console.log("Deleted:", id)}
 * />
 * ```
 */
export const FormMediaManager: React.FC<FormMediaManagerProps> = ({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  className,
  onDelete,
  entity,
  entity_id,
  fetchEndpoint = "/media/connector",
  deleteEndpoint = (id: string) => `/media/${id}`,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  // Use controlled or internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  // Fetch media from the connector endpoint
  const {
    data: mediaData,
    isLoading: isLoadingMedia,
    refetch: refetchMedia,
  } = useQuery<MediaResponse>({
    queryKey: ["connector-media", entity, entity_id],
    queryFn: async () => {
      console.log('fetchEndpoint', fetchEndpoint)
      const response = await axiosAuth.get(fetchEndpoint);
      // Handle different response structures
      if (response?.data?.data) {
        return { data: response.data.data };
      }
      if (Array.isArray(response?.data)) {
        return { data: response.data };
      }
      return { data: response?.data || [] };
    },
    enabled: !!fetchEndpoint,
    refetchOnWindowFocus: false,
  });

  const media = mediaData?.data || [];

  // Delete mutation
  const { mutateAsync: deleteMedia, isPending: isDeleting } = useMutation({
    mutationFn: async (id: string) => {
      const endpoint = deleteEndpoint(id);
      const response = await axiosAuth.delete(endpoint);
      return response?.data;
    },
    onSuccess: (_, deletedId) => {
      toast.success("Media deleted successfully");
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: ["media-manager"] });
      queryClient.invalidateQueries({ queryKey: ["legacy-media"] });
      queryClient.invalidateQueries({ queryKey: ["media"] });

      if (onDelete) {
        onDelete(deletedId);
      }
      setDeleteConfirmId(null);
    },
    onError: (error: any) => {
      console.error("Failed to delete media:", error);
      toast.error("Failed to delete media", {
        description: error?.response?.data?.message || "Could not delete media. Please try again.",
      });
      setDeleteConfirmId(null);
    },
  });

  const handleDelete = useCallback(async (id: string) => {
    await deleteMedia(id);
  }, [deleteMedia]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setDeleteConfirmId(null);
    }
  }, [setIsOpen]);

  const handleTriggerClick = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return (
    <>
      {trigger && (
        <div onClick={handleTriggerClick} className={className}>
          {trigger}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {isLoadingMedia ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {media.map((item) => {
              const url = item?.file?.url || "";
              const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
              const isVideo = url.match(/\.(mp4|mov|avi|webm)$/i);
              const isDocument = url.match(/\.(pdf|doc|docx|xls|xlsx|txt|csv)$/i);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative group rounded border border-gray-500 overflow-hidden transition-all hover:border-brand"
                  )}
                >
                  {isImage ? (
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={url}
                        alt={item.caption || item.filename || "Media"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 200px"
                      />
                    </div>
                  ) : isVideo ? (
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Video</p>
                      </div>
                    </div>
                  ) : isDocument ? (
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Document</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">File</p>
                      </div>
                    </div>
                  )}

                  {/* Delete button - appears on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 bg-red-500/90 hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(item.id);
                      }}
                      disabled={isDeleting}
                      aria-label="Delete media"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
            <ImageIcon className="h-6 w-6 text-gray-400" />
            <div>No file uploaded</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Media Manager</DialogTitle>
            <DialogDescription>
              View and manage your uploaded media files
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {isLoadingMedia ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
              </div>
            ) : media.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {media.map((item) => {
                  const url = item?.file?.url || "";
                  const isImage = url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                  const isVideo = url.match(/\.(mp4|mov|avi|webm)$/i);
                  const isDocument = url.match(/\.(pdf|doc|docx|xls|xlsx|txt|csv)$/i);

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "relative group rounded-lg border border-gray-200 overflow-hidden transition-all hover:border-brand"
                      )}
                    >
                      {isImage ? (
                        <div className="relative aspect-square bg-gray-100">
                          <Image
                            src={url}
                            alt={item.caption || item.filename || "Media"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 200px"
                          />
                        </div>
                      ) : isVideo ? (
                        <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Video</p>
                          </div>
                        </div>
                      ) : isDocument ? (
                        <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">Document</p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">File</p>
                          </div>
                        </div>
                      )}

                      {/* Delete button - appears on hover */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 bg-red-500/90 hover:bg-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(item.id);
                          }}
                          disabled={isDeleting}
                          aria-label="Delete media"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Caption overlay */}
                      {(item.caption || item?.filename) && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                          {item.caption || item?.filename}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ImageIcon className="h-12 w-12 mb-4 text-gray-400" />
                <p>No media found</p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-ts pt-4 mt-4">
            <div className="text-sm text-gray-600">
              {media.length} item{media.length !== 1 ? "s" : ""} total
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              size={"sm"}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the media file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  handleDelete(deleteConfirmId);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

