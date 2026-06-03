"use client";

import { rentSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import useAxiosAuth from "./useAxiosAuth";

type FormData = z.infer<typeof rentSchema>;

const toArray = (value: any) => (Array.isArray(value) ? value : []);
const extractRows = (payload: any) =>
  toArray(
    payload?.data?.data ??
    payload?.data ??
    payload?.properties ??
    payload?.list ??
    payload
  );

const useCreateRent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(rentSchema),
    defaultValues: {
      property: "",
      unit: "",
      excludes: [],
      charges: [
        {
          id: "",
          rent_amount: 0,
          start_date: "",
          end_date: "",
        },
      ],
      remind: false,
      send_reminder: "DUE_DATE",
      send_reminder_every: "1",
      send_reminder_period: "d",
      notify: "once",
    },
  });

  const selectedProperty = form.watch("property");
  const selectedUnit = form.watch("unit");
  const remindEnabled = form.watch("remind");

  const { data: propertyData, isLoading: loadingProperties } = useQuery({
    queryKey: ["properties-list"],
    queryFn: async () => {
      const response = await axiosAuth.get("/properties");
      const payload = response.data?.data ?? response.data;
      return extractRows(payload);
    },
  });

  const { data: locations, isLoading: loadingLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const response = await axiosAuth.get("/locations");
      return response.data?.data ?? response.data;
    },
  });

  const { data: chargesResponse, isLoading: loadingCharges } = useQuery({
    queryKey: ["charges-options"],
    queryFn: async () => {
      const response = await axiosAuth.get("/charge?limit=100&page=1");
      const payload = response.data?.data ?? response.data;
      return extractRows(
        payload?.charges ?? payload?.charge ?? payload?.list ?? payload?.data ?? payload
      );
    },
  });

  const { data: unitsResponse, isLoading: loadingUnits } = useQuery({
    queryKey: ["property-units", selectedProperty],
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/properties/${encodeURIComponent(selectedProperty)}/units`
      );
      const payload = response.data?.data ?? response.data;
      return extractRows(payload?.units ?? payload?.data ?? payload);
    },
    enabled: Boolean(selectedProperty),
  });

  const { data: tenantsResponse, isLoading: loadingTenants } = useQuery({
    queryKey: ["unit-tenants", selectedUnit],
    queryFn: async () => {
      const response = await axiosAuth.get(`/tenants?unit=${selectedUnit}`);
      const payload = response.data?.data ?? response.data;
      return extractRows(payload?.tenants ?? payload?.data ?? payload);
    },
    enabled: Boolean(selectedUnit),
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (payload: FormData) => axiosAuth.post("/collection", payload),
    onSuccess: () => {
      toast("Success", { description: "Collection created successfully." });
      queryClient.invalidateQueries({ queryKey: ["rents"] });
      router.push("/payment-collections");
    },
  });

  const propertyOptions = useMemo(
    () =>
      toArray(propertyData).map((property: any) => ({
        label: property?.address ?? `Property ${property?.id ?? ""}`,
        value: String(property?.id ?? ""),
      })),
    [propertyData]
  );

  const fallbackUnitsFromProperty = useMemo(() => {
    const selected = toArray(propertyData).find(
      (property: any) => String(property?.id) === String(selectedProperty)
    );
    return toArray(selected?.units);
  }, [propertyData, selectedProperty]);

  const unitOptions = useMemo(
    () =>
      (toArray(unitsResponse).length > 0
        ? toArray(unitsResponse)
        : fallbackUnitsFromProperty
      ).map((unit: any) => ({
        label: unit?.name ?? `Unit ${unit?.id ?? ""}`,
        value: String(unit?.id ?? ""),
      })),
    [unitsResponse, fallbackUnitsFromProperty]
  );

  const tenantOptions = useMemo(
    () =>
      toArray(tenantsResponse).map((tenant: any) => ({
        label:
          tenant?.full_name ??
          `${tenant?.first_name ?? ""} ${tenant?.last_name ?? ""}`.trim() ??
          `Tenant ${tenant?.id ?? ""}`,
        value: String(tenant?.id ?? ""),
      })),
    [tenantsResponse]
  );

  const chargeOptions = useMemo(
    () =>
      toArray(chargesResponse).map((charge: any) => ({
        label: charge?.name ?? `Charge ${charge?.id ?? ""}`,
        value: String(charge?.id ?? ""),
      })),
    [chargesResponse]
  );

  const onSubmit = async (values: FormData) => {
    try {
      const payload: FormData = {
        ...values,
        charges: values.charges.map((charge) => ({
          ...charge,
          id: String(charge.id),
        })),
      };

      if (!payload.remind) {
        delete payload.send_reminder;
        delete payload.send_reminder_every;
        delete payload.send_reminder_period;
        delete payload.notify;
      }

      await submit(payload);
    } catch (error) {
      toast("Failed", {
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    remindEnabled,
    propertyOptions,
    unitOptions,
    chargeOptions,
    tenantOptions,
    loadingProperties,
    loadingUnits,
    loadingCharges,
    loadingTenants,
    loadingLocations,
    locations,
  };
};

export default useCreateRent;
