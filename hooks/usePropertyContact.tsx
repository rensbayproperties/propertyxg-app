"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { propertyContactSchema } from "@/lib/schemas";
import { ListingsColumns } from "@/types";

type FormData = z.infer<typeof propertyContactSchema>;

const usePropertyContact = (selectedListing: ListingsColumns | null) => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(propertyContactSchema),
    defaultValues: {
      message: selectedListing?.id || "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.post("/listing", credentials),
    onSuccess: (res) => {
      if (res?.data?.success) {
        toast("Success", { description: "Listing created successfully." });
      }
    },
  });


  const onSubmit = async (values: any) => {
    try {
      await submit(values);
    } catch (err) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  return {
    onSubmit,
    form,
    isPending,
  };
};

export default usePropertyContact;
