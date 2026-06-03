"use client";

import { useState } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MediaItem } from "@/hooks/useMedia";
import { RowSelectionState } from "@tanstack/react-table";

interface MediaGridProps {
  data: MediaItem[];
  loading: boolean;
  rowSelection: RowSelectionState;
  setRowSelection: (selection: RowSelectionState) => void;
  handleDelete: (ids: string[]) => void;
  isDeleting: boolean;
}

const CopyUrlButton = ({ url }: { url: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error("Failed to copy URL: ", err);
      }
    );
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
            onClick={handleCopy}
            aria-label="Copy image URL"
          >
            {isCopied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCopied ? "Copied!" : "Copy URL"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const OpenImageButton = ({ url }: { url: string }) => {
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
            onClick={handleOpen}
            aria-label="Open image in new tab"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Open in new tab</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MediaGridItem = ({
  item,
  index,
  isSelected,
  onToggleSelect,
  handleDelete,
  isDeleting
}: {
  item: MediaItem;
  index: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  handleDelete: (ids: string[]) => void;
  isDeleting: boolean;
}) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div
      className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      {/* Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          className="bg-white/80 border-gray-300"
          aria-label="Select image"
        />
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-card-alt">
        <Image
          src={item.url}
          alt={item.caption || ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Hover overlay with actions */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 transition-opacity duration-200">
            <CopyUrlButton url={item.url} />
            <OpenImageButton url={item.url} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-red-500/80 hover:bg-red-600/80 text-white"
                        disabled={isDeleting}
                        aria-label="Delete image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this image? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete([item.id])}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Image info */}
      <div className="p-3">
        <div className="text-sm text-gray-600">
          {new Date(item.created_on).toLocaleDateString()}
        </div>
        {item.caption && (
          <div className="text-sm text-gray-800 mt-1 truncate" title={item.caption}>
            {item.caption}
          </div>
        )}
      </div>
    </div>
  );
};

const MediaGrid = ({
  data,
  loading,
  rowSelection,
  setRowSelection,
  handleDelete,
  isDeleting
}: MediaGridProps) => {
  const selectedCount = Object.keys(rowSelection).filter(key => rowSelection[key]).length;
  const allSelected = data.length > 0 && selectedCount === data.length;

  const toggleAllSelection = () => {
    if (allSelected) {
      setRowSelection({});
    } else {
      const newSelection: RowSelectionState = {};
      data.forEach((_, index) => {
        newSelection[index] = true;
      });
      setRowSelection(newSelection);
    }
  };

  const toggleItemSelection = (index: number) => {
    const newSelection: RowSelectionState = {
      ...rowSelection,
      [index]: !rowSelection[index]
    };
    setRowSelection(newSelection);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">No media files found</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selection controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleAllSelection}
            aria-label="Select all images"
          />
          <span className="text-sm text-gray-600">
            Select All ({selectedCount} of {data.length} selected)
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.map((item, index) => (
          <MediaGridItem
            key={item.id}
            item={item}
            index={index}
            isSelected={!!rowSelection[index]}
            onToggleSelect={() => toggleItemSelection(index)}
            handleDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </div>
  );
};

export default MediaGrid;
