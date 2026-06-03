"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { axiosAuth } from "@/lib/api";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (data: ForgotPasswordFormData) => {
      return axiosAuth.post(`/auth/forgot-password`, data);
    },
    onSuccess: async (response: any) => {
      if (response?.data?.success === true || response?.status === 200) {
        toast.success(
          response?.data?.message || "Password reset link sent to your email!"
        );
        // Redirect to success page after successful submission
        router.push('/forgot-password/success');
      } else {
        toast.error(
          response?.data?.message || "Failed to send reset link. Please try again."
        );
      }
    },
    onError: (error: any) => {
      console.error("Forgot password error:", error);
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      await submit(data);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading,
    isPending,
  };
};

export default useForgotPassword;
