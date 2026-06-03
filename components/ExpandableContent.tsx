"use client";

import { useEffect, useRef, useState } from "react";

interface ExpandableContentProps {
  content: string;
  maxLines?: number;
  className?: string;
}

export default function ExpandableContent({
  content,
  maxLines = 4,
  className = "",
}: ExpandableContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const isContentEmpty = !content || content.trim() === "";

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current;
      setShowButton(element.scrollHeight > element.clientHeight);
    }
  }, [content]);

  if (isContentEmpty) return null;

  return (
    <div className={`w-fit ${className}`}>
      <div
        ref={contentRef}
        className={`prose max-w-none text-wrap ${
          expanded ? "" : `line-clamp-${maxLines}`
        }`}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {showButton && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 mt-2 font-medium"
        >
          {expanded ? "Read Less ▲" : "Read More ▼"}
        </button>
      )}
    </div>
  );
}
