"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { axiosAuth } from "@/lib/api";

const updatePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, "Password must be at least 8 characters"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

const useUpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => {
      return axiosAuth.post(`/auth/change-password`, data);
    },
    onSuccess: async (response: any) => {
      if (response?.data?.success === true || response?.status === 200) {
        toast.success(
          response?.data?.message || "Password update successfully!"
        );
        // Redirect to signin page after successful password reset
        setTimeout(() => router.push('/home'), 1500);
      } else {
        toast.error(
          response?.data?.message || "Failed to update password. Please try again."
        );
      }
    },
    onError: (error: any) => {
      console.error("Reset password error:", error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: UpdatePasswordFormData) => {
    try {
      setIsLoading(true);
      await submit({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    } catch (error) {
      console.error("Update password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: isLoading || isPending,
    isPending,
  };
};

export default useUpdatePassword;
