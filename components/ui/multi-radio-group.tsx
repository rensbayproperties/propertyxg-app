"use client";

import * as React from "react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type MultiRadioGroupProps = {
  value?: string[];
  onChange: (value: string[]) => void;
  className?: string;
  children: React.ReactNode;
};

export const MultiRadioGroup = ({
  value = [],
  onChange,
  className,
  children,
}: MultiRadioGroupProps) => {
  const toggle = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  return (
    <div className={cn("flex gap-6", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        return React.cloneElement(child as React.ReactElement<any>, {
          checked: value.includes(child.props.value),
          onToggle: () => toggle(child.props.value),
        });
      })}
    </div>
  );
};

type MultiRadioItemProps = {
  value: string;
  checked?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const MultiRadioItem = ({
  checked,
  onToggle,
  disabled,
  children,
}: MultiRadioItemProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="flex items-center gap-2"
    >
      {/* RADIO CIRCLE */}
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border border-gray-300",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        {checked && <Circle className="h-3 w-3 fill-brand text-brand" />}
      </span>

      <span className="font-medium text-sm">{children}</span>
    </button>
  );
};
