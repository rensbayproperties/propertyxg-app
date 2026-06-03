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

const useListingTrend = (opt: string = "") => {
  const axiosAuth = useAxiosAuth();
  const month = "11"
  const limit = "6"

  const { data: TrendData, isLoading: gettingTrendData } = useQuery({
    queryKey: [
      "trenddata",
      {
        opt,
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/transactions/price-trend?location=${opt}&months=${month}`,
      );
      const result = response?.data?.data;
      return result;
    },
  });

  const { data: HistoryData, isLoading: gettingHistoryData } = useQuery({
    queryKey: [
      "historyData",
      {
        opt,
      },
    ],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/transactions/rental-history?location=${opt}&limit=${limit}`,
      );
      const result = response?.data?.data;
      return result;
    },
  });

  return {
    TrendData,
    gettingTrendData,
    HistoryData,
    gettingHistoryData,
  };
};

export default useListingTrend;
