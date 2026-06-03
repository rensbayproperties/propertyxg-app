"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { searchParams } from "@/lib/searchParams";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";

const useLandlord = (opt: string = "") => {
  const [open, setOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [whatsappData, setWhatsappData] = useState<any>(null);
  const [PDFData, setPDFData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const axiosAuth = useAxiosAuth();
  const [searchQuery, setSearchQuery] = useQueryState(
    "title",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const [assignedTo, setAssignedTo] = useQueryState(
    "assigned",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [minPrice, setMinPrice] = useQueryState(
    "min",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "max",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const [beds, setBeds] = useQueryState(
    "beds",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const [baths, setBaths] = useQueryState(
    "baths",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );
  const { mutateAsync: deleteInventory, isPending } = useMutation({
    mutationFn: (id: any) => {
      const res = axiosAuth.delete(`/properties/${id}`);
      return res;
    },
    onSuccess: () => {
      toast("Success", {
        description: "Property deleted successfully.",
      });
    },
  });
  const [category, setCategory] = useQueryState(
    "category",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );
  const [location, setLocation] = useQueryState(
    "location",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [listType, setListType] = useQueryState(
    "ad_type",
    searchParams.status.withOptions({ shallow: false }).withDefault("")
  );

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(50)
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
    setAssignedTo(null);
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
      !!assignedTo ||
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
    assignedTo,
  ]);





  const { data: landlords, isLoading: loadingLandlords } = useQuery({
    queryKey: ["landlord-list"],
    queryFn: async () => {
      const response = await axiosAuth.get("/properties/landlords");
      const results = response.data.data;
      console.log("landlords", results)
      return results;
    },
  });

  
  return {
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
    open,
    setOpen,
    isPending,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    rowSelection,
    setRowSelection,
    setOpenShare,
    openShare,
    setMaxPrice,
    maxPrice,
    setMinPrice,
    minPrice,
    PDFData,
    beds,
    setBeds,
    baths,
    setBaths,
    assignedTo,
    setAssignedTo,
    loadingLandlords,
    landlords
  };
};

export default useLandlord;
