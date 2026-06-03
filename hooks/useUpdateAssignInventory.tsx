"use client";
import { assignInventorySchema } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

type FormData = z.infer<typeof assignInventorySchema>;
const useUpdateAssignInventory = (slug: string, userId: number) => {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const axiosAuth = useAxiosAuth();
    const [formFilled, setFormFilled] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(assignInventorySchema),
        defaultValues: {
            assigned_to: userId,
        },
    });

    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: (credentials: any) => {
            const res = axiosAuth.put(`/list/${slug}/assign`, credentials);
            return res;
        },
        onSuccess: () => {
            toast("Success", {
                description: "Inventory successfully re-assigned.",
            });

            setOpen(false)
            // router.push("/inventories");
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

    const queries = {
        assignees: useQuery({
            queryKey: ["assignees"],
            queryFn: () => fetchData("/users/assignees"),
        }),
    };

    const transformedData = useMemo(
        () => ({
            assignees: queries.assignees.data?.users.map((assignee: any) => ({
                label: `${assignee?.first_name} ${assignee?.last_name}`,
                value: assignee?.id,
            })),
        }),
        [queries.assignees.data]
    );

    const onSubmit = async (values: FormData) => {
        try {
            const formData = new FormData();
            formData.append("assigned_to", values.assigned_to?.toString());
            await submit(formData);
        } catch (err: any) {
            toast("Failed", {
                description: "Something went wrong. Please try again later",
            });
        }
    };

    const isLoading = Object.values(queries).some((query) => query.isLoading);

    return {
        form,
        isLoading,
        onSubmit,
        isPending,
        ...queries,
        formFilled,
        modifiedAssignees: transformedData.assignees,
        open, setOpen
    };
};

export default useUpdateAssignInventory;
