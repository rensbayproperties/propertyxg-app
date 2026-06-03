"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";

export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface UseMediaUploadOptions {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedFileTypes?: {
    [key: string]: string[];
  };
  onUploadComplete?: (files: any[]) => void;
  onUploadError?: (error: any) => void;
  onFilesSelected?: (files: File[]) => void;
  onFilesChange?: (files: File[]) => void;
  autoUpload?: boolean;
  apiEndpoint?: string;
}

const DEFAULT_ACCEPTED_TYPES = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"],
  "video/*": [".mp4", ".mov", ".avi", ".webm"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "text/*": [".txt", ".csv"],
};

export const useMediaUpload = (options: UseMediaUploadOptions = {}) => {
  const {
    maxFiles = 10,
    maxSize = 10 * 1024 * 1024, // 10MB default
    acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
    onUploadComplete,
    onUploadError,
    onFilesSelected,
    onFilesChange,
    autoUpload = true,
    apiEndpoint = "/media/upload/multiple",
  } = options;

  const axiosAuth = useAxiosAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const filesRef = useRef<UploadedFile[]>([]);
  filesRef.current = files;

  // Notify parent about file changes
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files.map((f) => f.file));
    }
  }, [files, onFilesChange]);

  const uploadFiles = useCallback(
    async (filesToUpload?: UploadedFile[]) => {
      const targetFiles = filesToUpload ?? filesRef.current;
      const pendingFiles = targetFiles.filter((f) => f.status === "pending");

      if (pendingFiles.length === 0) {
        toast.error("No files to upload");
        return;
      }

      setIsUploading(true);

      try {
        const formData = new FormData();

        pendingFiles.forEach((uploadFile) => {
          formData.append("files", uploadFile.file);
        });

        setFiles((prev) =>
          prev.map((f) =>
            pendingFiles.some((pf) => pf.id === f.id)
              ? { ...f, status: "uploading" as const, progress: 0 }
              : f,
          ),
        );

        const response = await axiosAuth.post(apiEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;

            setFiles((prev) =>
              prev.map((f) =>
                pendingFiles.some((pf) => pf.id === f.id)
                  ? { ...f, progress: percentCompleted }
                  : f,
              ),
            );
          },
        });

        setFiles((prev) =>
          prev.map((f) =>
            pendingFiles.some((pf) => pf.id === f.id)
              ? { ...f, status: "success" as const, progress: 100 }
              : f,
          ),
        );

        toast.success("Files uploaded successfully!");

        if (onUploadComplete) {
          onUploadComplete(response.data);
        }
      } catch (error: any) {
        console.error("Upload failed:", error);

        setFiles((prev) =>
          prev.map((f) =>
            pendingFiles.some((pf) => pf.id === f.id)
              ? {
                  ...f,
                  status: "error" as const,
                  error: error?.response?.data?.message || "Upload failed",
                }
              : f,
          ),
        );

        toast.error("Upload failed", {
          description:
            error?.response?.data?.message ||
            "Could not upload files. Please try again.",
        });

        if (onUploadError) {
          onUploadError(error);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [axiosAuth, apiEndpoint, onUploadComplete, onUploadError],
  );

  // Handle file drop
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      rejectedFiles.forEach((rejection) => {
        const { file, errors } = rejection;
        errors.forEach((error: any) => {
          if (error.code === "file-too-large") {
            toast.error(`${file.name} is too large`, {
              description: `Maximum file size is ${maxSize / 1024 / 1024}MB`,
            });
          } else if (error.code === "file-invalid-type") {
            toast.error(`${file.name} has an invalid type`, {
              description: "Please upload a supported file type",
            });
          } else {
            toast.error(`Error with ${file.name}`, {
              description: error.message,
            });
          }
        });
      });

      // Handle accepted files
      if (acceptedFiles.length > 0) {
        const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
          id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 9)}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          status: "pending",
        }));

        const existingCount = filesRef.current.length;
        const availableSlots = Math.max(0, maxFiles - existingCount);

        if (availableSlots === 0) {
          newFiles.forEach((file) => URL.revokeObjectURL(file.preview));
          toast.error("Maximum files exceeded", {
            description: `You can only upload up to ${maxFiles} files`,
          });
          return;
        }

        const acceptedNew = newFiles.slice(0, availableSlots);
        const overflowFiles = newFiles.slice(availableSlots);

        if (overflowFiles.length > 0) {
          overflowFiles.forEach((file) => URL.revokeObjectURL(file.preview));
          toast.error("Maximum files exceeded", {
            description: `Only ${availableSlots} more file${availableSlots !== 1 ? "s" : ""} can be uploaded`,
          });
        }

        setFiles((prev) => [...prev, ...acceptedNew]);

        if (autoUpload && acceptedNew.length > 0) {
          // Run after React applies the pending state update so status transitions target real rows.
          queueMicrotask(() => {
            void uploadFiles(acceptedNew);
          });
        }

        if (onFilesSelected) {
          onFilesSelected(acceptedFiles);
        }
      }
    },
    [maxFiles, maxSize, autoUpload, onFilesSelected, uploadFiles],
  );

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes,
      maxSize,
      maxFiles,
      multiple: maxFiles > 1,
    });

  // Remove a file
  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  }, []);

  // Clear all files
  const clearFiles = useCallback(() => {
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
  }, [files]);

  // Retry upload for a specific file
  const retryUpload = useCallback(
    (fileId: string) => {
      setFiles((prev) => {
        const fileToRetry = prev.find((f) => f.id === fileId);
        if (!fileToRetry) return prev;
        const reset: UploadedFile = {
          ...fileToRetry,
          status: "pending",
          error: undefined,
          progress: 0,
        };
        const next = prev.map((f) => (f.id === fileId ? reset : f));
        queueMicrotask(() => {
          void uploadFiles([reset]);
        });
        return next;
      });
    },
    [uploadFiles],
  );

  // Get file type category
  const getFileType = (file: File): "image" | "video" | "document" | "other" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("sheet") ||
      file.type.includes("text")
    ) {
      return "document";
    }
    return "other";
  };

  return {
    files,
    isUploading,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    uploadFiles,
    removeFile,
    clearFiles,
    retryUpload,
    getFileType,
    hasFiles: files.length > 0,
    pendingFiles: files.filter((f) => f.status === "pending"),
    successFiles: files.filter((f) => f.status === "success"),
    errorFiles: files.filter((f) => f.status === "error"),
  };
};

