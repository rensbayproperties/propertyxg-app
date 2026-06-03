"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FetchError } from "@/lib/FetchError";
import { useMutation } from "@tanstack/react-query";
import { companySchema } from "@/lib/schemas";
import useAxiosAuth from "./useAxiosAuth";

const useCompanySetup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const form = useForm<z.infer<typeof companySchema>>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            company_name: "",
            username: "",
        },
    });

    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: (credentials: any) => {
            return axiosAuth.post(`/auth/company-setup`, credentials);
        },
        onSuccess: async (response: any, _variables, _context) => {
            if (response?.data?.success === true) {
                toast("Success", {
                    description: `Company successfully setup. Login to continue`,
                });

                router.push(`/home`);
            } else {
                toast("Error", {
                    description: response?.data?.message || response?.data?.message?.message || "An error occurred. Please try again.",
                });
            }
        },
    });

    const handleSubmit = async (values: z.infer<typeof companySchema>) => {
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
    return {
        form,
        handleSubmit,
        isLoading,
        isPending
    };
};

export default useCompanySetup;
