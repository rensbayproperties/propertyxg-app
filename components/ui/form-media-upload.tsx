"use client";

import React, { useState, useCallback, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { MediaUpload } from "@/components/ui/media-upload";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Image as ImageIcon, CheckCircle2, X } from "lucide-react";
import Image from "next/image";
import useLegacyMedia from "@/hooks/useLegacyMedia";

interface FormMediaUploadProps {
  /** Form field name */
  name: string;
  /** Field label */
  label?: string;
  /** Helper text */
  description?: string;
  /** Maximum number of files */
  maxFiles?: number;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Custom accepted file types */
  acceptedFileTypes?: {
    [key: string]: string[];
  };
  /** Upload immediately on select/drop (default: true) */
  autoUpload?: boolean;
  /** API endpoint for upload */
  apiEndpoint?: string;
  /** Show compact view */
  compact?: boolean;
  /** Additional className */
  className?: string;
  /** Required field */
  required?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Callback when upload completes */
  onUploadComplete?: (files: any[]) => void;
  /** Show manual "Upload" button when autoUpload is false */
  showUploadButton?: boolean;
  /** Entity type for media association (e.g., "DXBPROJECTS", "LEAD", etc.) - Required for POST to /media/connector */
  entity: string;
  entity_id: string;
  /** Whether to associate media with entity when adding from library */
  associateOnAdd?: boolean;
}

/**
 * FormMediaUpload - A form-integrated media upload component
 * 
 * Usage with react-hook-form:
 * 
 * ```tsx
 * import { useForm } from "react-hook-form";
 * import { Form } from "@/components/ui/form";
 * import { FormMediaUpload } from "@/components/ui/form-media-upload";
 * 
 * const form = useForm({
 *   defaultValues: {
 *     media: [],
 *   },
 * });
 * 
 * <Form {...form}>
 *   <FormMediaUpload
 *     name="media"
 *     label="Upload Media"
 *     description="Upload images, videos, or documents"
 *     maxFiles={5}
 *     maxSizeMB={10}
 *     entity="DXBPROJECTS"
 *     onUploadComplete={(files) => {
 *       form.setValue("media", files);
 *     }}
 *   />
 * </Form>
 * ```
 * 
 * When you select media from the library and click "Add Selected":
 * 1. POST request is sent to /media/connector for each selected media item
 *    Format: { entity: "DXBPROJECTS", entity_id: <selected_media_id>, fileIds: [<selected_media_id>] }
 * 2. Files are then added to the form field
 * 
 * Note: entity_id is automatically set to the ID of each selected media item
 */
// LegacyMediaItem and LegacyMediaResponse are now exported from useLegacyMedia hook

export const FormMediaUpload: React.FC<FormMediaUploadProps> = ({
  name,
  label,
  description,
  maxFiles,
  maxSizeMB,
  acceptedFileTypes,
  autoUpload = true,
  apiEndpoint,
  compact,
  className,
  required,
  disabled,
  onUploadComplete,
  showUploadButton,
  entity,
  entity_id,
  associateOnAdd = true,
}) => {
  const { control } = useFormContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const skipNextChangeRef = useRef(false);
  const onChangeRef = useRef<((value: any) => void) | null>(null);

  // Fetch legacy media only when dialog is open
  const {
    legacyMedia,
    isLoadingLegacyMedia,
    associateMedia,
    isAssociating,
  } = useLegacyMedia(isDialogOpen);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedMedia(new Set());
    }
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Store the latest onChange in a ref to ensure handleFilesChange is stable
        onChangeRef.current = field.onChange;

        // Memoize the files change handler to prevent infinite loops
        // Use ref to access latest onChange, making this callback completely stable
        const handleFilesChange = useCallback((files: any[]) => {
          if (skipNextChangeRef.current) {
            skipNextChangeRef.current = false;
            return; // Skip this update as it was triggered by our own change
          }
          if (onChangeRef.current) {
            onChangeRef.current(files);
          }
        }, []); // Empty deps - onChangeRef is stable

        const handleSelectMedia = useCallback((mediaId: string) => {
          setSelectedMedia((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(mediaId)) {
              newSet.delete(mediaId);
            } else {
              // Check maxFiles limit
              const currentFiles = Array.isArray(field.value) ? field.value.length : 0;
              if (maxFiles && currentFiles + newSet.size >= maxFiles) {
                return prev; // Don't add if it would exceed maxFiles
              }
              newSet.add(mediaId);
            }
            return newSet;
          });
        }, [field.value, maxFiles]);

        const handleAddSelectedMedia = useCallback(async () => {
          console.log("handleAddSelectedMedia called", {
            selectedMediaSize: selectedMedia.size,
            legacyMediaLength: legacyMedia?.length,
            entity,
            associateMedia: !!associateMedia,
          });

          if (selectedMedia.size === 0) {
            console.log("No media selected");
            return;
          }

          if (!legacyMedia || legacyMedia.length === 0) {
            console.log("No legacy media available");
            return;
          }

          const mediaItems = legacyMedia.filter((item) =>
            selectedMedia.has(item.id)
          );

          console.log("Filtered media items:", mediaItems);

          // Convert legacy media items to the format expected by the form
          const existingFiles = Array.isArray(field.value) ? field.value : [];
          const newFiles = mediaItems.map((item) => ({
            id: item.id,
            url: item.url,
            name: item.filename || item.url.split('/').pop() || 'legacy-media',
            type: item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'image/jpeg' : 'application/octet-stream',
            size: 0, // Legacy media size unknown
            preview: item.url,
          }));

          const updatedFiles = [...existingFiles, ...newFiles];
          console.log("Updated files:", updatedFiles);

          // STEP 1: Associate media with entity via POST to /media/connector
          // This happens BEFORE adding to form (as requested)
          // For each selected media item, use its ID as entity_id
          if (associateOnAdd && entity && associateMedia && mediaItems.length > 0) {
            try {
              const fileIds = mediaItems.map((item) => item.id);

              // Send a POST request for each selected media item
              // entity_id is the ID of the selected media item itself
              const associationPromises = mediaItems.map(async (mediaItem) => {
                const payload = {
                  entity,
                  // entity_id: mediaItem.id, // Use the selected media item's ID as entity_id
                  entity_id, // Use the selected media item's ID as entity_id
                  fileIds: [mediaItem.id], // Associate the media item with itself
                };
                console.log("POST to /media/connector:", payload);
                return associateMedia(payload);
              });

              await Promise.all(associationPromises);
              console.log("✅ All media items associated successfully via POST to /media/connector");
            } catch (error) {
              console.error("❌ Failed to associate media:", error);
              // Continue even if association fails - files are still added to form
            }
          } else {
            console.log("⚠️ Skipping POST to /media/connector:", {
              associateOnAdd,
              entity,
              hasAssociateMedia: !!associateMedia,
              mediaItemsCount: mediaItems.length,
              message: !entity
                ? "entity prop is required for POST to /media/connector"
                : !associateMedia
                  ? "associateMedia function is not available"
                  : mediaItems.length === 0
                    ? "No media items selected"
                    : "associateOnAdd is false"
            });
          }

          // STEP 2: Update form field AFTER POST request
          // Set flag to skip the next onFilesChange call to prevent infinite loop
          skipNextChangeRef.current = true;
          console.log("Updating form field with:", updatedFiles);

          // Use field.onChange directly to update the form field
          field.onChange(updatedFiles);
          console.log("✅ Form field updated via field.onChange");
          console.log("Updated files array:", updatedFiles);

          // Also update the ref for consistency
          if (onChangeRef.current) {
            onChangeRef.current(updatedFiles);
          }

          if (onUploadComplete) {
            onUploadComplete(updatedFiles);
          }

          setSelectedMedia(new Set());
          setIsDialogOpen(false);
        }, [selectedMedia, legacyMedia, field.value, field.onChange, onUploadComplete, maxFiles, entity, associateOnAdd, associateMedia]);

        return (
          <FormItem className={className}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
            )}
            <FormControl>
              <div className="space-y-3">
                <Button
                  type="button"
                  // variant="dark"
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={disabled}
                  className="w-full border border-dashed border-gray-600 bg-white"
                >
                  <ImageIcon className="h-4 w-4" fill="cyan" />
                  Select from Media Library
                </Button>
                <MediaUpload
                  maxFiles={maxFiles}
                  maxSizeMB={maxSizeMB}
                  acceptedFileTypes={acceptedFileTypes}
                  autoUpload={autoUpload}
                  apiEndpoint={apiEndpoint}
                  compact={compact}
                  disabled={disabled}
                  showUploadButton={showUploadButton}
                  onFilesChange={handleFilesChange}
                  onUploadComplete={(files) => {
                    if (onUploadComplete) {
                      onUploadComplete(files);
                    }
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error);
                  }}
                />

                {/* Display files from form field (library files) */}
                {/* {Array.isArray(field.value) && field.value.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Selected Files ({field.value.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {field.value.map((file: any, index: number) => {
                        const isImage = file.url?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || file.preview?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                        const fileUrl = file.url || file.preview;
                        
                        return (
                          <div
                            key={file.id || index}
                            className="relative group rounded-lg border border-gray-200 overflow-hidden"
                          >
                            {isImage && fileUrl ? (
                              <div className="relative aspect-square bg-gray-100">
                                <Image
                                  src={fileUrl}
                                  alt={file.name || "Media"}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 200px"
                                />
                              </div>
                            ) : (
                              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6 bg-red-500/90 hover:bg-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedFiles = field.value.filter((f: any, i: number) => i !== index);
                                  field.onChange(updatedFiles);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            {file.name && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                                {file.name}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )} */}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />

            {/* Legacy Media Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Select Uploaded Media</DialogTitle>
                  <DialogDescription>
                    Choose media from your existing uploads to add to this form
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto">
                  {isLoadingLegacyMedia ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-brand" />
                    </div>
                  ) : legacyMedia && legacyMedia.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {legacyMedia.map((item) => {
                        const isSelected = selectedMedia.has(item.id);
                        const isImage = item.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "relative group cursor-pointer rounded-lg border overflow-hidden transition-all",
                              isSelected
                                ? "border-brand"
                                : "border-gray-200 hover:border-brand"
                            )}
                            onClick={() => handleSelectMedia(item.id)}
                          >
                            {isImage ? (
                              <div className="relative aspect-square bg-gray-100">
                                <Image
                                  src={item.url}
                                  alt={item.caption || item.filename || "Media"}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 200px"
                                />
                              </div>
                            ) : (
                              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {isSelected && (
                              <i className="bi-check-circle-fill absolute top-2 right-2 text-brand"></i>
                            )}
                            {item.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                {item.caption}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                      <ImageIcon className="h-12 w-12 mb-4 text-gray-400" />
                      <p>No legacy media found</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t pt-4 mt-4">
                  <div className="text-sm text-gray-600">
                    {selectedMedia.size > 0
                      ? `${selectedMedia.size} item${selectedMedia.size !== 1 ? "s" : ""} selected`
                      : "No items selected"}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedMedia(new Set());
                        setIsDialogOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="brand"
                      onClick={handleAddSelectedMedia}
                      disabled={selectedMedia.size === 0 || isAssociating}
                    >
                      {isAssociating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Adding...
                        </>
                      ) : (
                        `Add Selected (${selectedMedia.size})`
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </FormItem>
        );
      }}
    />
  );
};

