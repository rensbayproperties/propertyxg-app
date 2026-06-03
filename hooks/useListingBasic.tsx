"use client";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { basicListingSchema } from "@/lib/schemas";
import { useSession } from "next-auth/react";

type FormData = z.infer<typeof basicListingSchema>;

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

const useListingBasic = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const { data: session } = useSession() as { data: session | null };
  const companyId = session?.user?.company?.id;

  const form = useForm<FormData>({
    resolver: zodResolver(basicListingSchema),
    defaultValues: {
      title: "",
      locationId: undefined,
      projectId: undefined,
      category: undefined,
      listingCategoryId: undefined,
      permit_number: undefined,
      dealType: "SALE",
      max_price: undefined,
      price_unit: "",
      price_type: "FLAT",
      visibility_scope: "PUBLIC",
      price: undefined,
      property_bedroom: undefined,
      property_bathroom: undefined,
      property_size: undefined,
      publish_to_a2a_marketplace: true,
      publish_to_marketplace: false,
      has_parking: false,
      distress: false,
      negotiable: false,
      publish_to_website: false,
      visibility_team_only: false,
      details_on_request: false,
      description:""
      // amenities: []
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.post("/listing", credentials),
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast("Success", { description: "Listing created successfully." });
        form.reset();
        router.push(`/property-listings/${res?.data?.data?.id}`);
      }
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
  
  const { isLoading: isLoadingPriceTypes, data: priceTypes } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/listing/price-types/all");
      const results = ["Fixed", "Negotiable", "On Call"];
      return results;
    },
    queryKey: ["price_types"],
  });

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data;
  };

  const { data: customFields, isLoading: gettingCustomFields } = useQuery({
    queryKey: ["custom-fields", "lead"],
    queryFn: async () =>
      fetchData("/custom-settings?type=LEAD&section=BASIC_INFO"),
  });

  const { data: customFieldsExtra, isLoading: gettingCustomFieldsExtra } =
    useQuery({
      queryKey: ["custom-fields", "lead", "extra"],
      queryFn: async () =>
        fetchData("/custom-settings?type=LEAD&section=EXTRA_INFO"),
    });

  const status = [
    "NEW",
    "HOT",
    "WARM",
    "COLD",
    "CONTACTED",
    "FOLLOW_UP",
    "INTERESTED",
    "QUALIFIED",
    "NOT_QUALIFIED",
    "VIEWING_SCHEDULED",
    "VIEWED",
    "OFFER_MADE",
    "NEGOTIATION",
    "BOOKED",
    "CLOSED_WON",
    "CLOSED_LOST",
    "UNRESPONSIVE",
    "DUPLICATE",
  ];
  const gettingStatus = false;

  const onSubmit = async (values: any) => {
    // console.log("the values", values);
    try {
      // const formData = new FormData();

      // formData.append("title", values.title);
      // formData.append("locationId", values.locationId);
      // formData.append("projectId", values.projectId);
      // formData.append("category", values.category);

      // if (values.listingCategoryId) {
      //   formData.append("listingCategoryId", values.listingCategoryId);
      // }

      // if (values.permit_number) {
      //   formData.append("permit_number", values.permit_number);
      // }

      // formData.append("dealType", values.dealType);

      // if (values.price !== undefined) {
      //   formData.append("price", values.price.toString());
      // }

      // if (values.max_price !== undefined) {
      //   formData.append("max_price", values.max_price.toString());
      // }

      // formData.append("price_unit", values.price_unit);
      // formData.append("price_type", values.price_type);

      // formData.append("property_bedroom", values.property_bedroom);
      // formData.append("property_bathroom", values.property_bathroom);

      // if (values.property_size !== undefined) {
      //   formData.append("property_size", values.property_size.toString());
      // }

      // formData.append("has_parking", String(values.has_parking));
      // formData.append("distress", String(values.distress));
      // formData.append("negotiable", String(values.negotiable));
      // formData.append("publish_to_website", String(values.publish_to_website));

      // values.publish_to_marketplace.forEach((scope) => {
      //   formData.append("publish_to_marketplace[]", scope);
      // });

      await submit(values);
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };
  const isLoading = gettingStatus;

  return {
    onSubmit,
    form,
    status,
    isPending,
    isLoading,
    gettingCustomFields,
    customFields,
    customFieldsExtra,
    gettingCustomFieldsExtra,
    allcategories,
    isLoadingCategory,
    priceTypes,
  };
};

export default useListingBasic;
