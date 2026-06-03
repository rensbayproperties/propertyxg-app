"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  FileText,
  Film,
  Image as ImageIcon,
  File,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useMediaUpload, UploadedFile } from "@/hooks/useMediaUpload";
import Image from "next/image";

interface MediaUploadProps {
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Maximum file size in MB */
  maxSizeMB?: number;
  /** Custom accepted file types */
  acceptedFileTypes?: {
    [key: string]: string[];
  };
  /**
   * Manual "Upload" button when autoUpload is false.
   * Defaults to showing that button whenever autoUpload is false; pass false to hide it.
   */
  showUploadButton?: boolean;
  /** Custom upload button text */
  uploadButtonText?: string;
  /** Callback when upload completes */
  onUploadComplete?: (files: any[]) => void;
  /** Callback when upload errors */
  onUploadError?: (error: any) => void;
  /** Callback when files are selected (before upload) */
  onFilesSelected?: (files: File[]) => void;
  /** Callback when the list of files changes */
  onFilesChange?: (files: File[]) => void;
  /** Upload immediately on select/drop (default: true) */
  autoUpload?: boolean;
  /** API endpoint for upload */
  apiEndpoint?: string;
  /** Additional className for the container */
  className?: string;
  /** Disable the component */
  disabled?: boolean;
  /** Show compact view */
  compact?: boolean;
  /** Custom label */
  label?: string;
  /** Helper text */
  helperText?: string;
}

const FilePreview = ({
  uploadedFile,
  onRemove,
  onRetry,
  compact,
}: {
  uploadedFile: UploadedFile;
  onRemove: () => void;
  onRetry: () => void;
  compact?: boolean;
}) => {
  const { file, preview, status, progress, error } = uploadedFile;
  const fileType = file.type.startsWith("image/")
    ? "image"
    : file.type.startsWith("video/")
      ? "video"
      : "document";

  const getFileIcon = () => {
    switch (fileType) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case "video":
        return <Film className="h-5 w-5 text-purple-500" />;
      case "document":
        return <FileText className="h-5 w-5 text-orange-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "uploading":
        return <Loader2 className="h-4 w-4 text-brand animate-spin" />;
      default:
        return null;
    }
  };

  if (compact) {
    return (
      <div
        className={cn(
          "group relative flex items-center gap-3 p-3 rounded-lg border transition-all",
          status === "error"
            ? "border-red-200 bg-red-50"
            : status === "success"
              ? "border-green-200 bg-green-50"
              : "border-gray-200 bg-white hover:border-brand",
        )}
      >
        {/* Icon/Preview */}
        <div className="flex-shrink-0">
          {fileType === "image" ? (
            <div className="relative h-12 w-12 rounded overflow-hidden bg-card-alt">
              <Image
                src={preview}
                alt={file.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded bg-card-alt flex items-center justify-center">
              {getFileIcon()}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>

          {/* Progress bar for uploading */}
          {status === "uploading" && (
            <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-brand h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Error message */}
          {status === "error" && error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2">
          {getStatusIcon()}

          {status === "error" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onRetry();
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}

          {status !== "uploading" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative rounded-lg border overflow-hidden transition-all",
        status === "error"
          ? "border-red-200"
          : status === "success"
            ? "border-green-200"
            : "border-gray-200 hover:border-brand",
      )}
    >
      {/* Preview Area */}
      <div className="relative aspect-square bg-card-alt">
        {fileType === "image" ? (
          <Image
            src={preview}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            {getFileIcon()}
          </div>
        )}

        {/* Status overlay */}
        {status === "uploading" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-white animate-spin mx-auto mb-2" />
              <span className="text-white text-sm font-medium">
                {progress}%
              </span>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
            <CheckCircle2 className="h-4 w-4 text-white" />
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center">
            <div className="text-center px-4">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-xs text-red-600">{error || "Upload failed"}</p>
            </div>
          </div>
        )}

        {/* Remove button */}
        {status !== "uploading" && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-7 w-7 bg-black/60 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Retry button for errors */}
        {status === "error" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute bottom-2 left-2 right-2 bg-white hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Retry
          </Button>
        )}
      </div>

      {/* File Info */}
      <div className="p-2 bg-white border-t border-gray-100">
        <p
          className="text-xs font-medium text-gray-900 truncate"
          title={file.name}
        >
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};

export const MediaUpload = React.forwardRef<HTMLDivElement, MediaUploadProps>(
  (
    {
      maxFiles = 10,
      maxSizeMB = 10,
      acceptedFileTypes,
      showUploadButton,
      uploadButtonText = "Upload Files",
      onUploadComplete,
      onUploadError,
      onFilesSelected,
      onFilesChange,
      autoUpload = true,
      apiEndpoint,
      className,
      disabled = false,
      compact = false,
      label,
      helperText,
    },
    ref,
  ) => {
    const addMoreInputRef = useRef<HTMLInputElement>(null);

    const {
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
      hasFiles,
      pendingFiles,
    } = useMediaUpload({
      maxFiles,
      maxSize: maxSizeMB * 1024 * 1024,
      acceptedFileTypes,
      onUploadComplete,
      onUploadError,
      onFilesSelected,
      onFilesChange,
      autoUpload,
      apiEndpoint,
    });

    const inputProps = getInputProps();

    const showManualUploadButton =
      !autoUpload &&
      pendingFiles.length > 0 &&
      showUploadButton !== false;

    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {/* Label */}
        {label && (
          <div>
            <label className="text-sm font-medium text-gray-900">{label}</label>
            {helperText && (
              <p className="text-sm text-gray-500 mt-1">{helperText}</p>
            )}
          </div>
        )}

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "relative border border-dashed rounded-lg transition-all cursor-pointer bg-white",
            isDragActive && !isDragReject && "border-brand bg-blue-50",
            isDragReject && "border-red-400 bg-red-50",
            !isDragActive &&
            !isDragReject &&
            "border-gray-500 hover:border-brand",
            disabled && "opacity-50 cursor-not-allowed pointer-events-none",
            hasFiles ? "p-4" : "p-8",
          )}
        >
          <input {...inputProps} disabled={disabled} />

          {!hasFiles ? (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-card-alt flex items-center justify-center mb-3">
                <Upload className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                {isDragActive
                  ? "Drop files here"
                  : "Drop files or click to upload"}
              </h3>
              <p className="text-xs text-gray-500">
                {autoUpload
                  ? `Up to ${maxFiles} files, max ${maxSizeMB}MB each — uploads start automatically`
                  : `Upload up to ${maxFiles} files, max ${maxSizeMB}MB each`}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-3",
                compact
                  ? "grid-cols-1"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
              )}
            >
              {files.map((uploadedFile) => (
                <FilePreview
                  key={uploadedFile.id}
                  uploadedFile={uploadedFile}
                  onRemove={() => removeFile(uploadedFile.id)}
                  onRetry={() => retryUpload(uploadedFile.id)}
                  compact={compact}
                />
              ))}

              <div className="h-full w-[90%] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brand transition aspect-square">
                <input
                  {...inputProps}
                  ref={addMoreInputRef}
                  disabled={disabled}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addMoreInputRef.current?.click();
                  }}
                  disabled={disabled}
                  className="flex flex-col items-center text-xs text-gray-700"
                >
                  <Upload className="h-6 w-6 mb-1" />
                  <span className="">Add More</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        {hasFiles && (
          <div className="flex items-center gap-2 justify-between">
            <div className="text-sm text-gray-600">
              {files.length} file{files.length !== 1 ? "s" : ""} selected
              {!autoUpload && pendingFiles.length > 0
                ? ` (${pendingFiles.length} pending)`
                : ""}
              {autoUpload && isUploading ? " — uploading…" : ""}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFiles();
                }}
                disabled={isUploading}
              >
                Clear All
              </Button>

              {showManualUploadButton && (
                <Button
                  type="button"
                  variant="warning"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadFiles();
                  }}
                  loading={isUploading}
                  disabled={isUploading}
                >
                  {uploadButtonText}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

MediaUpload.displayName = "MediaUpload";
