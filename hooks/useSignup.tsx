"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { FetchError } from "@/lib/FetchError";
import { useMutation } from "@tanstack/react-query";
import { axiosAuth } from "@/lib/api";
import { signupSchema } from "@/lib/schemas";

const useSignup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            // phone: undefined,
            // refcode: undefined,
            // company_name: undefined,
        },
    });

    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: (credentials: any) => {
            return axiosAuth.post(`/auth/signup`, credentials);
        },
        onSuccess: async (response: any, _variables, _context) => {
            if (response?.data?.success === true) {
                toast("Success", {
                    description: `Signup successful. Please check your email for verification.`,
                });

                router.push(`/company-setup/${response?.data?.data?.user?.id}`);
            } else {
                toast("Error", {
                    description: response?.data?.message || response?.data?.message?.message || "An error occurred. Please try again.",
                });
            }
        },
    });

    const handleSubmit = async (values: z.infer<typeof signupSchema>) => {
        try {
            setIsLoading(true);
            const result = await submit(values);
        } catch (error) {
            if (error instanceof FetchError) {
                // toast({ type: "error", message: error.data.message });
            } else {
                // trapError(error);
            }
        }

        setIsLoading(false);
    };

    const redirectToGoogleLogin = async () => {
        signIn("google", {
            callbackUrl: `/google-callback`,
        });
    };

    return {
        form,
        handleSubmit,
        isLoading,
        isPending,
        redirectToGoogleLogin
    };
};

export default useSignup;
