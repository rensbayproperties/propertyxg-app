"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { EditTeamMembersSchema } from "@/lib/schemas";
import React, { useState } from "react";
import { toast } from "sonner";

export default function UseTeamMemberEdit() {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string; // get team member ID from URL
  // const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const { isLoading: isLoadingRoles, data: roles } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/roles");
      const results = response.data.data;

      const modifiedRoles = results.map((role: any) => ({
        value: role.id,
        label: role.name,
      }));
      return modifiedRoles;
    },
    queryKey: ["roles"],
  });

  const { data: teamMember, isLoading } = useQuery({
    queryKey: ["teamMember", id],
    queryFn: async () => {
      const res = await axiosAuth.get(`/users/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  const handleDelete = () => {
    // console.log("Deleting members:", selectedMembers);
    // // perform delete logic here (API call etc.)
    // setSelectedMembers([]); // reset selection after delete
  };

  const form = useForm<z.infer<typeof EditTeamMembersSchema>>({
    resolver: zodResolver(EditTeamMembersSchema),
    defaultValues: {
      email: "",
      role: "",
    },
  });

  //  reset form to match team-member details
  React.useEffect(() => {
    if (teamMember) {
      form.reset({
        email: teamMember.email || "",
        role: teamMember.role?.id || "",
      });
    }
    console.log(teamMember);
  }, [teamMember]);

  // Edit team member details
  const { mutate: updateMember, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await axiosAuth.patch(`/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Team member updated successfully!");
      setTimeout(() => router.push("/team"), 1000);
    },
    onError: (error) => {
      console.error("Error updating team member:", error);
    },
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      email: data.email,
      roleId: typeof data.role === "object" ? data.role.id : data.role, // only send ID
    };

    updateMember(formattedData);
  };

  return {
    form,
    onSubmit,
    isPending,
    roles,
    isLoading,
    teamMember,
    handleDelete,
  };
}
