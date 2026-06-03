"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import useMedia from "@/hooks/useMedia";

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
            className="h-7 w-7 bg-black/60 hover:bg-black/80 text-white"
            onClick={handleCopy}
            aria-label="Copy image URL"
          >
            {isCopied ? (
              <Check className="h-3 w-3 text-green-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
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
            className="h-7 w-7 bg-black/60 hover:bg-black/80 text-white"
            onClick={handleOpen}
            aria-label="Open image in new tab"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Open in new tab</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const RecentUploadItem = ({ item }: { item: any }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div
      className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200"
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => setShowOverlay(false)}
    >
      <div className="relative aspect-square bg-card-alt">
        <Image
          src={item.url}
          alt={item.caption || "Recent upload"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 200px"
        />

        {/* Hover overlay with actions */}
        {showOverlay && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center gap-2 transition-opacity duration-200">
            <CopyUrlButton url={item.url} />
            <OpenImageButton url={item.url} />
          </div>
        )}
      </div>

      {/* Image info */}
      <div className="p-2">
        <div className="text-xs text-gray-600">
          {new Date(item.file_created).toLocaleDateString()}
        </div>
        {item.caption && (
          <div className="text-xs text-gray-800 mt-1 truncate" title={item.caption}>
            {item.caption}
          </div>
        )}
      </div>
    </div>
  );
};

const RecentUploads = () => {
  const { media, isLoadingMedia } = useMedia();

  // Get the 8 most recent uploads
  const recentMedia = media?.data?.slice(0, 8) || [];

  if (isLoadingMedia) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recentMedia.length === 0) {
    return (
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 text-sm">
            No recent uploads found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Uploads</CardTitle>
          <Link href="/media-library">
            <Button variant="ghost" size="sm" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] -mr-4 pr-4">
          <div className="grid grid-cols-2 gap-3">
            {recentMedia.map((item) => (
              <RecentUploadItem key={item.id} item={item} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentUploads;
