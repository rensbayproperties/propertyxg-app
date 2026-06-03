"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ListingInquirySchema } from "@/lib/schemas";
import { useSession } from "next-auth/react";
import { searchParams } from "@/lib/searchParams";
import { parseAsInteger, useQueryState } from "nuqs";

type FormData = z.infer<typeof ListingInquirySchema>;

interface session {
  user: {
    id: string;
    email: string;
    company?: {
      id: string;
      username: string;
      name?: string;
      logo?: string;
    };
  };
}

type GetCategory = {
  companyId: string;
};

const useListingInquiry = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession() as { data: session | null };
  const companyId = session?.user?.company?.id;
  const getCategory: GetCategory = {
    companyId: `${companyId}`,
  };

  const [viewMode, setViewMode] = useState<"table" | "card">(() => {
    const savedViewMode = localStorage.getItem("propViewMode");
    return savedViewMode === "card" ? "card" : "table";
  });

  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "card" : "table"));
  };
  useEffect(() => {
    localStorage.setItem("propViewMode", viewMode);
  }, [viewMode]);

  const [searchQuery, setSearchQuery] = useQueryState(
    "name",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [minPrice, setMinPrice] = useQueryState(
    "min",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "max",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [beds, setBeds] = useQueryState(
    "beds",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [baths, setBaths] = useQueryState(
    "baths",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [category, setCategory] = useQueryState(
    "category",
    searchParams.status.withOptions({ shallow: false }).withDefault(""),
  );
  const [location, setLocation] = useQueryState(
    "location",
    searchParams.status.withOptions({ shallow: false }).withDefault(""),
  );

  const [listType, setListType] = useQueryState(
    "ad_type",
    searchParams.status.withOptions({ shallow: false }).withDefault(""),
  );

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1),
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(50),
  );

  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setCategory(null);
    setLocation(null);
    setListType(null);
    setMinPrice(null);
    setMaxPrice(null);
    setBeds(null);
    setBaths(null);
  }, [setSearchQuery, setCategory]);

  const isAnyFilterActive = useMemo(() => {
    return (
      !!searchQuery ||
      !!category ||
      !!category ||
      !!location ||
      !!listType ||
      !!beds ||
      !!baths ||
      !!minPrice ||
      !!maxPrice
    );
  }, [
    searchQuery,
    category,
    category,
    location,
    listType,
    minPrice,
    maxPrice,
    beds,
    baths,
  ]);

  const form = useForm<FormData>({
    resolver: zodResolver(ListingInquirySchema),
    defaultValues: {
      name: "",
      note: "",
      locationId: undefined,
      Category: undefined,
      SubCategory: undefined,
      dealType: "SALE",
      max_budget: undefined,
      min_budget: undefined,
      completionStatus: undefined,
      property_bedroom: undefined,
      property_bathroom: undefined,
      furnished: false,
      size: undefined,
      publish_to_marketplace: true,
      distres: false,
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.post("/inquiry", credentials),
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast("Success", { description: "Inquiry created successfully." });
        form.reset();
        router.push(`/property-listings/all`);
      }
    },
  });

  const { data: inquiries, isLoading: gettingInquiries } = useQuery({
    queryKey: [
      "inquiries",
      {
        currentPage,
        pageSize,
        searchQuery,
        location,
        listType,
        category,
        minPrice,
        maxPrice,
        beds,
        baths,
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/inquiry?limit=${pageSize}&page=${currentPage}&title=${searchQuery}&location=${location}&ad_type=${listType}&category=${category}&min_price=${minPrice}&max_price=${maxPrice}&bedrooms=${beds}&bathrooms=${baths}`,
      );
      const result = response.data;
      return result;
    },
  });

  const { data: allInquiries, isLoading: gettingAllInquiries } = useQuery({
    queryKey: [
      "allInquiries",
      {
        currentPage,
        pageSize,
        searchQuery,
        location,
        listType,
        category,
        minPrice,
        maxPrice,
        beds,
        baths,
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/inquiry/all?limit=${pageSize}&page=${currentPage}&title=${searchQuery}&location=${location}&ad_type=${listType}&category=${category}&min_price=${minPrice}&max_price=${maxPrice}&bedrooms=${beds}&bathrooms=${baths}`,
      );
      const result = response.data;
      return result;
    },
  });

  const { isLoading: isLoadingCategory, data: allcategories } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/listing-category");
      const results = response.data.data;
      return results;
    },
    queryKey: ["categories", companyId],
  });

  const { data: locations, isLoading: isLoadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axiosAuth.get(`/locations`);
      const results = res.data.data.locations;
      const modifiedData = results?.map((o: any) => ({
        value: o.slug,
        label: o.name,
      }));
      return modifiedData;
    },
  });

  const onSubmit = async (values: any) => {
    console.log("the values", values);
    try {
      await submit(values);
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  return {
    onSubmit,
    form,
    isPending,
    allcategories,
    isLoadingCategory,
    locations,
    isLoadingLocations,
    resetFilters,
    isAnyFilterActive,
    category,
    setCategory,
    location,
    setLocation,
    listType,
    setListType,
    searchQuery,
    setSearchQuery,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    setMaxPrice,
    maxPrice,
    setMinPrice,
    minPrice,
    beds,
    setBeds,
    baths,
    setBaths,
    inquiries,
    gettingInquiries,
    viewMode,
    allInquiries,
    gettingAllInquiries,
    toggleView,
  };
};

export default useListingInquiry;
