"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const useCompanyProfile = () => {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const { data: session }: { data: any } = useSession();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [formFilled, setFormFilled] = useState(false);
  const [availableLanguages, setAvailableLanguages] = useState<
    { value: string; label: string }[]
  >([]);

  const formSchema = z.object({
    name: z.string().min(2, {
      message: " Name must be at least 2 characters.",
    }),
    username: z.string().min(2, {
      message: "Slug must be at least 2 characters.",
    }),
    phone: z.string({ message: "Please enter phone number." }),
    telegramUsername: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    about: z.string().optional(),
    rera_registration: z.string().optional(),
    property_types: z.string().optional(),
    service_areas: z.string().optional(),
    address: z.string().optional(),
    // image: z
    //   .instanceof(File)
    //   .refine((file) => file.size !== 0, "Please upload an image"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      phone: "",
      telegramUsername: "",
      whatsapp: "",
      about:"",
      rera_registration:"",
      property_types:"",
      service_areas:"",
      email: "",
      address:""
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.patch("/company/profile", credentials),
    onSuccess: () => {
      toast("Success", { description: "Profile updated successfully." });
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("pro2", values);
    try {
      const formData = new FormData();
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const fetchData = async (endpoint: string) => {
    const response = await axiosAuth.get(endpoint);
    return response.data;
  };

  const { data: profile, isLoading: gettingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => fetchData(`/company/profile`),
  });

  // Fetch All Languages
  const { data: languagesData, isLoading: loadingLanguages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => fetchData("/leads/language/all"),
  });

  useEffect(() => {
    if (
      languagesData?.status === "success" &&
      languagesData?.data?.customfields_datapayload
    ) {
      try {
        // Parse the JSON string into an array
        const languagesArray: string[] = JSON.parse(
          languagesData.data.customfields_datapayload,
        );

        // Transform into the format needed for the select component
        const formattedLanguages = languagesArray.map((lang) => ({
          value: lang.toLowerCase(),
          label: lang,
        }));

        setAvailableLanguages(formattedLanguages);
      } catch (error) {
        console.error("Error parsing languages:", error);
        toast("Warning", {
          description: "Could not load languages. Please try again later.",
        });
      }
    }
  }, [languagesData]);

  useEffect(() => {
    if (profile) {
      if (profile?.success === true) {
        console.log("pro", profile);
        form.reset({
          name: profile?.data?.name || "",
          username: profile?.data?.username || "",
          email: profile?.data?.email || "",
          phone: profile?.data?.phone || "",
          whatsapp: profile?.data?.whatsapp || "",
          telegramUsername: profile?.data?.telegramUsername || "",
          about: profile?.data?.about || "",
          rera_registration: profile?.data?.rera_registration || "",
          service_areas: profile?.data?.service_areas || "",
          property_types: profile?.data?.property_types || "",
          address: profile?.data?.address || "",
        });
        setFormFilled(true);
      }
    }
  }, [profile, form.reset]);

  return {
    form,
    onSubmit,
    preview,
    isPending,
    formFilled,
    availableLanguages,
    loadingLanguages,
    profile,
    gettingProfile,
  };
};

export default useCompanyProfile;
function setFormFilled(arg0: boolean) {
  throw new Error("Function not implemented.");
}
