"use client";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { inviteLandSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof inviteLandSchema>;

const useInviteLandlord = () => {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(inviteLandSchema),
    defaultValues: {
      landlords: [{ email: "" }]
    }
  });


  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => {
      return axiosAuth.post(`/properties/landlords`, credentials);
    },
    onSuccess: (response: any) => {
      if (response?.data?.success === true) {
        toast("Success", {
          description: response?.data?.message || `Invitation sent successfully`,
        });
        form.reset()
        router.push("/property-management/landlords");
      } else {
        toast("Error", {
          description: response?.data?.message || `An error occured`,
        });
      }
    },
  });

  // const onSubmit = async (values: z.infer<typeof inviteSchema>) => {
  // };
  const onSubmit = async (values: FormData) => {
    try {
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };


  return { onSubmit, form, isPending };
};

export default useInviteLandlord;
