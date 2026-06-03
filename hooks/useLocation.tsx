"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { parseAsInteger, useQueryState } from "nuqs";
import { locationSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof locationSchema>;
const useLocation = () => {
  const router = useRouter();
    const axiosAuth = useAxiosAuth();
      const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(10)
  );
 
  const form = useForm<FormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent: undefined,
      
    },
  });

   const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: FormData) => {
      const res = axiosAuth.post("/locations", credentials);

      return res;
    },
    onSuccess: () => {
      toast("Success", {
        description: "Location created successfully.",
      });
      form.reset();
      router.push("/locations");
    },
  });
  const onSubmit = async (values: z.infer<typeof locationSchema>) => {
   try {
     await submit(values as any); 
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };


  const {data: locations, isLoading} = useQuery({
    queryKey: ['locations', {pageSize, currentPage}],
    queryFn: async () => {
      const res = await axiosAuth.get(`/locations?limit=${pageSize}&page=${currentPage}`)
      const results = res.data.data
      return results
    } 
  })
    const {data: allLocations, isLoading: isLoadingAll} = useQuery({
    queryKey: ['allLocations'],
    queryFn: async () => {
      const res = await axiosAuth.get(`/locations`)
      const results = res.data.data
      return results
    } 
  })

  
 
  return {onSubmit, form, locations, isLoading, pageSize, setPageSize, currentPage, setCurrentPage, allLocations, isLoadingAll, isPending};
};

export default useLocation;
