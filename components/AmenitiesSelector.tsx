"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type Amenity = {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
};

type AmenitiesSelectorProps = {
  title?: string;
  options: Amenity[];
  value?: string[];
  onChange: (value: string[]) => void;
  isLoading?: boolean;
};

export function AmenitiesSelector({
  title = "Amenities",
  options,
  value,
  onChange,
  isLoading,
}: AmenitiesSelectorProps) {
  const selectedValuesSet = React.useMemo(() => {
    return new Set(value || []);
  }, [value]);

  const handleSelect = (val: string) => {
    const newSet = new Set(selectedValuesSet);

    if (newSet.has(val)) {
      newSet.delete(val);
    } else {
      newSet.add(val);
    }

    onChange(Array.from(newSet));
  };

  const resetFilter = () => onChange([]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {title}

          <div className="flex items-center truncate">
            {selectedValuesSet.size > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />

                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedValuesSet.size}
                </Badge>

                <div className="hidden space-x-1 md:flex truncate gap-1">
                  {selectedValuesSet.size > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValuesSet.size} selected
                    </Badge>
                  ) : (
                    Array.from(selectedValuesSet).map((value) => (
                      <Badge
                        variant="secondary"
                        key={value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {Array.isArray(options) &&
                          options?.find((opt) => opt.id === value)?.name}
                      </Badge>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <i className="bi-chevron-down ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        {isLoading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading...</p>
        ) : (
          <Command>
            <CommandInput placeholder="Search amenities..." />

            <CommandList>
              <CommandEmpty>No amenities found.</CommandEmpty>

              <CommandGroup>
                {options?.map((option) => (
                  <CommandItem
                    key={option.id}
                    onSelect={() => handleSelect(option.id)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedValuesSet.has(option.id)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>

                    {/* {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}

                    <span>{option.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {selectedValuesSet.size > 0 && (
                <>
                  <CommandSeparator />

                  <CommandGroup>
                    <CommandItem
                      onSelect={resetFilter}
                      className="justify-center"
                    >
                      Clear amenities
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
