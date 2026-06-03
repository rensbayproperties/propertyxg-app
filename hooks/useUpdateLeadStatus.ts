"use client";

import { leadStatusSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import * as z from "zod";

type FormData = z.infer<typeof leadStatusSchema>;

const useUpdateLeadStatus = () => {
    const axiosAuth = useAxiosAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(leadStatusSchema),
        defaultValues: {
            options: [],
        },
    });

    /** ---------- Fetch Previous Property Data ---------- **/
    const { data: prevData, isLoading: loadingPrevData } = useQuery({
        queryKey: ["lead-status"],
        queryFn: async () => {
            const res = await axiosAuth.get(`/leads/status/all`);
            return res.data;
        },
    });

    useEffect(() => {
        if (!prevData || !prevData?.success) return;
        console.log('prevData', prevData);

        form.reset({
            options: prevData.data.map((opt: any) => ({ "label": opt.status, "color": opt?.color || "" })) ?? [],
        });
    }, [prevData, form]);

    /** ---------- Update Mutation ---------- **/
    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: async (values: FormData) =>
            axiosAuth.patch(`/leads/status`, values),
        onSuccess: () => {
            toast("Success", { description: "Lead status updated successfully." });
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

export default useUpdateLeadStatus;
