"use client";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { inviteSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

type FormData = z.infer<typeof inviteSchema>;

const useInviteMember = () => {
  const axiosAuth = useAxiosAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      invites: [{ email: "", roleId: null }]
    }
  });

  const { isLoading: isLoadingRoles, data: roles } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/roles");
      const results = response.data.data

      const modifiedRoles = results.map((role: any) => ({
        value: role.id,
        label: role.name
      }))
      return modifiedRoles;
    },
    queryKey: ["roles"],
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => {
      return axiosAuth.post(`/user-invites`, credentials);
    },
    onSuccess: (response: any) => {
      if (response?.data?.status === 'success') {
        toast("Success", {
          description: response?.data?.message || `Invitation sent successfully`,
        });
        form.reset()
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


  return { isLoadingRoles, roles, onSubmit, form, isPending };
};

export default useInviteMember;
