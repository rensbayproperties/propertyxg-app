"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { axiosAuth } from "@/lib/api";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const useResetPassword = (token: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const router = useRouter();

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        console.error("Reset password token is missing");
        setTokenValid(false);
        toast.error("Invalid or missing reset token");
        return;
      }

      try {
        const response = await axiosAuth.post(`/auth/verify-reset-token`, {
          token,
        });

        if (response?.data?.success === true || response?.status === 200) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          toast.error("Invalid or expired reset token");
          setTimeout(() => router.push('/forgot-password'), 2000);
        }
      } catch (error: any) {
        console.error("Token verification error:", error);
        setTokenValid(false);
        const errorMessage = 
          error?.response?.data?.message || 
          "Invalid or expired reset token";
        toast.error(errorMessage);
        setTimeout(() => router.push('/forgot-password'), 2000);
      }
    };

    verifyToken();
  }, [token, router]);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (data: { token: string; password: string }) => {
      return axiosAuth.post(`/auth/reset-password`, data);
    },
    onSuccess: async (response: any) => {
      if (response?.data?.success === true || response?.status === 200) {
        toast.success(
          response?.data?.message || "Password reset successfully!"
        );
        // Redirect to signin page after successful password reset
        setTimeout(() => router.push('/signin'), 1500);
      } else {
        toast.error(
          response?.data?.message || "Failed to reset password. Please try again."
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

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!tokenValid) {
      toast.error("Invalid reset token. Please request a new password reset link.");
      return;
    }

    try {
      setIsLoading(true);
      await submit({
        token,
        password: data.password,
      });
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleSubmit,
    isLoading: isLoading || isPending,
    isPending,
    tokenValid,
  };
};

export default useResetPassword;
