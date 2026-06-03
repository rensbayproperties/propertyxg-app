"use client";
import { contactSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type FormData = z.infer<typeof contactSchema>;

const useUpdateContact = ({ slug }: { slug: string }) => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interest: "",
      full_name: "",
      phone: "",
      email: "",
      whatsapp: "",
      description: "",
      tags: [],
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["contact", slug],
    queryFn: async () => {
      const res = await axiosAuth.get(`/contact/${slug}`);
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        interest: data.interest ?? "",
        full_name: data.full_name ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        whatsapp: data.whatsapp ?? "",
        description: data.description ?? "",
        tags: data.tags ?? [],
      });
    }
  }, [data, form]);

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (payload: FormData) =>
      axiosAuth.patch(`/contact/${slug}`, payload),

    onSuccess: () => {
      toast("Success", { description: "Client updated successfully." });
      router.push("/clients");
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  return {
    form,
    onSubmit,
    isPending,
    isLoading,
  };
};

export default useUpdateContact;
