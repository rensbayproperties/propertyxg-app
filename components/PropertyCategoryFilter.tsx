"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ListingCategory {
  id: string;
  name: string;
  description?: string;
  listingCategoryId?: string | null;
}

interface MainCategory {
  id: string;
  name: string;
  description?: string;
  listingCategories: ListingCategory[];
}

interface PropertyCategoryDropdownProps {
  options: MainCategory[];
  filterValue?: string;
  setFilterValue: (value: string) => void;
  className?: string;
  isLoading?: boolean;
  delimiter?: string;
}

const PropertyCategoryDropdown = ({
  options,
  filterValue,
  setFilterValue,
  className,
  isLoading,
  delimiter = ".",
}: PropertyCategoryDropdownProps) => {
  const [activeTab, setActiveTab] = useState("Residential");
  const [open, setOpen] = useState(false);

  /**
   * REMOVE LEGACY LAND
   */
  const filteredOptions = useMemo(() => {
    return (
      options?.filter((item) => item.name.toLowerCase() !== "legacy land") || []
    );
  }, [options]);

  /**
   * CURRENT TAB
   */
  const currentTab = useMemo(() => {
    return filteredOptions?.find(
      (item) => item.name.toLowerCase() === activeTab.toLowerCase(),
    );
  }, [activeTab, filteredOptions]);

  /**
   * SELECTED VALUES
   */
  const selectedValues = useMemo(() => {
    if (!filterValue) return [];

    return filterValue.split(delimiter).filter(Boolean);
  }, [filterValue, delimiter]);

  /**
   * SELECTED CATEGORIES
   */
  const selectedCategories = useMemo(() => {
    return filteredOptions
      ?.flatMap((item) => item.listingCategories)
      ?.filter((item) => selectedValues.includes(item.id));
  }, [selectedValues, filteredOptions]);

  /**
   * TOGGLE CATEGORY
   */
  const handleSelect = (id: string) => {
    const exists = selectedValues.includes(id);

    let updated: string[];

    if (exists) {
      updated = selectedValues.filter((item) => item !== id);
    } else {
      updated = [...selectedValues, id];
    }

    setFilterValue(updated.join(delimiter));
  };

  /**
   * RESET
   */
  const handleReset = () => {
    setFilterValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-10 px-4 border bg-white shadow-none justify-between min-w-[160px] text-sm font-medium",
            className,
          )}
        >
          <span className="truncate">
            {selectedCategories.length > 0
              ? selectedCategories.length > 2
                ? `${selectedCategories.length} selected`
                : selectedCategories.map((item) => item.name).join(", ")
              : "Category"}
          </span>

          <ChevronDown size={15} className="opacity-60" />
        </Button>
      </PopoverTrigger>

      {/* DROPDOWN */}
      <PopoverContent
        align="start"
        className="w-[420px] rounded-2xl p-4 shadow-xl"
      >
        {/* TABS */}
        <div className="flex items-center border-b mb-4">
          {filteredOptions?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.name)}
              className={cn(
                "flex-1 pb-2 text-sm font-medium transition-all border-b-2",
                activeTab === tab.name
                  ? "border-brand text-black"
                  : "border-transparent",
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-500">
            Loading categories...
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1">
              {currentTab?.listingCategories?.map((item) => {
                const isActive = selectedValues.includes(item.id);

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={cn(
                      "flex items-center gap-3 border rounded-xl px-3 py-3 transition-all text-left",
                      isActive
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-400",
                    )}
                  >
                    {/* CHECKBOX */}
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                        isActive
                          ? "border-blue-600"
                          : "border-gray-300",
                      )}
                    >
                      {isActive && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      )}
                    </div>

                    {/* LABEL */}
                    <span
                      className={cn(
                        "text-sm font-medium leading-none",
                        isActive ? "text-blue-700" : "text-gray-700",
                      )}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="flex gap-3 mt-5">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="flex-1 h-10 rounded-xl border-brand text-brand hover:bg-blue"
              >
                Reset
              </Button>

              <Button
                type="button"
                variant="brand"
                onClick={() => setOpen(false)}
                className="flex-1 h-10 rounded-xl text-white"
              >
                Done
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default PropertyCategoryDropdown;
