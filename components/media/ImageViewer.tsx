"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy, Check, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MediaItem } from "@/hooks/useMedia";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ImageViewerProps {
  item: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer = ({ item, isOpen, onClose }: ImageViewerProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setImageLoaded(false);
      setIsCopied(false);
    }
  }, [isOpen]);

  const handleCopyUrl = async () => {
    if (!item?.url) return;
    try {
      await navigator.clipboard.writeText(item.url);
      setIsCopied(true);
      toast.success("URL copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleOpenInNewTab = () => {
    if (!item?.url) return;
    window.open(item.url, "_blank");
  };

  const handleDownload = () => {
    if (!item?.url) return;
    const link = document.createElement("a");
    link.href = item.url;
    link.download = item.caption || "image";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started!");
  };

  const formatDate = (value: string) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-transparent shadow-none overflow-hidden">
        {/* Backdrop with blur */}
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-40" />

        {/* Main content container */}
        <div className="relative z-50 w-full h-full flex flex-col">
          {/* Top bar with metadata and actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-transparent p-6"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Metadata */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary/80">
                    {item.file_type || "IMAGE"}
                  </span>
                </div>
                {item.caption && (
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {item.caption}
                  </h3>
                )}
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span>Uploaded: {formatDate(item.created_on)}</span>
                  <span className="font-mono text-[10px] opacity-60">
                    {item.id.slice(0, 8)}...
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenInNewTab}
                  className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-8 pt-24 pb-20 overflow-hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: imageLoaded ? 1 : 0.9, opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full h-full max-w-7xl max-h-full"
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black/20 backdrop-blur-sm">
                <Image
                  src={item.url}
                  alt={item.caption || "Media preview"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1920px) 100vw, 1920px"
                  priority
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom info bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-xs font-medium text-primary">
                    {item.file_type?.toUpperCase() || "IMAGE"}
                  </span>
                </div>
                {item.caption && (
                  <p className="text-sm text-white/80 line-clamp-1">
                    {item.caption}
                  </p>
                )}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/60 hover:text-white/80 transition-colors font-mono truncate max-w-md"
              >
                {item.url}
              </a>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;

