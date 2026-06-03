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

const useListing = (opt: string = "") => {
  const [open, setOpen] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openNotify, setOpenNotify] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [whatsappData, setWhatsappData] = useState<any>(null);
  const [PDFData, setPDFData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const axiosAuth = useAxiosAuth();
  const [viewMode, setViewMode] = useState<"table" | "card">(() => {
    const savedViewMode = localStorage
      ? localStorage.getItem("propViewMode")
      : "card";
    return savedViewMode === "card" ? "card" : "table";
  });
  const [filterStatus, setFilterStatus] = useQueryState(
    "status",
    searchParams.status.withOptions({ shallow: false }).withDefault("listing"),
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
    "minPrice",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("1000"),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("1000000000000000000"),
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

  const [listType, setListType] = useQueryState(
    "dealType",
    searchParams.status.withOptions({ shallow: false }).withDefault("SALE"),
  );

  const [language, setLanguage] = useQueryState(
    "language",
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

  const { data: pType, isLoading: gettingCategory } = useQuery({
    queryKey: ["listCategories"],
    queryFn: async () => {
      const response = await axiosAuth.get("/list/categories/all");
      const result = response.data.data.categories_with_adtypes;

      const modifiedData = result?.map((o: any) => ({
        value: o.slug,
        label: o.name,
      }));
      return modifiedData;
    },
    enabled: false,
  });

  const { data: projectData, isLoading: gettingprojectData } = useQuery({
    queryKey: [
      "project",
      {
        projectId,
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(`/dxb-projects/${projectId}`);
      const result = response?.data?.data;
      return result;
    },
  });

  const { data: listings, isLoading: gettingListings } = useQuery({
    queryKey: [
      "listings",
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
        language,
        projectId,
        opt
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/listing/${opt}?limit=${pageSize}&page=${currentPage}&locationId=${location}&projectId=${projectId}&dealType=${listType}&language=${language}&category=${listingCategoryId}&minPrice=${Number(minPrice)}&maxPrice=${Number(maxPrice)}&bedroom=${bedroom}&bathroom=${bathroom}`,
      );
      const result = response.data;
      return result;
    },
  });

  const { data: listingsRecommendations, isLoading: gettingRecommendations } =
    useQuery({
      queryKey: [
        "recommendations",
        {
          location,
          listType,
          listingCategoryId,
          minPrice,
          maxPrice,
          bedroom,
          bathroom,
        },
      ],
      queryFn: async () => {
        const response = await axiosAuth.get(
          `/listing/recommendations?locationId=${location}&dealType=${listType}&category=${listingCategoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedroom=${bedroom}&bathroom=${bathroom}`,
        );
        const result = response?.data?.data;
        return result;
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

  const { mutateAsync: exportListings, isPending: isPendingExport } =
    useMutation({
      mutationFn: async () => {
        // const url = `/contacts/export${invOpt}?name=${searchQuery}&client_type=${type}`;
        const res = await axiosAuth.get(
          `/listing/${opt}?limit=${pageSize}&page=${currentPage}&title=${searchQuery}&location=${location}&dealType=${listType}&category=${listingCategoryId}&minPrice=${minPrice}&maxPrice=${maxPrice}&bedroom=${bedroom}&bathroom=${bathroom}&assigned=${assignedTo}`,
        );
        return res.data?.data?.url;
      },
      onSuccess: (url) => {
        if (!url) return;

        toast("Success", {
          description: "Inventories exported successfully.",
        });
        const link = document.createElement("a");
        link.href = url;
        link.download = "inventories.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
    (index) => listings?.data?.list[parseInt(index)],
  );
  const selectedIds = selectedRows.map((row) => row?.id);

  const { mutateAsync: whatsApp, isPending: isPendingWhatsApp } = useMutation({
    mutationFn: () => {
      const res = axiosAuth.post(`/list/generate/whatsapp`, {
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
      const res = axiosAuth.post(`/list/generate/pdf`, {
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
        item.slug != null,
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
              "listings",
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

  const onSubmit = async (values: any) => {
    try {
      await submit({ ...values, listingId: selectedListing?.id });
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  useEffect(() => {
    if (!openShare) {
      setWhatsappData(null);
    }
  }, [openShare]);

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

  return {
    availableLanguages,
    language,
    setLanguage,
    isPendingExport,
    exportListings,
    resetFilters,
    isAnyFilterActive,
    listingCategoryId,
    setlistingCategoryId,
    location,
    setLocation,
    projectId,
    setProject,
    listType,
    setListType,
    searchQuery,
    setSearchQuery,
    pType,
    listings,
    gettingListings,
    handleInventoryDelete,
    open,
    setOpen,
    isPending,
    currentPage,
    setPageSize,
    pageSize,
    setCurrentPage,
    gettingCategory,
    locations,
    isLoadingLocations,
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
    listingsRecommendations,
    gettingRecommendations,
    allcategories,
    isLoadingCategory,
    projectData,
    gettingprojectData,
  };
};

export default useListing;
