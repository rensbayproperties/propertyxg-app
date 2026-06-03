import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UrlCopyTooltipProps {
  url: string;
  displayText?: string;
}

const UrlCopyTooltip: React.FC<UrlCopyTooltipProps> = ({ url, displayText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      toast.success("URL copied to clipboard!");
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleUrlClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm opacity-60 truncate max-w-[200px] cursor-pointer hover:opacity-80 hover:underline block"
            onClick={handleUrlClick}
          >
            {displayText || url}
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-2">
          <div className="flex items-center gap-2">
            <span className="text-xs max-w-[200px] truncate">{url}</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopy}
                title="Copy URL"
              >
                {isCopied ? (
                  <Check className="h-3 w-3 text-green-600" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(url, '_blank', 'noopener,noreferrer');
                }}
                title="Open in new tab"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UrlCopyTooltip;