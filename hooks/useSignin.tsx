"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FetchError } from "@/lib/FetchError";

const formSchema = z.object({
  password: z
    .string()
    .min(2, {
      message: "Please enter your password",
    })
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/, {
      message:
        "Password must contain at least one uppercase letter, one number, and one special character.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});
const useSignin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        ...values,
      });

      if (result?.ok) {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        // logged in
        if (session?.user?.id) {
          const subdomain = session?.user?.company?.username;
          if (subdomain) {
            window.location.href = `http://${subdomain}.${process.env.NEXT_PUBLIC_AUTH_URL}/home`;
          } else {
            window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/company-setup`;
          }
        }
      } else {
        toast.error("Error", {
          description: result?.error,
        });

      }
    } catch (error) {
      if (error instanceof FetchError) {
        // toast({ type: "error", message: error.data.message });
      } else {
        // trapError(error);
      }
    }

    setIsLoading(false);
  };
  return {
    form,
    handleSubmit,
    isLoading,
    isPending: isLoading,
  };
};

export default useSignin;
