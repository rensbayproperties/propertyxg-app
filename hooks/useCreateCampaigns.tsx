"use client";

import { createCampaignSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type FormData = z.infer<typeof createCampaignSchema>;

const useCreateCampaigns = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      title: "",
      location: "",
      caption: "",
      pixel_id: "",
      google_tag_id: "",
      starting_price: 0,
      amenities: [""],
      status: "",
      content: "",
      meta_keywords: "",
      meta_description: "",
      project_details: "",
      campaignTemplateId: "",
    },
  });

  const { data: amenities, isLoading: gettingAmenities } = useQuery({
    queryKey: ["amenity"],
    queryFn: async () => {
      const res = await axiosAuth.get(`/amenity`);
      console.log("FULL API RESPONSE:", res.data?.data);
      return res.data?.data;
    },
  });

  // CREATE MUTATION
  const { mutate: createCampaign, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axiosAuth.post("/campaign", data);
      return res.data;
    },
    onSuccess: (response) => {
      if (response?.success && response?.data) {
        const campaign = response.data;
        toast("Success", { description: "Campaign created successfully." });
        router.push(`/campaigns/${campaign.slug}`);
      }
    },
    onError: (error) => {
      console.error("Error creating campaign", error);
      toast.error("Failed to create campaign");
    },
  });

  const onSubmit = (data: FormData) => {
    const formattedData = {
      title: data.title || "",
      location: data.location || "",
      caption: data.caption || "",
      status: data.status?.toUpperCase() || "PENDING",
      starting_price: Number(data.starting_price || 0),
      pixel_id: data.pixel_id || "",
      amenities: data.amenities || "",
      google_tag_id: data.google_tag_id || "",
      content: data.content || "",
      meta_keywords: data.meta_keywords || "",
      meta_description: data.meta_description || "",
      project_details: data.project_details || "",
      campaignTemplateId: data.campaignTemplateId || "",
    };
    createCampaign(formattedData);
  };

  return {
    form,
    onSubmit,
    isPending,
    amenities,
    gettingAmenities
  };
};

export default useCreateCampaigns;
