"use client";
import { contactSchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type FormData = z.infer<typeof contactSchema>;

const useCreateContact = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const axiosAuth = useAxiosAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            interest: "",
            full_name: "",
            phone: "",
            email: "",
            whatsapp: "",
            description: "",
            tags: [],
        },
    });

    const fetchData = useCallback(
        async (endpoint: string) => {
            const response = await axiosAuth.get(endpoint);
            return response.data.data.customfields_datapayload
                ? JSON.parse(response.data.data.customfields_datapayload)
                : response.data.data;
        },
        [axiosAuth]
    );

    // const queries = {
    //     customerType: useQuery({
    //         queryKey: ["customerType"],
    //         queryFn: () => fetchData("/leads/type/all"),
    //     }),
    // };

    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: (credentials: any) =>
            axiosAuth.post("/contact", credentials),
        onSuccess: () => {
            toast("Success", { description: "Client created successfully." });
            form.reset();
            router.push("/clients");
        },
    });

    const status = [
        { value: "general", label: "General" },
        { value: "distress", label: "Distress" },
    ];

    const onSubmit = async (values: FormData) => {
        try {
            await submit(values);
        } catch (err: any) {
            toast("Failed", {
                description: "Something went wrong. Please try again later",
            });
        }
    };

    // const isLoading = Object.values(queries).some((query) => query.isLoading);

    return {
        form,
        status,
        // isLoading,
        onSubmit,
        isPending,
        // ...queries,
    };
};

export default useCreateContact;
