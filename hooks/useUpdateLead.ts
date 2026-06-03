"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { leadSchema, teamMemberSchema } from "@/lib/schemas";

type TeamMember = z.infer<typeof teamMemberSchema>;
type FormData = z.infer<typeof leadSchema>;

const useUpdateLead = (id: string) => {
    const queryClient = useQueryClient();
    const [formFilled, setFormFilled] = useState(false);
    const router = useRouter();
    const axiosAuth = useAxiosAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(leadSchema),
        defaultValues: {
            title: "",
            full_name: "",
            email: "",
            phone: "",
            lead_status: undefined,
            source: undefined,
            options: [],
            assigned_to: [],
        },
    });

    const { mutateAsync: submit, isPending } = useMutation({
        mutationFn: (credentials: any) =>
            axiosAuth.patch(`/leads/${id}`, credentials, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
        onSuccess: (res) => {
            if (res?.data?.success) {
                toast("Success", { description: "Lead updated successfully." });
                queryClient.invalidateQueries({ queryKey: ["leads"] });
            }
        },
    });

    const fetchData = async (endpoint: string) => {
        const response = await axiosAuth.get(endpoint);
        return response.data.data;
    };

    const { data: customFields, isLoading: gettingCustomFields } = useQuery({
        queryKey: ["custom-fields", "lead"],
        queryFn: async () => fetchData("/custom-settings?type=LEAD&section=BASIC_INFO"),
    });

    const { data: customFieldsExtra, isLoading: gettingCustomFieldsExtra } = useQuery({
        queryKey: ["custom-fields", "lead", "extra"],
        queryFn: async () => fetchData("/custom-settings?type=LEAD&section=EXTRA_INFO"),
    });

    // const { data: status, isLoading: gettingStatus } = useQuery({
    //   queryKey: ["status"],
    //   queryFn: async () => fetchData("/leads/status/all"),
    // });

    const status = [
        "NEW",
        "HOT",
        "WARM",
        "COLD",
        "CONTACTED",
        "FOLLOW_UP",
        "INTERESTED",
        "QUALIFIED",
        "NOT_QUALIFIED",
        "VIEWING_SCHEDULED",
        "VIEWED",
        "OFFER_MADE",
        "NEGOTIATION",
        "BOOKED",
        "CLOSED_WON",
        "CLOSED_LOST",
        "UNRESPONSIVE",
        "DUPLICATE"
    ].map((status) => ({ id: status, title: status }));
    const gettingStatus = false


    const { data: lead, isLoading: gettingLead } = useQuery({
        queryKey: [`leads`, id],
        queryFn: async () => fetchData(`/leads/${id}`),
    });

    useEffect(() => {
        if (lead) {
            // const leadsAssigned = lead?.leads_assigned_active && lead.leads_assigned_active?.map(
            //     (item: any) => item.user.id
            // ) || [];

            form.reset({
                title: lead.title || "",
                full_name: lead.full_name || "",
                email: lead.email || "",
                phone: lead.phone || "",
                lead_status: lead.lead_status || undefined,
                source: lead.source || undefined,
                options: [],
            });
            setFormFilled(true)
        }
    }, [lead, form.reset]);

    const onSubmit = async (values: FormData) => {
        try {
            const formData = new FormData();
            formData.append("title", values.full_name);
            formData.append("full_name", values.full_name);
            formData.append("email", values.email || "");
            formData.append("phone", values.phone || "");
            formData.append("lead_status", values.lead_status || "");
            formData.append("source", values.source || "");
            formData.append("assigned_to", JSON.stringify(values.assigned_to || []));

            await submit(formData);
        } catch (err: any) {
            toast("Failed", {
                description: "Something went wrong. Please try again later",
            });
        }
    };

    const isLoading = gettingStatus


    const {
        isLoading: isLoadingTeams,
        data: teammembers,
        isError,
    } = useQuery<TeamMember[]>({
        queryKey: ["team-members"],
        queryFn: async () => {
            const response = await axiosAuth.get("/users/team-members");
            const data = response.data?.data;
            return data;
        },
    });

    const modifiedAssignees = Array.isArray(teammembers) ? teammembers?.filter((member) => member?.name != '').map((assignee: any) => ({
        label: `${assignee?.name}`,
        value: assignee?.id,
    })) : [];

    return {
        onSubmit,
        form,
        status,
        isPending,
        isLoading,
        gettingCustomFields,
        customFields,
        customFieldsExtra,
        gettingCustomFieldsExtra,
        modifiedAssignees,
        formFilled
    };
};

export default useUpdateLead;
