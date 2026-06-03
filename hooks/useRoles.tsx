"use client";
import React, { useCallback } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { roleSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { RoleFormData, CreateRoleResponse } from "@/types";

type FormData = z.infer<typeof roleSchema>;

interface UseRolesReturn {
  form: ReturnType<typeof useForm<FormData>>;
  onSubmit: (values: FormData) => Promise<void>;
  isPending: boolean;
  isSuccess: boolean;
  resetForm: () => void;
}

const useRoles = (): UseRolesReturn => {
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: "",
      role_description: "",
    },
    mode: "onChange", // Real-time validation
  });

  const { mutateAsync: submit, isPending, isSuccess } = useMutation({
    mutationFn: async (credentials: FormData): Promise<CreateRoleResponse> => {
      // Transform the data to match API expectations
      const transformedData = {
        name: credentials.name,
        description: credentials.role_description,
      };

      const response = await axiosAuth.post<CreateRoleResponse>("/roles", transformedData);
      return response.data;
    },
    onSuccess: (response: CreateRoleResponse) => {
      // Check for success based on your API response format
      if (response?.statusCode === 200 && response?.success === true) {
        toast.success("Role Created Successfully", {
          description: response?.message || "Your new role has been created and is ready to use.",
          duration: 4000,
        });
        form.reset();
      } else {
        toast.error("Creation Failed", {
          description: response?.message || "Unable to create role. Please try again.",
        });
      }
    },
    onError: (error: any) => {
      console.error("Role creation error:", error);
      toast.error("Network Error", {
        description: error?.response?.data?.message || "Unable to connect to server. Please check your connection.",
        duration: 5000,
      });
    },
  });

  const onSubmit = useCallback(async (values: FormData): Promise<void> => {
    try {
      await submit(values);
    } catch (error) {
      // Error handling is done in the mutation's onError
      console.error("Submit error:", error);
    }
  }, [submit]);

  const resetForm = useCallback(() => {
    form.reset();
  }, [form]);

  return {
    form,
    onSubmit,
    isPending,
    isSuccess,
    resetForm,
  };
};

export default useRoles;
