"use client";

import { propertySchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCallback, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import * as z from "zod";

type FormData = z.infer<typeof propertySchema>;

const useUpdateProperty = (slug: string) => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      address: "",
      location: undefined,
      description: "",
      landlord: undefined, // <-- initially undefined
      units: [],
    },
  });

  /** ---------- Fetch Helper ---------- **/
  const fetchData = useCallback(
    async (endpoint: string) => {
      const res = await axiosAuth.get(endpoint);
      return res.data.data.customfields_datapayload
        ? JSON.parse(res.data.data.customfields_datapayload)
        : res.data.data;
    },
    [axiosAuth]
  );

  /** ---------- Dropdown Data Queries ---------- **/
  const queries = {
    locations: useQuery({
      queryKey: ["allLocations"],
      queryFn: async () => {
        const res = await axiosAuth.get(`/locations`);
        return res.data.data;
      },
    }),

    assignees: useQuery({
      queryKey: ["landlords"],
      queryFn: () => fetchData("/properties/landlords"),
    }),
  };

  const transformedData = useMemo(
    () => ({
      assignees: queries.assignees.data?.map((user: any) => ({
        label: `${user.name}`,
        value: user.id,
      })),
    }),
    [queries.assignees.data]
  );

  /** ---------- Fetch Previous Property Data ---------- **/
  const { data: prevData, isLoading: loadingPrevData } = useQuery({
    queryKey: ["prev-property-data", slug],
    queryFn: async () => {
      const res = await axiosAuth.get(`/properties/${slug}`);
      return res.data.data;
    },
  });

  const { data: landlords, isLoading: loadingLandlords } = useQuery({
    queryKey: ["landlord-list"],
    queryFn: async () => {
      const response = await axiosAuth.get("/properties/landlords");
      return response.data.data;
    },
  });

  /** ---------- Auto-populate the form when prevData arrives ---------- **/
  useEffect(() => {
    if (!prevData) return;

    form.reset({
      address: prevData.address ?? "",
      location: prevData.location?.id ?? undefined,
      description: prevData.description ?? "",
      // <-- set assigned landlord as default value
      landlord: prevData.assigned_landlord
        ? {
          id: prevData.assigned_landlord.id,
          email: prevData.assigned_landlord.email,
        }
        : undefined,
      units: prevData.units ?? [],
    });
  }, [prevData, form]);

  /** ---------- Update Mutation ---------- **/
  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: async (values: FormData) =>
      axiosAuth.patch(`/properties/${slug}`, values),
    onSuccess: () => {
      toast("Success", { description: "Property updated successfully." });
      router.push("/properties-units");
    },
    onError: (err: any) => {
      toast("Failed", {
        description: err.response?.data?.message || "Something went wrong.",
      });
    },
  });

  /** ---------- Submit Handler ---------- **/
  const onSubmit = async (values: FormData) => {
    await submit(values);
  };

  /** ---------- Loading State ---------- **/
  const isLoading = Object.values(queries).some((q) => q.isLoading);

  /** ---------- Status Options ---------- **/
  const status = [
    { value: "pending", label: "List Only" },
    { value: "publish", label: "Published" },
  ];

  return {
    form,
    status,
    isLoading,
    onSubmit,
    isPending,
    modifiedAssignees: transformedData.assignees,
    prevData,
    loadingPrevData,
    loadingLandlords,
    landlords,
  };
};

export default useUpdateProperty;
