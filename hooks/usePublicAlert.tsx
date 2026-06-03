"use client";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof contactSchema>;

const usePublicAlert = () => {
  const axiosAuth = useAxiosAuth();
  const formAlert = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => {
      return axiosAuth.post(`/listing/alerts`, credentials);
    },
    onSuccess: (response: any) => {
      if (response?.data?.success === true) {
        toast("Success", {
          description: response?.data?.message || `Alert SetUp successfully`,
        });
        formAlert.reset();
      } else {
        toast("Error", {
          description: response?.data?.message || `An error occured`,
        });
      }
    },
  });

  const onSubmitAlert = async (values: any, extraData?: any) => {
    try {
      const payload = {
        ...values,
        ...extraData,
      };

      console.log("payload", payload)

      await submit(payload);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  return { onSubmitAlert, formAlert, isPending };
};

export default usePublicAlert;
