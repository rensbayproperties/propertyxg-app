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
import { CheckIcon } from "lucide-react";
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
  className?: string;
}

export function DataTableFilter({
  filterKey,
  title,
  options,
  setFilterValue,
  filterValue,
  isLoading,
  className,
}: FilterBoxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === filterValue);
  }, [filterValue, options]);

  const handleSelect = (value: string) => {
    if (filterValue === value) {
      setFilterValue(null);
    } else {
      setFilterValue(value);
    }

    setOpen(false);
  };

  const resetFilter = () => {
    setFilterValue(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          <span className="text-muted-foreground">{title}</span>

          {selectedOption && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />

              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal"
              >
                {selectedOption.label}
              </Badge>
            </>
          )}

          <i className="bi-chevron-down ml-2"></i>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0" align="start">
        {isLoading ? (
          <div className="p-4 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : (
          <Command>
            <CommandInput placeholder={`Search ${title}`} />

            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup>
                {options.length > 0 ? (
                  options.map((option, i) => {
                    const isSelected = filterValue === option.value;

                    return (
                      <CommandItem
                        key={`comoptvl__${i}`}
                        onSelect={() => handleSelect(option.value)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "opacity-50 [&_svg]:invisible"
                          )}
                        >
                          <CheckIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </div>

                        {option.icon && (
                          <option.icon
                            className="mr-2 h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                          />
                        )}

                        <span>{option.label}</span>
                      </CommandItem>
                    );
                  })
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">
                    No options available
                  </div>
                )}
              </CommandGroup>

              {selectedOption && (
                <>
                  <CommandSeparator />

                  <CommandGroup>
                    <CommandItem
                      onSelect={resetFilter}
                      className="justify-center text-center cursor-pointer"
                    >
                      Clear filter
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