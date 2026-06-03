"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { watermarkSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

type WatermarkForm = z.infer<typeof watermarkSchema>;

const useWatermark = () => {
  const axiosAuth = useAxiosAuth();

  const { data: session }: { data: any } = useSession();

  const form = useForm<WatermarkForm>({
    resolver: zodResolver(watermarkSchema),
    defaultValues: {
      type: "IMAGE",
      image: undefined,
      text: session?.user?.company?.name ?? "Company Name",
      opacity: 0.8,
      scale: 0.5,
      position: "center",
      color: "#ffffff",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.post("/watermark", credentials, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
    onSuccess: () => {
      toast("Success", { description: "Watermark created successfully." });
      // form.reset();
    },
  });

  const onSubmit = async (values: WatermarkForm) => {
    try {
      const formData = new FormData();
      formData.append("type", values.type);
      formData.append("label", String(values.text));
      formData.append("opacity", String(values.opacity));
      formData.append("proportion", String(values.scale));
      formData.append("position", mapWatermarkPosition(String(values.position)));
      formData.append("color", values.color || "");
      // console.log('images', values.image)
      if (values.image) {
        const file = values.image as File;
        const blob = new Blob([file], { type: file.type });
        formData.append("file", blob, file.name);
      }


      await submit(formData);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const mapWatermarkPosition = (position: string) => {
    const opts = [
      { value: "top-left", label: "TL" },
      { value: "top-center", label: "TC" },
      { value: "top-right", label: "TR" },
      { value: "center-left", label: "CL" },
      { value: "center", label: "C" },
      { value: "center-right", label: "CR" },
      { value: "bottom-left", label: "BL" },
      { value: "bottom-center", label: "BC" },
      { value: "bottom-right", label: "BR" },
    ]

    return opts.find((opt) => opt.value === position)?.label || "C";
  }

  const { data: prevData, isLoading: loadingPrevData } = useQuery({
    queryKey: ["prev-watermark-data"],
    queryFn: async () => {
      const res = await axiosAuth.get("/watermark");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (!prevData) return;

    form.reset({
      type: prevData.type ?? "image",
      image: prevData.url ?? null,
      text: prevData.label ?? session?.user?.company?.name ?? "Company Name",
      opacity: prevData.opacity ?? 0.8,
      scale: prevData.scale ?? 0.5,
      position: prevData.position ?? "center",
      color: prevData.color ?? "#ffffff",
    });
  }, [prevData, form]);

  // const onSubmit = async (values: WatermarkForm) => {
  //   try {
  //     await submit(values);
  //   } catch (err: any) {
  //     toast("Failed", {
  //       description: "Something went wrong. Please try again later",
  //     });
  //   }
  // };

  return {
    form,
    onSubmit,
    isPending,
    reset: form.reset,
  };
};

export default useWatermark;
