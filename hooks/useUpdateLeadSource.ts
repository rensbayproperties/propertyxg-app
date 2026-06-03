"use client";

import { leadSourceSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import * as z from "zod";

type FormData = z.infer<typeof leadSourceSchema>;

const useUpdateLeadSource = () => {
    const axiosAuth = useAxiosAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(leadSourceSchema),
        defaultValues: {
            options: [],
        },
    });

    /** ---------- Fetch Previous Property Data ---------- **/
    const { data: prevData, isLoading: loadingPrevData } = useQuery({
        queryKey: ["lead-source"],
        queryFn: async () => {
            const res = await axiosAuth.get(`/leads/source/all`);
            return res.data;
        },
    });

    useEffect(() => {
        if (!prevData || !prevData?.success) return;
        console.log('prevData', prevData);

        form.reset({
            options: prevData.data.map((opt: any) => ({ "label": opt.source, "color": opt?.color || "" })) ?? [],
        });
    }, [prevData, form]);

    /** ---------- Update Mutation ---------- **/
    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: async (values: FormData) =>
            axiosAuth.patch(`/leads/source`, values),
        onSuccess: () => {
            toast("Success", { description: "Lead sources updated successfully." });
        },
        onError: (err: any) => {
            toast("Failed", {
                description: err.response?.data?.message || "Something went wrong.",
            });
        },
    });

    const onSubmit = async (values: FormData) => {
        await submit(values);
    };

    return {
        form,
        onSubmit,
        isPending,
        prevData,
        loadingPrevData,
    };
};

export default useUpdateLeadSource;
