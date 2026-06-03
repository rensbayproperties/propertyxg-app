"use client";
import { propertySchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type FormData = z.infer<typeof propertySchema>;

const useCreateProperty = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      location: undefined,
      description: undefined,
      landlord: {
        id: undefined,
        email: undefined,
      },
      units: [],
    },
  });

  const fetchData = useCallback(
    async (endpoint: string) => {
      const response = await axiosAuth.get(endpoint);
      return response.data.data.customfields_datapayload
        ? JSON.parse(response.data.data.customfields_datapayload)
        : response.data.data;
    },
    [axiosAuth]
  );

  const queries = {
    locations: useQuery({
      queryKey: ["allLocations"],
      queryFn: async () => {
        const res = await axiosAuth.get(`/locations`);
        return res.data.data;
      },
    }),
    assignees: useQuery({
      queryKey: ["assignees"],
      queryFn: () => fetchData("/users/landlords"),
    }),
  };

  const transformedData = useMemo(
    () => ({
      assignees: queries.assignees.data?.users.map((assignee: any) => ({
        label: `${assignee?.first_name} ${assignee?.last_name}`,
        value: assignee?.id,
      })),
    }),
    [queries.assignees.data]
  );

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) =>
      axiosAuth.post("/properties", credentials),
    onSuccess: () => {
      toast("Success", { description: "Property created successfully." });
      form.reset();
      router.push("/properties-units");
    },
  });

  const { data: landlords, isLoading: loadingLandlords } = useQuery({
    queryKey: ["landlord-list"],
    queryFn: async () => {
      const response = await axiosAuth.get("/properties/landlords");
      const results = response.data.data;
      console.log("landlords", results)
      return results;
    },
  });

  const status = [
    { value: "pending", label: "List Only" },
    { value: "publish", label: "Published" },
  ];

  const onSubmit = async (values: FormData) => {
    try {
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const isLoading = Object.values(queries).some((query) => query.isLoading);

  return {
    form,
    status,
    isLoading,
    onSubmit,
    isPending,
    modifiedAssignees: transformedData.assignees,
    landlords,
    loadingLandlords
  };
};

export default useCreateProperty;
