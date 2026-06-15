"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LocationProjectSearchDropdown from "@/components/LocationProjectSearchDropdown";
import PropertyCategoryDropdown from "@/components/PropertyCategoryFilter";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import ExtraFilter from "@/components/search/ExtraFilter";
import PriceFilter from "@/components/search/PriceFilter";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";
import { Options } from "nuqs";

interface HeroSearchFiltersProps {
  general: WebsiteGeneral;
}

export function HeroSearchFilters({ general }: HeroSearchFiltersProps) {
  const router = useRouter();
  const primaryColor = general?.primaryColor || "#0166FF";

  // Local state for the filter builder
  const [dealType, setDealType] = useState<string>("SALE");
  const [locationId, setLocationId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("1000");
  const [maxPrice, setMaxPrice] = useState<string>("1000000000000000000");
  const [bedroom, setBedroom] = useState<string>("");
  const [bathroom, setBathroom] = useState<string>("");
  const [language, setLanguage] = useState<string>("");

  const [showAllFilters, setShowAllFilters] = useState(false);

  // Helper to convert standard React useState setters into type-compliant nuqs-like setters
  const createNuqsCompatibleSetter = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    currentValue: string
  ) => {
    return <Shallow,>(
      value: string | ((old: string) => string | null) | null,
      options?: Options<Shallow> | undefined
    ): Promise<URLSearchParams> => {
      let resolved: string | null = "";
      if (typeof value === "function") {
        resolved = value(currentValue);
      } else {
        resolved = value;
      }
      setter(resolved || "");
      return Promise.resolve(new URLSearchParams());
    };
  };

  const nuqsMaxPriceSetter = createNuqsCompatibleSetter(setMaxPrice, maxPrice);
  const nuqsMinPriceSetter = createNuqsCompatibleSetter(setMinPrice, minPrice);
  const nuqsBedroomSetter = createNuqsCompatibleSetter(setBedroom, bedroom);
  const nuqsBathroomSetter = createNuqsCompatibleSetter(setBathroom, bathroom);
  const nuqsLanguageSetter = createNuqsCompatibleSetter(setLanguage, language);

  // Fetch categories using public route
  const { data: allcategories, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const apiBase =
        process.env.NEXT_PUBLIC_BACKEND_API ||
        "https://crm-api-production-6031.up.railway.app";
      const res = await fetch(`${apiBase}/listing-category`);
      const json = await res.json();
      return json?.data || [];
    },
  });

  const dealTypeOptions = [
    { value: "RENT", label: "Rent" },
    { value: "SALE", label: "Sale" },
  ];

  const availableLanguages = [
    { value: "arabic", label: "Arabic" },
    { value: "english", label: "English" },
    { value: "farsi", label: "Farsi" },
    { value: "french", label: "French" },
    { value: "hindi", label: "Hindi" },
    { value: "italic", label: "Italian" },
    { value: "russian", label: "Russian" },
    { value: "spanish", label: "Spanish" },
    { value: "urdu", label: "Urdu" },
    { value: "others", label: "Others" },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (dealType) params.set("dealType", dealType);
    if (locationId) params.set("locationId", locationId);
    if (projectId) params.set("projectId", projectId);
    if (category) params.set("category", category);
    if (minPrice && minPrice !== "1000") params.set("minPrice", minPrice);
    if (maxPrice && maxPrice !== "1000000000000000000") params.set("maxPrice", maxPrice);
    if (bedroom) params.set("bedroom", bedroom);
    if (bathroom) params.set("bathroom", bathroom);
    if (language) params.set("language", language);
    params.set("page", "1");

    router.push(`/search?${params.toString()}`);
  };

  const resetFilters = () => {
    setDealType("SALE");
    setLocationId("");
    setProjectId("");
    setCategory("");
    setMinPrice("1000");
    setMaxPrice("1000000000000000000");
    setBedroom("");
    setBathroom("");
    setLanguage("");
  };

  const isAnyFilterActive = useMemo(() => {
    return (
      dealType !== "SALE" ||
      !!locationId ||
      !!projectId ||
      !!category ||
      minPrice !== "1000" ||
      maxPrice !== "1000000000000000000" ||
      !!bedroom ||
      !!bathroom ||
      !!language
    );
  }, [dealType, locationId, projectId, category, minPrice, maxPrice, bedroom, bathroom, language]);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-5 border border-slate-100 dark:border-slate-800 text-left font-sans mt-4 relative z-50">
      {/* Tab select for Purpose */}
      <div className="flex gap-2 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        {dealTypeOptions.map((opt) => {
          const isActive = dealType === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDealType(opt.value)}
              className={cn(
                "px-5 py-2 text-sm font-extrabold rounded-xl transition-all",
                isActive
                  ? "text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
              style={isActive ? { backgroundColor: primaryColor } : {}}
            >
              For {opt.label}
            </button>
          );
        })}
      </div>

      {/* Grid of inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Location Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location / Project</label>
          <LocationProjectSearchDropdown
            onLocationSelect={(selectedItem) => {
              if (selectedItem.type === "project") {
                setProjectId(String(selectedItem.id));
                setLocationId("");
              } else {
                setLocationId(String(selectedItem.id));
                setProjectId("");
              }
            }}
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Type</label>
          <PropertyCategoryDropdown
            options={allcategories || []}
            setFilterValue={(val) => setCategory(val)}
            filterValue={category || ""}
            isLoading={isLoadingCategory}
            className="w-full border-slate-200 focus:ring-brand focus:border-brand h-10 rounded-xl"
          />
        </div>
      </div>

      {/* Bottom Actions Row */}
      <div className="flex flex-wrap items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex gap-2">
          {/* More Filters Button */}
          <Button
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs px-4 h-11"
            variant="outline"
            type="button"
            onClick={() => setShowAllFilters(true)}
          >
            <i className="bi-filter text-sm mr-1"></i> More Filters
          </Button>

          {/* Reset Button */}
          {isAnyFilterActive && (
            <Button
              className="rounded-xl text-slate-500 hover:bg-slate-50 font-semibold text-xs px-4 h-11"
              variant="ghost"
              type="button"
              onClick={resetFilters}
            >
              Reset
            </Button>
          )}
        </div>

        {/* Search CTA */}
        <Button
          onClick={handleSearch}
          className="rounded-xl text-white font-extrabold text-sm px-8 h-11 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: primaryColor }}
        >
          <i className="bi-search mr-2"></i> Search Properties
        </Button>
      </div>

      {/* More Filters Dialog */}
      {showAllFilters && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-6">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Refine Search</h2>
                <p className="text-sm text-slate-500 mt-1">Adjust price, bedrooms, bathrooms and spoken language filters.</p>
              </div>
              <button
                onClick={() => setShowAllFilters(false)}
                type="button"
                className="h-10 w-10 rounded-full border border-slate-150 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
              >
                <i className="bi bi-x-lg text-sm"></i>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-1 gap-6 text-slate-800">
                {/* Price Filter */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-visible relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-bold text-slate-900">Price Range (AED)</h3>
                    <PriceFilter
                      setMaxPrice={nuqsMaxPriceSetter}
                      setMinPrice={nuqsMinPriceSetter}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                    />
                  </div>
                </div>

                {/* Beds and Baths */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-visible relative z-10 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900">Beds & Baths</h3>
                  <ExtraFilter
                    setBeds={nuqsBedroomSetter}
                    setBaths={nuqsBathroomSetter}
                    beds={bedroom || ""}
                    baths={bathroom || ""}
                  />
                </div>

                {/* Spoken Language */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-visible relative z-30 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900">Agent Language</h3>
                  <DataTableFilterBox
                    filterKey="language"
                    title="Language"
                    options={availableLanguages || []}
                    setFilterValue={nuqsLanguageSetter}
                    filterValue={language || ""}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-5 shrink-0">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetFilters}
                  className="w-full sm:w-auto h-12 px-6 rounded-xl text-slate-500 font-semibold hover:bg-slate-100"
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => {
                    setShowAllFilters(false);
                    handleSearch();
                  }}
                  type="button"
                  className="w-full sm:w-48 h-12 rounded-xl text-base font-bold text-white shadow-lg"
                  style={{ backgroundColor: primaryColor }}
                >
                  Apply Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
