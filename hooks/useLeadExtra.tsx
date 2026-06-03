"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { extraLeadSchema } from "@/lib/schemas";

type FormData = z.infer<typeof extraLeadSchema>;

const useLeadExtra = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(extraLeadSchema),
    defaultValues: {
      // options: [{ option: "" }]
      // options: []
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) =>
      axiosAuth.post("/leads/extra", credentials),
    onSuccess: () => {
      alert('done')
      // toast("Success", { description: "Lead updated successfully." });
    },
  });


  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data.data;
  };

  const { data: customFields, isLoading: gettingCustomFields } = useQuery({
    queryKey: ["custom-fields", "lead"],
    queryFn: async () => fetchData("/custom-settings?type=LEAD"),
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

  const isLoading = gettingCustomFields

  return {
    onSubmit,
    form,
    customFields,
    gettingCustomFields,
    isPending,
    isLoading,
  };
};

export default useLeadExtra;
