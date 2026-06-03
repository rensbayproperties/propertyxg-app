"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { propertyContactReviewSchema } from "@/lib/schemas";
import { useState } from "react";

type FormData = z.infer<typeof propertyContactReviewSchema>;

const usePropertyContactReview = (id: string) => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(propertyContactReviewSchema),
    defaultValues: {
      closed: "YES",
      message: "",
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
    isDialogOpen, setIsDialogOpen,
  };
};

export default usePropertyContactReview;
