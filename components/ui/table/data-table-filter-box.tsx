"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CheckIcon, Filter } from "lucide-react";
import { Options } from "nuqs";
import React from "react";

interface FilterOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterBoxProps {
  filterKey: string;
  title: string;
  options: FilterOption[];
  setFilterValue: (
    value: string | ((old: string) => string | null) | null,
    options?: Options<any> | undefined
  ) => Promise<URLSearchParams>;
  filterValue: string;
  isLoading?: boolean;
  delimiter?: string;
  className?: string;
}

export function DataTableFilterBox({
  filterKey,
  title,
  options,
  setFilterValue,
  filterValue,
  isLoading,
  delimiter,
  className
}: FilterBoxProps) {
  const selectedValuesSet = React.useMemo(() => {
    if (!filterValue) return new Set<string>();
    const values = filterValue.split(delimiter || ".");
    return new Set(values.filter((value) => value !== ""));
  }, [filterValue]);

  const handleSelect = (value: string) => {
    const newSet = new Set(selectedValuesSet);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }

    setFilterValue(Array.from(newSet).join(delimiter || ".") || null);
  };

  const resetFilter = () => setFilterValue(null);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          {/* <Filter className="mr-2 h-4 w-4" /> */}
          <span className="text-muted-foreground">{title}</span>
          {selectedValuesSet.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValuesSet.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValuesSet.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValuesSet.size} selected
                  </Badge>
                ) : (
                  Array.from(selectedValuesSet).map((value, i) => (
                    <Badge
                      variant="secondary"
                      key={`value_fkey_${i}`}
                      className="rounded-sm px-1 font-normal"
                    >
                      {options.find((option) => option.value === value)
                        ?.label || value}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
          <i className="bi-chevron-down"></i>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 z-[99999] -ml-10" align="start">
        {isLoading ? (
          "loading..."
        ) : (
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.length > 0 ? (
                  options &&
                  options?.map((option: any, i: number) => (
                    <CommandItem
                      key={`comoptvl__${i}`}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          selectedValuesSet.has(option.value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      </div>
                      {option.icon && (
                        <option.icon
                          className="mr-2 h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                    </CommandItem>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
              </CommandGroup>
              {selectedValuesSet.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={resetFilter}
                      className="justify-center text-center"
                    >
                      Clear filters
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
