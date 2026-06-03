"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import { useRouter } from "next/navigation";
import { dxbProjectSchema } from "@/lib/schemas";

type DxbProjectFormData = z.infer<typeof dxbProjectSchema>;

const useCreateDxbProject = (projectId?: string) => {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const isEditMode = !!projectId;

    const form = useForm<DxbProjectFormData>({
        resolver: zodResolver(dxbProjectSchema),
        defaultValues: {
            project_number: 0,
            project_name: "",
            project_name_en: "",
            developer_id: 0,
            developer_name: "",
            developer_name_en: "",
            master_developer_id: 0,
            master_developer_name: "",
            project_status: "ACTIVE",
            percent_completed: 0,
            project_description_en: "",
            project_description_ar: "",
            area_name_en: "",
            master_project_en: "",
            zoning_authority_en: "",
            no_of_lands: 0,
            no_of_buildings: 0,
            no_of_villas: 0,
            no_of_units: 0,
            images: [],
            status: "ACTIVE",
        },
    });

    // Fetch project data if editing
    const { data: projectData, isLoading: isLoadingProject } = useQuery({
        queryKey: ['dxb-project', projectId],
        queryFn: async () => {
            if (!projectId) return null;
            const response = await axiosAuth.get(`/dxb-projects/${projectId}`);
            return response?.data?.data;
        },
        enabled: isEditMode,
    });

    useEffect(() => {
        if (projectData && isEditMode) {
            Object.keys(projectData).forEach((key) => {
                if (key in form.getValues()) {
                    const typedKey = key as keyof DxbProjectFormData;
                    const value = projectData[typedKey] as DxbProjectFormData[typeof typedKey];
                    if (value !== undefined) {
                        form.setValue(typedKey, value);
                    }
                }
            });
        }
    }, [projectData, isEditMode, form]);

    const { mutateAsync: createProject, isPending: isCreating } = useMutation({
        mutationFn: async (data: DxbProjectFormData) => {
            const formData = new FormData();

            // Append all text fields
            Object.keys(data).forEach((key) => {
                const typedKey = key as keyof DxbProjectFormData;
                if (typedKey !== 'images' && data[typedKey] !== undefined) {
                    formData.append(key, String(data[typedKey] as DxbProjectFormData[typeof typedKey]));
                }
            });

            // Append images if present
            if (data.images && data.images.length > 0) {
                data.images.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('images', file);
                    }
                });
            }

            const response = await axiosAuth.post('/dxb-projects', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Project created successfully!");
            router.push('/dxb-projects');
        },
        onError: (error: any) => {
            console.error("Creation failed:", error);
            toast.error("Failed to create project", {
                description: error?.response?.data?.message || "Something went wrong. Please try again.",
            });
        },
    });

    const { mutateAsync: updateProject, isPending: isUpdating } = useMutation({
        mutationFn: async (data: DxbProjectFormData) => {
            const formData = new FormData();

            // Append all text fields
            Object.keys(data).forEach((key) => {
                const typedKey = key as keyof DxbProjectFormData;
                if (typedKey !== 'images' && data[typedKey] !== undefined) {
                    formData.append(key, String(data[typedKey] as DxbProjectFormData[typeof typedKey]));
                }
            });

            // Append images if present
            if (data.images && data.images.length > 0) {
                data.images.forEach((file: any) => {
                    if (file instanceof File) {
                        formData.append('images', file);
                    }
                });
            }

            const response = await axiosAuth.put(`/dxb-projects/${projectId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (data) => {
            toast.success("Project updated successfully!");
            router.push('/dxb-projects');
        },
        onError: (error: any) => {
            console.error("Update failed:", error);
            toast.error("Failed to update project", {
                description: error?.response?.data?.message || "Something went wrong. Please try again.",
            });
        },
    });

    const onSubmit = async (data: DxbProjectFormData) => {
        if (isEditMode) {
            await updateProject(data);
        } else {
            await createProject(data);
        }
    };

    return {
        form,
        onSubmit,
        isPending: isCreating || isUpdating,
        isLoadingProject,
        isEditMode,
    };
};

export default useCreateDxbProject;

