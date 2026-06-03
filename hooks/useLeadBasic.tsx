"use client";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { basicLeadSchema } from "@/lib/schemas";

type FormData = z.infer<typeof basicLeadSchema>;

const useLeadBasic = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(basicLeadSchema),
    defaultValues: {
      title: "",
      full_name: "",
      email: "",
      phone: "",
      lead_status: "NEW",
      source: "",
      options: []
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) =>
      axiosAuth.post("/leads", credentials, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast("Success", { description: "Lead created successfully." });
        form.reset();
        router.push(`/leads/${res?.data?.data?.id}`);
      }
    },
  });

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data;
  };

  const { data: customFields, isLoading: gettingCustomFields } = useQuery({
    queryKey: ["custom-fields", "lead"],
    queryFn: async () =>
      fetchData("/custom-settings?type=LEAD&section=BASIC_INFO"),
  });

  const { data: customFieldsExtra, isLoading: gettingCustomFieldsExtra } =
    useQuery({
      queryKey: ["custom-fields", "lead", "extra"],
      queryFn: async () =>
        fetchData("/custom-settings?type=LEAD&section=EXTRA_INFO"),
    });

  // const { data: status, isLoading: gettingStatus } = useQuery({
  //   queryKey: ["status"],
  //   queryFn: async () => fetchData("/leads/status/all"),
  // });
  // const status = [
  //   { id: "NEW", title: "NEW" },
  //   { id: "HOT", title: "HOT" },
  //   { id: "COLD", title: "COLD" },
  //   { id: "WARM", title: "WARM" },
  // ];
  const status = [
    "NEW",
    "HOT",
    "WARM",
    "COLD",
    "CONTACTED",
    "FOLLOW_UP",
    "INTERESTED",
    "QUALIFIED",
    "NOT_QUALIFIED",
    "VIEWING_SCHEDULED",
    "VIEWED",
    "OFFER_MADE",
    "NEGOTIATION",
    "BOOKED",
    "CLOSED_WON",
    "CLOSED_LOST",
    "UNRESPONSIVE",
    "DUPLICATE"
  ]
  const gettingStatus = false;

  const onSubmit = async (values: FormData) => {
    try {
      const formData = new FormData();
      formData.append("title", values.full_name);
      formData.append("full_name", values.full_name);
      formData.append("email", values.email || "");
      formData.append("phone", values.phone || "");
      formData.append("lead_status", values.lead_status || "");
      formData.append("source", values.source || "");

      await submit(formData);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const isLoading = gettingStatus;

  return {
    onSubmit,
    form,
    status,
    isPending,
    isLoading,
    gettingCustomFields,
    customFields,
    customFieldsExtra,
    gettingCustomFieldsExtra,
  };
};

export default useLeadBasic;
