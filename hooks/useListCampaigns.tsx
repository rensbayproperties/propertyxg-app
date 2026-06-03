"use client";
import { useQuery } from "@tanstack/react-query";
import { ListCampaignSchema } from "@/lib/schemas";
import z from "zod";
import useAxiosAuth from "./useAxiosAuth";

type Campaign = z.infer<typeof ListCampaignSchema>;

export const useListCampaigns = () => {
  const axiosAuth = useAxiosAuth();
  const {
    isLoading: isLoadingAllCampaigns,
    data: allCampaigns,
    isError,
  } = useQuery<Campaign[]>({
    queryKey: ["campaign"],
    queryFn: async () => {
      const response = await axiosAuth.get("/campaign");
      const data = response.data?.data;
      console.log(`all campaigns:`, data);
      return data;
    },
  });

  return { isLoadingAllCampaigns, allCampaigns, isError };
};
