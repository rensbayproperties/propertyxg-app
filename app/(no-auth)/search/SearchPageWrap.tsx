"use client";
import React, { useState, useMemo, useCallback } from "react";
import Container from "@/components/Container";
import Image from "next/image";
import { cn, formatMoney } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, Maximize, Heart, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstLetter } from "@/constant/data";
import LocationProjectSearchDropdown from "@/components/LocationProjectSearchDropdown";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import usePublicAlert from "@/hooks/usePublicAlert";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import PropertyCategoryDropdown from "@/components/PropertyCategoryFilter";
import { DataTableFilter } from "@/components/ui/table/data-table-filter";
import { useQuery } from "@tanstack/react-query";
import { searchParams } from "@/lib/searchParams";
import { useQueryState } from "nuqs";
import type { WebsiteGeneral } from "@/hooks/useWebsiteSettings";
import { PublishedListing } from "@/components/website/shared/template-section-props";
import ExtraFilter from "@/components/search/ExtraFilter";
import PriceFilter from "@/components/search/PriceFilter";

interface SearchPageWrapProps {
  listings: PublishedListing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  general: WebsiteGeneral;
}

export const SearchPageWrap: React.FC<SearchPageWrapProps> = ({
  listings,
  meta,
  general,
}) => {
  const { formAlert, onSubmitAlert, isPending } = usePublicAlert();

  // URL Queries via Nuqs (triggering server-side transitions on change)
  const [listType, setListType] = useQueryState(
    "dealType",
    searchParams.status.withOptions({ shallow: false }).withDefault("SALE")
  );
  const [location, setLocation] = useQueryState(
    "locationId",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [project, setProject] = useQueryState(
    "projectId",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [listingCategoryId, setlistingCategoryId] = useQueryState(
    "category",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("1000")
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("1000000000000000000")
  );
  const [bedroom, setBedroom] = useQueryState(
    "bedroom",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const [bathroom, setBathroom] = useQueryState(
    "bathroom",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const [language, setLanguage] = useQueryState(
    "language",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  // Pagination page state
  const [page, setPage] = useQueryState(
    "page",
    searchParams.status.withOptions({ shallow: false }).withDefault("1")
  );

  const [locationTitle, setLocationTitle] = useState<string>("");
  const [activeIndexes, setActiveIndexes] = useState<Record<string, number>>({});
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const nextImage = (id: string, length: number) => {
    setActiveIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] || 0) + 1) % length,
    }));
  };

  const prevImage = (id: string, length: number) => {
    setActiveIndexes((prev) => ({
      ...prev,
      [id]: prev[id] === 0 ? length - 1 : (prev[id] || 0) - 1,
    }));
  };

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

  const resetFilters = useCallback(() => {
    setListType("SALE");
    setLocation(null);
    setProject(null);
    setlistingCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setBedroom(null);
    setBathroom(null);
    setLanguage(null);
    setLocationTitle("");
    setPage(null);
  }, [
    setListType,
    setLocation,
    setProject,
    setlistingCategoryId,
    setMinPrice,
    setMaxPrice,
    setBedroom,
    setBathroom,
    setLanguage,
    setPage,
  ]);

  const isAnyFilterActive = useMemo(() => {
    return (
      listType !== "SALE" ||
      !!location ||
      !!project ||
      !!listingCategoryId ||
      minPrice !== "1000" ||
      maxPrice !== "1000000000000000000" ||
      !!bedroom ||
      !!bathroom ||
      !!language ||
      page !== "1"
    );
  }, [
    listType,
    location,
    project,
    listingCategoryId,
    minPrice,
    maxPrice,
    bedroom,
    bathroom,
    language,
    page,
  ]);

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

  const usefulLinksSections = [
    {
      title: "Bedrooms",
      links: ["1", "2", "3", "4"].map((beds) => ({
        label: `${beds} Bedroom Properties in ${locationTitle || "Dubai"}`,
        href: `/site/search?bedroom=${beds}${location ? `&locationId=${location}` : ""}`,
      })),
    },
    {
      title: "Bathrooms",
      links: ["1", "2", "3", "4"].map((baths) => ({
        label: `${baths} Bathroom Properties in ${locationTitle || "Dubai"}`,
        href: `/site/search?bathroom=${baths}${location ? `&locationId=${location}` : ""}`,
      })),
    },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen font-sans antialiased text-slate-800">
      {/* FILTER BAR CONTAINER */}
      <section className="border-b sticky top-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] z-[20] py-4 bg-white/90 backdrop-blur-md">
        <Container className="flex flex-wrap items-center gap-3">
          <DataTableFilter
            filterKey="listType"
            title="Purpose"
            options={dealTypeOptions || []}
            setFilterValue={(val) => {
              setPage(null);
              return setListType(val);
            }}
            filterValue={listType || "SALE"}
          />

          <div className="w-full max-w-md">
            <LocationProjectSearchDropdown
              onLocationSelect={(selectedItem) => {
                setPage(null);
                if (selectedItem.type === "project") {
                  setProject(String(selectedItem.id));
                  setLocation(null);
                  setLocationTitle(String(selectedItem.title));
                } else {
                  setLocation(String(selectedItem.id));
                  setProject(null);
                  setLocationTitle(selectedItem.title);
                }
              }}
            />
          </div>

          <PropertyCategoryDropdown
            options={allcategories || []}
            setFilterValue={(val) => {
              setPage(null);
              return setlistingCategoryId(val);
            }}
            filterValue={listingCategoryId || ""}
            isLoading={isLoadingCategory}
          />

          <DataTableResetFilter
            isFilterActive={isAnyFilterActive}
            onReset={resetFilters}
          />

          <Button
            className="ml-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs px-4"
            variant="outline"
            type="button"
            onClick={() => setShowAllFilters(true)}
          >
            <i className="bi-filter text-sm mr-1"></i> More Filters
          </Button>
        </Container>
      </section>

      {/* FILTER DRAWER / DIALOG */}
      {showAllFilters && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 py-6">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100 flex flex-col transition-all duration-300">
            {/* HEADER */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Refine Search
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Adjust price, bedrooms, bathrooms and spoken language filters.
                </p>
              </div>

              <button
                onClick={() => setShowAllFilters(false)}
                type="button"
                className="h-10 w-10 rounded-full border border-slate-150 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
              >
                <i className="bi bi-x-lg text-sm"></i>
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-visible relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-base font-bold text-slate-900">
                      Price Range (AED)
                    </h3>
                    <PriceFilter
                      setMaxPrice={(val) => {
                        setPage(null);
                        return setMaxPrice(val);
                      }}
                      setMinPrice={(val) => {
                        setPage(null);
                        return setMinPrice(val);
                      }}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-visible relative z-10 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900">
                    Beds & Baths
                  </h3>
                  <ExtraFilter
                    setBeds={(val) => {
                      setPage(null);
                      return setBedroom(val);
                    }}
                    setBaths={(val) => {
                      setPage(null);
                      return setBathroom(val);
                    }}
                    beds={bedroom || ""}
                    baths={bathroom || ""}
                  />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm overflow-visible relative z-30 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900">
                    Agent Language
                  </h3>
                  <DataTableFilterBox
                    filterKey="language"
                    title="Language"
                    options={availableLanguages || []}
                    setFilterValue={(val) => {
                      setPage(null);
                      return setLanguage(val);
                    }}
                    filterValue={language || ""}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER */}
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
                  onClick={() => setShowAllFilters(false)}
                  type="button"
                  className="w-full sm:w-48 h-12 rounded-xl text-base font-bold bg-brand hover:bg-brand/90 text-white shadow-lg shadow-brand/10"
                >
                  Apply Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH LAYOUT */}
      <section className="py-8">
        <Container>
          {/* SEARCH HEADLINE */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {locationTitle ? `Properties in ${locationTitle}` : "Available Properties"}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Showing {listings.length} of {meta.total} premium properties matching your criteria.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
            {/* LISTINGS CONTAINER */}
            <div className="space-y-6">
              {listings.length === 0 ? (
                <div className="p-16 text-center border border-slate-100 rounded-3xl bg-white shadow-sm flex flex-col items-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <i className="bi-search text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    No properties match your search
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">
                    Try removing some filter criteria or check back later for new updates.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-6 rounded-xl bg-brand text-white font-semibold"
                  >
                    Reset All Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-5">
                  {listings.map((listing) => {
                    const imageUrls =
                      listing.images?.map((img: any) => img.url).filter(Boolean) ||
                      (listing.imageUrl ? [listing.imageUrl] : []);
                    const activeIndex = activeIndexes[listing.id] || 0;

                    return (
                      <div
                        className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:shadow-[0_20px_50px_rgba(15,23,42,0.04)] hover:border-slate-200/60 transition-all duration-300 group flex flex-col md:flex-row"
                        key={`listing__${listing.id}`}
                      >
                        {/* IMAGE COLLAGE/SLIDER SECTION */}
                        <div className="relative w-full md:w-[38%] min-h-[250px] md:min-h-[280px] shrink-0 overflow-hidden bg-slate-900">
                          {imageUrls.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 text-sm gap-2">
                              <i className="bi-image text-3xl"></i>
                              <span>No Photos Available</span>
                            </div>
                          ) : (
                            <img
                              src={imageUrls[activeIndex] || imageUrls[0]}
                              alt={listing.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}

                          {/* CATEGORY & DEAL TYPE TAGS */}
                          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5">
                            <span
                              className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm",
                                listing.dealType?.toLowerCase() === "sale"
                                  ? "bg-indigo-650"
                                  : "bg-emerald-650"
                              )}
                            >
                              {listing.dealType}
                            </span>
                            {listing.distress && (
                              <span className="bg-rose-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                                Distress Deal
                              </span>
                            )}
                          </div>

                          {/* SLIDER NAVIGATION */}
                          {imageUrls.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  prevImage(listing.id, imageUrls.length);
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-900/60 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-900/80 transition-all text-lg z-10"
                              >
                                ‹
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  nextImage(listing.id, imageUrls.length);
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900/60 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-900/80 transition-all text-lg z-10"
                              >
                                ›
                              </button>
                            </>
                          )}

                          {/* DOTS INDICATOR */}
                          {imageUrls.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10 bg-slate-950/40 px-2 py-1 rounded-full backdrop-blur-sm">
                              {imageUrls.slice(0, 5).map((_: any, i: number) => (
                                <span
                                  key={i}
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-all",
                                    i === activeIndex
                                      ? "bg-white scale-110"
                                      : "bg-white/40"
                                  )}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* CONTENT WRAPPER */}
                        <div className="p-6 md:p-7 flex-1 flex flex-col justify-between gap-5">
                          <div>
                            <Link
                              href={`/site/search/${listing.id}`}
                              className="block group-hover:text-brand transition-colors no-underline text-inherit"
                            >
                              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                                <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                                  {formatMoney(Number(listing.price))}
                                </span>
                                {listing.price_unit && (
                                  <span className="text-xs text-slate-400 font-bold uppercase">
                                    / {listing.price_unit}
                                  </span>
                                )}
                              </div>

                              <h3 className="text-lg font-bold text-slate-800 line-clamp-1 leading-snug tracking-tight mb-2 group-hover:text-brand transition-colors">
                                {listing.title}
                              </h3>
                            </Link>

                            <p className="text-xs text-slate-400 font-bold mb-4 uppercase tracking-wider flex items-center gap-1">
                              <i className="bi-bookmark-check text-slate-300"></i> Ref: {listing.ref || listing.id}
                            </p>

                            {/* CORE SPEC GRID */}
                            <div className="flex flex-wrap gap-x-5 gap-y-3 py-3 px-4 rounded-2xl bg-slate-50 text-slate-650 text-sm font-semibold border border-slate-100/50">
                              {listing.property_bedroom && (
                                <div className="flex gap-2 items-center">
                                  <BedDouble size={16} className="text-slate-400 shrink-0" />
                                  <span className="capitalize">
                                    {listing.property_bedroom} Bed
                                  </span>
                                </div>
                              )}
                              {listing.property_bathroom && (
                                <div className="flex gap-2 items-center border-l border-slate-200 pl-5">
                                  <Bath size={16} className="text-slate-400 shrink-0" />
                                  <span>{listing.property_bathroom} Bath</span>
                                </div>
                              )}
                              {listing.property_size && (
                                <div className="flex gap-2 items-center border-l border-slate-200 pl-5">
                                  <Maximize size={16} className="text-slate-400 shrink-0" />
                                  <span>
                                    {listing.property_size.toLocaleString()} Sqft
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ACTION FOOTER */}
                          <div className="border-t border-slate-50 pt-4 flex items-center justify-between gap-4">
                            <Link
                              href={`/site/search/${listing.id}`}
                              className="text-xs font-bold text-brand hover:underline flex items-center gap-1.5 no-underline"
                            >
                              Explore Details <i className="bi-arrow-right"></i>
                            </Link>

                            <div className="flex gap-2">
                              <a
                                href={`tel:${general.contactPhone || "+971505667362"}`}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 no-underline transition border border-slate-200/50"
                              >
                                <i className="bi-telephone text-sm"></i> Call
                              </a>
                              <a
                                href={`https://api.whatsapp.com/send/?phone=${encodeURIComponent(general.contactPhone || "+971505667362")}&text=${encodeURIComponent(`Hello, I would like to check details on Listing #${listing.ref || listing.id} (${listing.title})`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 no-underline transition border border-emerald-100/55"
                              >
                                <i className="bi-whatsapp text-sm"></i> WhatsApp
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* PAGINATION CONTROLS */}
                  {meta.totalPages > 1 && (
                    <div className="flex flex-wrap justify-center items-center gap-2 pt-10 pb-8">
                      <Button
                        variant="outline"
                        onClick={() => {
                          const prevPage = Math.max(1, meta.page - 1);
                          setPage(String(prevPage));
                        }}
                        disabled={meta.page <= 1}
                        className="rounded-xl border-slate-200 text-slate-700 font-semibold px-4 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Previous
                      </Button>

                      {Array.from({ length: meta.totalPages }).map((_, i) => {
                        const p = i + 1;
                        const isActive = meta.page === p;
                        return (
                          <Button
                            key={p}
                            variant={isActive ? "default" : "outline"}
                            onClick={() => setPage(String(p))}
                            className={cn(
                              "w-10 h-10 rounded-xl font-bold transition-all text-xs",
                              isActive
                                ? "bg-brand text-white shadow-md hover:bg-brand/90"
                                : "border-slate-200 text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            {p}
                          </Button>
                        );
                      })}

                      <Button
                        variant="outline"
                        onClick={() => {
                          const nextPage = Math.min(meta.totalPages, meta.page + 1);
                          setPage(String(nextPage));
                        }}
                        disabled={meta.page >= meta.totalPages}
                        className="rounded-xl border-slate-200 text-slate-700 font-semibold px-4 hover:bg-slate-50 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* ALERTS MODULE */}
              <div className="border border-slate-100 rounded-3xl bg-white p-6 shadow-sm text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                <div className="h-12 w-12 bg-indigo-50 text-indigo-650 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell size={20} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Get Instant Updates
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Receive notifications whenever a new property matching your criteria goes live.
                </p>
                <Button
                  onClick={() => setOpenAlertModal(true)}
                  className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold rounded-xl h-11 bg-brand text-white hover:bg-brand/90 shadow-md shadow-brand/10 transition-all hover:-translate-y-0.5"
                >
                  Create Property Alert
                </Button>
              </div>

              {/* QUICK LINKS SECTION */}
              <div className="space-y-4">
                {usefulLinksSections.map((section, index) => (
                  <div
                    key={index}
                    className="border border-slate-100 rounded-3xl bg-white overflow-hidden shadow-sm"
                  >
                    <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
                        {section.title}
                      </h4>
                    </div>
                    <div className="p-5 flex flex-col gap-3">
                      {section.links.map((link, linkIndex) => (
                        <a
                          key={linkIndex}
                          href={link.href}
                          className="text-[13px] text-slate-650 hover:text-brand font-medium transition-colors leading-snug no-underline"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* PROPERTY ALERT MODAL */}
      <Dialog onOpenChange={setOpenAlertModal} open={openAlertModal}>
        <DialogContent className="sm:max-w-[420px] bg-white rounded-3xl p-7 border shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-bold text-slate-900 tracking-tight">
              Create Alert
            </DialogTitle>
            <p className="text-sm text-slate-500">
              We'll send you an email as soon as new properties matching your current filters are published.
            </p>
          </DialogHeader>

          <div className="mt-4">
            <Form {...formAlert}>
              <form
                onSubmit={formAlert.handleSubmit((values) =>
                  onSubmitAlert(values, {
                    bathroom: bathroom || "",
                    bedroom: bedroom || "",
                    maxPrice: maxPrice || "",
                    minPrice: minPrice || "",
                    listingCategoryId: listingCategoryId || "",
                    location: location || "",
                  })
                )}
                className="space-y-5"
              >
                <FormField
                  control={formAlert.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          disabled={isPending}
                          {...field}
                          placeholder="you@example.com"
                          className="h-11 rounded-xl border-slate-200 focus-visible:ring-brand"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-2">
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 rounded-xl text-slate-600 border-slate-200 font-semibold"
                    >
                      Cancel
                    </Button>
                  </DialogTrigger>

                  <Button
                    type="submit"
                    loading={isPending}
                    className="w-full h-11 text-white bg-brand hover:bg-brand/90 font-bold rounded-xl shadow-lg shadow-brand/10"
                  >
                    {isPending ? "Setting alert..." : "Activate Alert"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchPageWrap;
