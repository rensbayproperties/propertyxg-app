"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value = [], onChange, placeholder }: TagInputProps) {
  const [input, setInput] = React.useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className="border rounded-md p-2 flex flex-wrap gap-2">
      {value.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag}
          <X
            className="h-3 w-3 cursor-pointer"
            onClick={() => removeTag(tag)}
          />
        </Badge>
      ))}

      <Input
        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 min-w-[120px]"
        value={input}
        placeholder={placeholder}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag(input);
          }
        }}
      />
    </div>
  );
}