"use client";

import { tenantSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import * as z from "zod";

type FormData = z.infer<typeof tenantSchema>;

const useUpdateTenant = (slug: string) => {
  const { data: session } = useSession();
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      property: "",
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

  /** ---------- PREVIOUS TENANT DATA ---------- **/
  const { data: prevData } = useQuery({
    queryKey: ["prev-tenant-data", slug],
    queryFn: async () => {
      const res = await axiosAuth.get(`/tenant/${slug}`);
      return res.data.data;
    },
  });

  /** ---------- PROPERTIES LIST ---------- **/
  const { data: propertyData } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const res = await axiosAuth.get("/properties");
      return res.data.data;
    },
  });

  /** ---------- RESET FORM WITH PREVIOUS DATA ---------- **/
  useEffect(() => {
    if (!prevData || !propertyData) return;

    // Find property that contains the previous unit
    const propertyMatch = propertyData.data.find((p: any) =>
      p.units.some((u: any) => u.id === prevData.unit.id)
    );

    const propertyId = propertyMatch?.id ?? "";

    // Reset form
    form.reset({
      property: propertyId,
      unitId: prevData.unit.id || "",
      tenants: [
        {
          full_name: prevData.full_name || "",
          email: prevData.email || "",
          phone: prevData.phone || "",
        },
      ],
    });
  }, [prevData, propertyData, form]);

  /** ---------- SUBMIT ---------- **/
  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: async (values: FormData) => {
      const payload = {
        property: values.property || prevData?.property_id,
        unitId: values.unitId || prevData?.unit_id,
        tenants: values.tenants.map((tenant: any, i: number) => ({
          full_name: tenant.full_name || prevData.tenants[i]?.full_name,
          email: tenant.email || prevData.tenants[i]?.email,
          phone: tenant.phone || prevData.tenants[i]?.phone,
        })),
      };

      return axiosAuth.patch(`/tenant/${slug}`, payload);
    },

    onSuccess: () => {
      toast("Success", {
        description: "Tenant updated successfully.",
      });
      router.push("/tenants");
      
    },
    onError: (err: any) => {
      toast("Failed", {
        description: err.response?.data?.message || "Something went wrong.",
      });
    },
  });

  const onSubmit = async (values: FormData) => {
    await submit(values);
  };

  return {
    form,
    prevData,
    propertyData,
    onSubmit,
    isPending,
  };
};

export default useUpdateTenant;
