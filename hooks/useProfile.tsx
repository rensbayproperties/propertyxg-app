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

const useProfile = () => {
  const axiosAuth = useAxiosAuth();
  const router = useRouter();
  const { data: session }: { data: any } = useSession();
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");
  const [formFilled, setFormFilled] = useState(false);
  // const [availableLanguages, setAvailableLanguages] = useState<
  //   { value: string; label: string }[]
  // >([]);

  const formSchema = z.object({
    first_name: z.string().min(2, {
      message: " Name must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
      message: "Slug must be at least 2 characters.",
    }),
    phone: z.string({ message: "Please enter phone number." }),
    telegramUsername: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    expertise: z.string().optional(),
    service_areas: z.string().optional(),
    agent_properties: z.string().optional(),
    brn: z.string().optional(),
    experience: z.string().optional(),
    specialties: z.string().optional(),
    language: z.array(z.string()).default([]),
    // image: z
    //   .instanceof(File)
    //   .refine((file) => file.size !== 0, "Please upload an image"),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      telegramUsername: "",
      whatsapp: "",
      expertise: "",
      service_areas: "",
      agent_properties: "",
      brn: "",
      experience: "",
      language: [],
      specialties: "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => axiosAuth.patch("/users", credentials),
    onSuccess: () => {
      toast("Success", { description: "Profile updated successfully." });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
    queryFn: async () => fetchData(`/users/me`),
  });

  // Fetch All Languages
  const { data: languagesData, isLoading: loadingLanguages } = useQuery({
    queryKey: ["languages"],
    queryFn: async () => fetchData("/leads/language/all"),
  });

  const availableLanguages = [
    { value: "arabic", label: "Arabic" },
    { value: "english", label: "English" },
    { value: "farsi", label: "Farsi" },
    { value: "french", label: "French" },
    { value: "hindi", label: "Hindi" },
    { value: "italian", label: "Italian" },
    { value: "russian", label: "Russian" },
    { value: "spanish", label: "Spanish" },
    { value: "urdu", label: "Urdu" },
    { value: "others", label: "Others" },
  ];

  // useEffect(() => {
  //   if (
  //     languagesData?.status === "success" &&
  //     languagesData?.data?.customfields_datapayload
  //   ) {
  //     try {
  //       // Parse the JSON string into an array
  //       const languagesArray: string[] = JSON.parse(
  //         languagesData.data.customfields_datapayload,
  //       );

  //       // Transform into the format needed for the select component
  //       const formattedLanguages = languagesArray.map((lang) => ({
  //         value: lang.toLowerCase(),
  //         label: lang,
  //       }));

  //       setAvailableLanguages(formattedLanguages);
  //     } catch (error) {
  //       console.error("Error parsing languages:", error);
  //       toast("Warning", {
  //         description: "Could not load languages. Please try again later.",
  //       });
  //     }
  //   }
  // }, [languagesData]);

  useEffect(() => {
    const matchedLanguages = profile?.data?.languages?.map((lang : any) => ({
  value: lang,
}))

    console.log("lang", matchedLanguages);


    if (profile) {
      if (profile?.success === true) {
        console.log("pro", profile);
        form.reset({
          first_name: profile?.data?.first_name || "",
          last_name: profile?.data?.last_name || "",
          email: profile?.data?.email || "",
          phone: profile?.data?.phone || "",
          whatsapp: profile?.data?.whatsapp || "",
          telegramUsername: profile?.data?.telegramUsername || "",
          service_areas: profile?.data?.service_areas || "",
          agent_properties: profile?.data?.agent_properties || "",
          brn: profile?.data?.brn || "",
          expertise: profile?.data?.expertise || "",
          experience: profile?.data?.experience || "",
          specialties: profile?.data?.specialties || "",
          language: matchedLanguages || [],
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

export default useProfile;
function setFormFilled(arg0: boolean) {
  throw new Error("Function not implemented.");
}
