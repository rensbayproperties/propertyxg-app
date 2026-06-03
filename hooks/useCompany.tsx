"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { searchParams } from "@/lib/searchParams";
import { parseAsInteger, useQueryState } from "nuqs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { formatMoney } from "@/lib/utils";
import { ListingsColumns } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { propertyContactSchema } from "@/lib/schemas";

type FormData = z.infer<typeof propertyContactSchema>;

const useCompany = (opt: string = "") => {
  const [open, setOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [whatsappData, setWhatsappData] = useState<any>(null);
  const [PDFData, setPDFData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const axiosAuth = useAxiosAuth();
  const [viewMode, setViewMode] = useState<"table" | "card">(() => {
    const savedViewMode = localStorage.getItem("propViewMode");
    return savedViewMode === "card" ? "card" : "table";
  });
  const [filterStatus, setFilterStatus] = useQueryState(
    "status",
    searchParams.status
      .withOptions({ shallow: false })
      .withDefault("companylisting"),
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(
    null,
  );
  const queryClient = useQueryClient();

  const toggleView = () => {
    setViewMode((prevMode) => (prevMode === "table" ? "card" : "table"));
  };
  useEffect(() => {
    localStorage.setItem("propViewMode", viewMode);
  }, [viewMode]);

  const [searchQuery, setSearchQuery] = useQueryState(
    "title",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [assignedTo, setAssignedTo] = useQueryState(
    "assigned",
    searchParams.status.withOptions({ shallow: false }).withDefault(""),
  );
  const [minPrice, setMinPrice] = useQueryState(
    "min",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("100"),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "max",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("1000000000000000000000"),
  );
  const [bedroom, setBedroom] = useQueryState(
    "bedroom",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const [bathroom, setBathroom] = useQueryState(
    "bathroom",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );
  const { mutateAsync: deleteInventory, isPending } = useMutation({
    mutationFn: (id: any) => {
      const res = axiosAuth.delete(`/list/${id}`);
      return res;
    },
    onSuccess: () => {
      toast("Success", {
        description: "Inventory deleted successfully.",
      });
    },
  });
  const [listingCategoryId, setlistingCategoryId] = useQueryState(
    "category",
    searchParams.status.withOptions({ shallow: false }).withDefault(""),
  );
  const [location, setLocation] = useQueryState(
    "locationId",
    searchParams.status.withOptions({ shallow: false }).withDefault(""),
  );

    const [projectId, setProject] = useQueryState(
      "projectId",
      searchParams.status.withOptions({ shallow: false }).withDefault(""),
    );

      const [language, setLanguage] = useQueryState(
        "language",
        searchParams.status.withOptions({ shallow: false }).withDefault(""),
      );

  const [listType, setListType] = useQueryState(
    "dealType",
    searchParams.status.withOptions({ shallow: false }).withDefault("SALE"),
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
    setlistingCategoryId(null);
    setLocation(null);
    setListType(null);
    setMinPrice(null);
    setMaxPrice(null);
    setBedroom(null);
    setBathroom(null);
    setAssignedTo(null);
    setProject(null);
    setLanguage(null);
  }, [setSearchQuery, setlistingCategoryId]);

  const dealTypeOptions = [
    { value: "RENT", label: "Rent" },
    { value: "SALE", label: "Sale" },
  ];

  const isAnyFilterActive = useMemo(() => {
    return (
      !!projectId ||
      !!language ||
      !!searchQuery ||
      !!listingCategoryId ||
      !!listingCategoryId ||
      !!location ||
      !!listType ||
      !!bedroom ||
      !!bathroom ||
      !!minPrice ||
      !!assignedTo ||
      !!maxPrice
    );
  }, [
    projectId,
    language,
    searchQuery,
    listingCategoryId,
    listingCategoryId,
    location,
    listType,
    minPrice,
    maxPrice,
    bedroom,
    bathroom,
    assignedTo,
  ]);

  const { data: companyDetails, isLoading: gettingcompanyDetails } = useQuery({
    queryKey: [
      "companyDetails",
      {
        currentPage,
        pageSize,
        searchQuery,
        location,
        listType,
        listingCategoryId,
        minPrice,
        maxPrice,
        bedroom,
        bathroom,
        projectId,
        language
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/listing/company/${opt}?limit=${pageSize}&page=${currentPage}&title=${searchQuery}&locationId=${location}&projectId=${projectId}&dealType=${listType}&category=${listingCategoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedroom=${bedroom}&bathroom=${bathroom}&language=${language}`,
      );
      const result = response.data.data;
      return result;
    },
  });

  const { data: agentDetails, isLoading: gettingagentDetails } = useQuery({
    queryKey: [
      "agentDetails",
      {
        currentPage,
        pageSize,
        searchQuery,
        location,
        listType,
        listingCategoryId,
        minPrice,
        maxPrice,
        bedroom,
        bathroom,
        projectId,
        language
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/listing/agent/${opt}?limit=${pageSize}&page=${currentPage}&title=${searchQuery}&locationId=${location}&projectId=${projectId}&dealType=${listType}&category=${listingCategoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedroom=${bedroom}&bathroom=${bathroom}&language=${language}`,
      );
      const result = response.data.data;
      return result;
    },
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

  const { data: selectedListing, isLoading: isLoadingSelectedListing } =
    useQuery<ListingsColumns | null>({
      queryKey: ["property-contact", selectedListingId],
      enabled: !!selectedListingId && isDialogOpen,
      queryFn: async () => {
        if (!selectedListingId) return null;

        const response = await axiosAuth.get(`/listing/${selectedListingId}`);
        return response?.data?.data ?? null;
      },
      refetchOnWindowFocus: false,
    });

  const contactAgent = (id: string) => {
    setSelectedListingId(id);
    setIsDialogOpen(true);
  };

  const form = useForm<FormData>({
    resolver: zodResolver(propertyContactSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    form.reset({
      message: `Hello, I would like to check the availability for Listing #${selectedListing?.ref}.\n\nLocation: ${selectedListing?.location?.name} \nStarting Price: ${formatMoney(selectedListing?.price || 0)}. \n\nThank you!`,
    });
  }, [selectedListing]);

  const { mutateAsync: submit, isPending: isPendingPropertyContact } =
    useMutation({
      mutationFn: (credentials: any) =>
        axiosAuth.post("/property-contact/request", credentials),
      onSuccess: (res, req) => {
        if (res?.data?.success) {
          toast("Success", { description: "Agent contacted successfully." });
          setIsDialogOpen(false);
          setSelectedListingId(null);
          queryClient.invalidateQueries({
            queryKey: [
              "companyDetails",
              {
                currentPage,
                pageSize,
                searchQuery,
                location,
                listType,
                listingCategoryId,
                minPrice,
                maxPrice,
                bedroom,
                bathroom,
              },
            ],
          });

          window.open(
            `https://api.whatsapp.com/send/?phone=2349065055593&text=${req?.message?.replace("\n", "")}`,
            "_blank",
          );
        } else {
          toast.error("Error", {
            description: res?.data?.message || "An error occured",
          });
        }
      },
    });

  const { isLoading: isLoadingCategory, data: allcategories } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/listing-category");
      const results = response.data.data;
      return results;
    },
    queryKey: ["categories"],
  });

  const onSubmit = async (values: any) => {
    try {
      await submit({ ...values, listingId: selectedListing?.id });
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

    const availableLanguages = [
    { value: "arabic", label: "Arabic" },
    { value: "english", label: "English" },
    { value: "farsi", label: "Farsi" },
    { value: "french", label: "French" },
    { value: "hindi", label: "Hindi" },
    { value: "italian", label: "Italian" },
    { value: "russian", label: "Russian" },
    { value: "spanish", label: "Spanish" },
    { value: "urdu", label: "Urdu" },
    { value: "others", label: "Others" },
  ];

  useEffect(() => {
    if (!openShare) {
      setWhatsappData(null);
    }
  }, [openShare]);

  return {
    availableLanguages,
    projectId,
    setProject,
    language,
    setLanguage,
    resetFilters,
    isAnyFilterActive,
    listingCategoryId,
    setlistingCategoryId,
    location,
    setLocation,
    listType,
    setListType,
    searchQuery,
    setSearchQuery,
    companyDetails,
    gettingcompanyDetails,
    open,
    setOpen,
    isPending,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    locations,
    isLoadingLocations,
    rowSelection,
    setRowSelection,
    setOpenShare,
    openShare,
    setMaxPrice,
    maxPrice,
    setMinPrice,
    minPrice,
    whatsappData,
    copied,
    PDFData,
    bedroom,
    setBedroom,
    bathroom,
    setBathroom,
    assignedTo,
    setAssignedTo,
    viewMode,
    toggleView,
    filterStatus,
    setFilterStatus,
    selectedListingId,
    setSelectedListingId,
    isDialogOpen,
    setIsDialogOpen,
    selectedListing,
    isLoadingSelectedListing,
    contactAgent,
    onSubmit,
    form,
    isPendingPropertyContact,
    openNotify,
    setOpenNotify,
    dealTypeOptions,
    agentDetails,
    gettingagentDetails,
    allcategories,
    isLoadingCategory,
  };
};

export default useCompany;
