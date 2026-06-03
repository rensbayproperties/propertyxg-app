"use client";
import React, { useCallback, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useAxiosAuth from "./useAxiosAuth";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { teamMemberSchema, ticketSchema } from "@/lib/schemas";

type FormData = z.infer<typeof ticketSchema>;
type TeamMember = z.infer<typeof teamMemberSchema>;

const useCreateTicket = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: "",
      message: "",
      assigned_to_role: [],
      assigned_to: [],
      priority: undefined,
      assigned_to_type: undefined,
    },
  });

  const assigned_to_type = Object.freeze({
    INDIVIDUAL: "Team Member",
    ROLE: "Department",
  });

  const sectionOptions = Object.entries(assigned_to_type).map((opt) => {
    return { label: opt[1], value: opt[0] };
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.post("/tickets", credentials),
    onSuccess: (res: any) => {
      if (res?.data?.success === true) {
        toast("Success", { description: "Ticket created successfully." });
        form.reset();
        router.push("/tickets");
      }
    },
  });

  // const fetchData = async (endpoint: string) => {
  //   const response = await axiosAuth.get(endpoint);
  //   return response.data.data.customfields_datapayload
  //     ? JSON.parse(response.data.data.customfields_datapayload)
  //     : response.data.data;
  // };

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

  const modifiedAssignees = Array.isArray(teammembers) ? teammembers?.map((assignee: any) => ({
    label: `${assignee?.name}`,
    value: assignee?.id,
  })) : [];

  const { isLoading: isLoadingRoles, data: roles } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/roles");
      const results = response.data.data;
      return results;
    },
    queryKey: ["roles"],
  });

  const modifiedRoles = roles?.map((role: any) => ({
    value: role.id,
    label: role.name,
  }));

  const onSubmit = async (values: FormData) => {
    try {
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const mode = useWatch({ control: form.control, name: "assigned_to_type" });

  const isLoading = isLoadingTeams;

  return {
    isLoadingRoles,
    roles,
    onSubmit,
    form,
    isPending,
    isLoading,
    teammembers,
    modifiedAssignees,
    modifiedRoles,
    sectionOptions,
    mode,
  };
};

export default useCreateTicket;
