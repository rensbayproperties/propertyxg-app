"use client";
import { tenantSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type FormData = z.infer<typeof tenantSchema>;

const useCreateTenant = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [modifiedUnitsData, setModifiedUnitsData] = useState<any[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      unitId: "",
      tenants: [
          {
              full_name: "",
              email: "",
              phone: "",
        },
      ],
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
    properties: useQuery({
      queryKey: ["properties"],
      queryFn: () => fetchData("/properties/list"),
    }),
  };

  const transformedData = useMemo(
    () => ({
      properties: queries.properties.data?.properties.map((property: any) => ({
        label: `${property?.address}`,
        value: property?.id,
      })),
      units: modifiedUnitsData.map((unit: any) => ({
        label: `${unit?.name}`,
        value: unit?.id,
      })),
    }),
    [queries.properties.data, modifiedUnitsData]
  );

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.post("/tenant", credentials),
    onSuccess: () => {
      toast("Success", { description: "Create tenant successfull." });
      form.reset();
      router.push("/tenants");
    },
  });

   const { data: propertyData, isLoading: loadingPropertyData } = useQuery({
      queryKey: ["property-data"],
      queryFn: async () => {
        const res = await axiosAuth.get("/properties");
        return res.data.data;
      },
    });


  const onSubmit = async (values: FormData) => {
    try {
      console.log("SUBMITTED PAYLOAD:", values);
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
    isLoading,
    onSubmit,
    isPending,
    modifiedAssignees: transformedData.properties,
    modifiedUnitsData: transformedData.units,
    propertyData
  };
};

export default useCreateTenant;
