"use client";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RoleData } from "@/types";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Role Title must be at least 2 characters.",
  }),
  features: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Please select at least one feature.",
  }),
});

export type RoleFormValues = z.infer<typeof formSchema>;

// Initialize all role settings to 0
const getDefaultRoleSettings = (): { [key: string]: number } => ({
  role_tickets: 0,
  role_all_tickets: 0,
  role_assigned_tickets: 0,
  role_add_ticket: 0,
  role_receive_leads: 0,
  role_add_leads: 0,
  role_manage_leads: 0,
  role_add_inventories: 0,
  role_manage_inventories: 0,
  role_manage_approvals: 0,
  role_add_roles: 0,
  role_manage_roles: 0,
  role_invite_users: 0,
  role_manage_users: 0,
  role_is_agent: 0,
  role_can_view_leads_confidential: 0,
  role_can_view_list_confidential: 0,
  role_add_locations: 0,
  role_manage_locations: 0,
  role_manage_properties: 0,
  role_manage_rent: 0,
  role_manage_tenants: 0,
  role_add_landing: 0,
  role_manage_landing: 0,
  role_manage_contacts: 0,
  role_all_leads: 0,
  role_all_inventories: 0,
  role_add_dxb_project: 0,
  role_manage_dxb_projects: 0,
  role_manage_referral_leads: 0,
  role_dncr: 0,
});

type RoleApiPayload = {
  name: string;
  description: string;
  roleType: string;
  role_super_admin: boolean;
  role_is_agent: boolean;
  role_receive_leads: boolean;
  role_add_leads: boolean;
  role_manage_leads: boolean;
  role_all_leads: boolean;
  role_add_ticket: boolean;
  role_manage_tickets: boolean;
  role_all_tickets: boolean;
  role_add_contact: boolean;
  role_manage_contacts: boolean;
  role_manage_properties: boolean;
  role_manage_users: boolean;
};

const buildRoleApiPayload = (values: RoleFormValues): RoleApiPayload => {
  const selected = new Set(values.features);

  const hasTicketManagement =
    selected.has("role_tickets") ||
    selected.has("role_assigned_tickets") ||
    selected.has("role_all_tickets");

  return {
    name: values.title,
    description: `${values.title} role`,
    roleType: "TEAM",
    role_super_admin: false,
    role_is_agent: selected.has("role_is_agent"),
    role_receive_leads: selected.has("role_receive_leads"),
    role_add_leads: selected.has("role_add_leads"),
    role_manage_leads: selected.has("role_manage_leads"),
    role_all_leads: selected.has("role_all_leads"),
    role_add_ticket: selected.has("role_add_ticket"),
    role_manage_tickets: hasTicketManagement,
    role_all_tickets: selected.has("role_all_tickets"),
    role_add_contact: selected.has("role_manage_contacts"),
    role_manage_contacts: selected.has("role_manage_contacts"),
    role_manage_properties: selected.has("role_manage_properties"),
    role_manage_users: selected.has("role_manage_users"),
  };
};

const useRole = () => {
  const axiosAuth = useAxiosAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const queryClient = useQueryClient();

  // Initialize form with react-hook-form
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      features: [],
    },
  });

  // Fetch all roles
  const { isLoading, data: rolesData, refetch } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get("/roles");
      return response.data;
    },
    queryKey: ["roles"],
  });

  const roles = rolesData?.data || [];

  // Create role mutation
  const { mutateAsync: createRole, isPending } = useMutation({
    mutationFn: async (credentials: RoleApiPayload) => {
      const response = await axiosAuth.post("/roles", { ...credentials, roleType: "ADMIN" });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Success", { description: "Role created successfully." });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Role creation error:", error);
      toast.error("Error", {
        description: error?.response?.data?.message || "Failed to create role.",
      });
    },
  });

  // Update role mutation
  const { mutateAsync: updateRole, isPending: isPendingUpdate } = useMutation({
    mutationFn: async ({ credentials, roleId }: { credentials: RoleApiPayload; roleId: number }) => {
      const response = await axiosAuth.put(`/roles/${roleId}`, credentials);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Success", { description: "Role updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setOpenEdit(false);
      setSelectedRole(null);
      form.reset();
    },
    onError: (error: any) => {
      console.error("Role update error:", error);
      toast.error("Error", {
        description: error?.response?.data?.message || "Failed to update role.",
      });
    },
  });

  // Delete role mutation
  const { mutateAsync: deleteRole, isPending: isPendingDelete } = useMutation({
    mutationFn: async (roleId: number) => {
      const response = await axiosAuth.delete(`/roles/${roleId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Success", { description: "Role deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (error: any) => {
      console.error("Role deletion error:", error);
      toast.error("Error", {
        description: error?.response?.data?.message || "Failed to delete role.",
      });
    },
  });

  // Handle form submission for creating a role
  const handleSubmit = useCallback(async (values: RoleFormValues) => {
    const modifiedValues = buildRoleApiPayload(values);

    await createRole(modifiedValues);
  }, [createRole]);

  // Handle form submission for updating a role
  const handleUpdate = useCallback((roleId: number) => async (values: RoleFormValues) => {
    const modifiedValues = buildRoleApiPayload(values);

    await updateRole({ credentials: modifiedValues, roleId });
  }, [updateRole]);

  // Open edit dialog and populate form with existing data
  const handleOpenEdit = useCallback((data: RoleData) => {
    setSelectedRole(data);
    setOpenEdit(true);

    // Reset form first
    form.reset();

    // Set the title
    form.setValue("title", data.name);

    // Find which features are enabled (value === 1)
    const enabledFeatures: string[] = [];
    const roleKeys = Object.keys(getDefaultRoleSettings());

    for (const key of roleKeys) {
      if ((data as any)[key] === 1) {
        enabledFeatures.push(key);
      }
    }

    form.setValue("features", enabledFeatures);
  }, [form]);

  // Handle delete role
  const handleDelete = useCallback(async (roleId: number) => {
    await deleteRole(roleId);
  }, [deleteRole]);

  // Close edit dialog
  const handleCloseEdit = useCallback(() => {
    setOpenEdit(false);
    setSelectedRole(null);
    form.reset();
  }, [form]);

  // Close create dialog
  const handleCloseCreate = useCallback(() => {
    setOpen(false);
    form.reset();
  }, [form]);

  return {
    form,
    handleSubmit,
    roles,
    isLoading,
    isPending,
    setOpen,
    open,
    handleOpenEdit,
    isPendingUpdate,
    openEdit,
    handleUpdate,
    setOpenEdit,
    selectedRole,
    handleDelete,
    isPendingDelete,
    handleCloseEdit,
    handleCloseCreate,
    refetch,
  };
};

export default useRole;
