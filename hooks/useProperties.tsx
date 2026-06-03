"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { searchParams } from "@/lib/searchParams";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";

const useProperties = (opt: string = "") => {
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

  const { data: inventories, isLoading: gettingInventories } = useQuery({
    queryKey: ["inventories"],
    queryFn: async () => {
      const response = await axiosAuth.get(`/properties`);
      const result = response.data.data;
      console.log("properties", result);
      return result;
    },
  });
  const { data: locations, isLoading: isLoadingLocaions } = useQuery({
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

  const { data: assignees, isLoading: isLoadingAssignees } = useQuery({
    queryKey: ["landlords"],
    queryFn: async () => fetchData("/properties/landlords"),
  });

  const modifiedAssignees = assignees ? [...assignees].map((assignee: any) => ({
    label: `${assignee?.name}`,
    value: assignee?.email,
  })) : [];

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data.customfields_datapayload
      ? JSON.parse(response.data.data.customfields_datapayload)
      : response.data.data;
  };

  const handleInventoryDelete = async (id: any) => {
    try {
      await deleteInventory(id);
      setOpen(false);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const selectedRows = Object.keys(rowSelection).map(
    (index) => inventories?.data?.list[parseInt(index)]
  );
  const selectedIds = selectedRows.map((row) => row?.id);

  const { mutateAsync: whatsApp, isPending: isPendingWhatsApp } = useMutation({
    mutationFn: () => {
      const res = axiosAuth.post(`/properties/generate/whatsapp`, {
        items: selectedIds,
      });
      res.then((modifiedData: any) => {
        if (modifiedData.data.status === "success") {
          setWhatsappData(modifiedData.data.data.data);
        } else {
          toast("Failed", {
            description: "Something went wrong. Please try again later",
          });
        }

        return modifiedData;
      });
      return res;
    },
  });
  const { mutateAsync: pdf, isPending: isPendingPdf } = useMutation({
    mutationFn: () => {
      const res = axiosAuth.post(`/properties/generate/pdf`, {
        items: selectedIds,
      });
      res.then((modifiedData: any) => {
        if (modifiedData.data.status === "success") {
          // setPDFData(modifiedData.data.data.data);
        } else {
          toast("Failed", {
            description: "Something went wrong. Please try again later",
          });
        }

        return modifiedData;
      });
      return res;
    },
  });
  const handleWhatsapp = async () => {
    try {
      const res: any = await whatsApp();
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };
  const handlePDF = async () => {
    try {
      await pdf();
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };
  const copyTextToClipboard = async () => {
    const validListings = whatsappData?.filter(
      (item: any) =>
        item.title != null &&
        item.price != null &&
        item.location?.name != null &&
        item.slug != null
    );

    let message = "Hello! Here are our current property listings:\n\n";

    validListings.forEach((item: any) => {
      message += `Inventory Title: ${item.title}\n`;
      message += `Inventory Price: ${formatMoney(item?.price)}\n`;
      if (item.permit_number) {
        message += `Permit Number: ${item.permit_number}\n`;
      }
      message += `Location: ${item.location.name}\n`;
      message += `Inventory Url: https://rensproperties.vercel.app/listings/${item.slug}\n`;
      message += "----------------------------\n\n";
    });
    if ("clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy url: ", err);
      }
    }
  };

  useEffect(() => {
    if (!openShare) {
      setWhatsappData(null);
    }
  }, [openShare]);

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
    inventories,
    gettingInventories,
    handleInventoryDelete,
    open,
    setOpen,
    isPending,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    locations,
    isLoadingLocaions,
    rowSelection,
    setRowSelection,
    selectedIds,
    setOpenShare,
    openShare,
    setMaxPrice,
    maxPrice,
    setMinPrice,
    minPrice,
    handleWhatsapp,
    isPendingWhatsApp,
    whatsappData,
    copyTextToClipboard,
    copied,
    isPendingPdf,
    handlePDF,
    PDFData,
    beds,
    setBeds,
    baths,
    setBaths,
    modifiedAssignees,
    isLoadingAssignees,
    assignedTo,
    setAssignedTo,
  };
};

export default useProperties;
