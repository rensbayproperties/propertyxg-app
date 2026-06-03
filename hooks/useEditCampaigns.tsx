"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { EditCampaignSchema } from "@/lib/schemas";
import React, { useState } from "react";
import { toast } from "sonner";

export default function useEditCampaigns() {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string; // get team member ID from URL
  const queryClient = useQueryClient();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["Campaign", slug],
    queryFn: async () => {
      const res = await axiosAuth.get(`/campaign/${slug}`);
      console.log("FULL API RESPONSE:", res.data?.data);
      return res.data?.data;
    },
    enabled: !!slug, // only run if id exists
  });

  type formdata = z.infer<typeof EditCampaignSchema>;

  const form = useForm<formdata>({
    resolver: zodResolver(EditCampaignSchema),
    defaultValues: {
      title: "",
      caption: "",
      location: "",
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
      slug: "",
    },
  });

  //  reset form to match campaign details
  React.useEffect(() => {
    if (!campaign) return;

    form.reset({
      title: campaign.title || "",
      caption: campaign.caption || "",
      location: campaign.locationid || "",
      pixel_id: campaign.pixel_id || "",
      google_tag_id: campaign.google_tag_id || "",
      starting_price: campaign.starting_price || 0,
      amenities: campaign.amenities || "",
      status: campaign.status || "",
      content: campaign.content || "",
      meta_keywords: campaign.meta_keywords || "",
      meta_description: campaign.meta_description || "",
      project_details: campaign.project_details || "",
      campaignTemplateId: campaign.campaignTemplateId || "",
      slug: campaign.slug || "",
    });
  }, [campaign]);

  // Edit campaign details
  const { mutate: updateCampaign, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.patch(`/campaign/${campaign.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Campaign updated successfully!");
      setTimeout(() => router.push("/campaigns"), 1000);
    },
    onError: (error) => {
      console.error("Error updating Campaign", error);
    },
  });

  const { mutate: deleteCampaign } = useMutation({
    mutationFn: async (campaignID: string) => {
      const res = await axiosAuth.delete(`/campaign/${campaignID}`);
      return res.data;
    },

    onSuccess: (_data, campaignID) => {
      toast.success("Campaign deleted successfully!");

      // Remove deleted campaign from cache
      queryClient.setQueryData<any[]>(["campaigns"], (oldData) => {
        if (!oldData) return [];
        return oldData.filter((campaign) => campaign.id !== campaignID);
      });

      // Refetch campaigns to refresh the data table
      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
        refetchType: "active",
      });

      // Force immediate refetch
      queryClient.refetchQueries({
        queryKey: ["campaigns"],
      });
    },
    onError: () => {
      toast.error("Failed to delete!");
    },
  });

  const onSubmit = (data: formdata) => {
    const editedslug = data.slug?.replace(/\s+/g, "-").toLowerCase();
    const formattedData = {
      title: data.title,
      caption: data.caption,
      status: data.status?.toUpperCase(),
      starting_price: Number(data.starting_price),
      pixel_id: data.pixel_id ?? "",
      amenities: data.amenities,
      location: data.location ?? "",
      google_tag_id: data.google_tag_id ?? "",
      content: data.content ?? "",
      meta_keywords: data.meta_keywords ?? "",
      meta_description: data.meta_description ?? "",
      project_details: data.project_details ?? "",
      campaignTemplateId: data.campaignTemplateId ?? "",
      slug: editedslug ?? "",
    };
    console.log(form.getValues());
    updateCampaign(formattedData);
  };

  return {
    form,
    onSubmit,
    isPending,
    isLoading,
    campaign,
    deleteCampaign,
  };
}
