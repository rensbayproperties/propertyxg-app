"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { z } from "zod";
import { toast } from "sonner";
import useAxiosAuth from "./useAxiosAuth";
import { useRouter } from "next/navigation";

const createMediaSchema = z.object({
    caption: z.string().optional(),
    images: z.array(z.any()).min(1, "Please select at least one image"),
});

type CreateMediaFormData = z.infer<typeof createMediaSchema>;

const useCreateMedia = () => {
    const axiosAuth = useAxiosAuth();
    const router = useRouter();
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const form = useForm<CreateMediaFormData>({
        resolver: zodResolver(createMediaSchema),
        defaultValues: {
            caption: "",
            images: [],
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);

        const currentImages = form.getValues("images");
        form.setValue("images", [...currentImages, ...acceptedFiles]);
    }, [form]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: true,
    });

    const removeImage = useCallback((index: number) => {
        setImagePreviews(prev => {
            const newPreviews = [...prev];
            URL.revokeObjectURL(newPreviews[index]);
            newPreviews.splice(index, 1);
            return newPreviews;
        });

        const currentImages = form.getValues("images");
        const newImages = [...currentImages];
        newImages.splice(index, 1);
        form.setValue("images", newImages);
    }, [form]);

    const { mutateAsync: uploadMedia, isPending } = useMutation({
        mutationFn: async (data: CreateMediaFormData) => {
            const formData = new FormData();

            if (data.caption) {
                formData.append('caption', data.caption);
            }

            data.images.forEach((file, index) => {
                formData.append(`files`, file);
            });

            const response = await axiosAuth.post('/media/upload/multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: (response) => {
            toast.success("Media uploaded successfully!");
            form.reset();
            setImagePreviews([]);
            router.push('/media-library');
        },
        onError: (error: any) => {
            console.error("Upload failed:", error);
            toast.error("Upload Failed", {
                description: error?.response?.data?.message || "Could not upload media. Please try again.",
            });
        },
    });

    const onSubmit = async (data: CreateMediaFormData) => {
        try {
            await uploadMedia(data);
        } catch (error) {
            console.error("Submit error:", error);
        }
    };

    return {
        form,
        onSubmit,
        isPending,
        getRootProps,
        getInputProps,
        isDragActive,
        imagePreviews,
        removeImage,
    };
};

export default useCreateMedia;
