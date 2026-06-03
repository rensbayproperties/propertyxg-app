"use client";
import useAxiosAuth from "./useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { customFieldSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useEffect } from "react";

type FormData = z.infer<typeof customFieldSchema>;

const useCustomFieldSetup = ({
  type,
  id,
}: {
  type: "LEAD" | "LISTING";
  id: String;
}) => {
  const axiosAuth = useAxiosAuth();
  const form = useForm<FormData>({
    resolver: zodResolver(customFieldSchema),
    defaultValues: {
      section: "BASIC_INFO",
      label: "",
      input_type: undefined,
      placeholder: "",
      options: [{ option: "" }],
      required: false,
    },
  });

  const queryClient = useQueryClient();

  const inputTypes = Object.freeze({
    TEXTBOX: "Textbox",
    TEXTAREA: "Textarea",
    MULTI_CHOICE: "Multi choice",
    SINGLE_CHOICE: "Single choice",
    COUNTRY: "Country",
    LANGUAGE: "Language",
  });

  const inputTypeOptions = Object.entries(inputTypes).map((opt) => {
    return { label: opt[1], value: opt[0] };
  });

  const sections = Object.freeze({
    BASIC_INFO: "Basic Information",
    EXTRA_INFO: "Extra Information",
  });

  const sectionOptions = Object.entries(sections).map((opt) => {
    return { label: opt[1], value: opt[0] };
  });

  const input_type = useWatch({ control: form.control, name: "input_type" });
  const showOptions = ["MULTI_CHOICE", "SINGLE_CHOICE"].includes(input_type);

  const { isLoading: isLoadingSettings, data } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get(`/custom-settings?type=${type}`);
      return response?.data?.data;
    },
    queryKey: ["cutom-settings", type],
  });

  const { isLoading: isLoadingSetting, data: customSetting } = useQuery({
    queryFn: async () => {
      const response = await axiosAuth.get(
        `/custom-settings?type=${type}&id=${id}`,
      );
      return response?.data?.data;
    },
    queryKey: ["cutom-setting", type, id],
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => {
      return axiosAuth.post(`/custom-settings`, { ...credentials, type });
    },
    onSuccess: (response: any) => {
      if (response?.data?.success === true) {
        toast("Success", {
          description:
            response?.data?.message || `Custom field created succesfully`,
        });
        form.reset();
      } else {
        toast("Error", {
          description: response?.data?.message || `An error occured`,
        });
      }
    },
  });

  const { mutateAsync: submitUpdate, isPending: isPendingUpdate } = useMutation({
    mutationFn: (credentials: any) => {
      return axiosAuth.patch(`/custom-settings?type=${type}&id=${id}`, { ...credentials });
    },
    onSuccess: (response: any) => {
      if (response?.data?.success === true) {
        toast("Success", {
          description:
            response?.data?.message || `Custom field updated succesfully`,
        });
        queryClient.invalidateQueries({ queryKey: ["cutom-setting"] });;
      } else {
        toast("Error", {
          description: response?.data?.message || `An error occured`,
        });
      }
    },
  });

    const { mutateAsync: submitDelete, isPending: isPendingDelete } = useMutation(
      {
        mutationFn: () => {
          return axiosAuth.delete(`/custom-settings?type=${type}&id=${id}`);
        },
        onSuccess: (response: any) => {
          if (response?.data?.success === true) {
            toast("Success", {
              description:
                response?.data?.message || `Custom field deleted succesfully`,
            });
            queryClient.invalidateQueries({ queryKey: ["cutom-settings"] });
          } else {
            toast("Error", {
              description: response?.data?.message || `An error occured`,
            });
          }
        },
      },
    );

  useEffect(() => {
    if (customSetting) {
      form.reset({
        section: customSetting.section ?? "BASIC_INFO",
        label: customSetting.label ?? "",
        input_type: customSetting.inputType ?? undefined,
        placeholder: customSetting.placeholder ?? "",
        options:
      customSetting.options?.map((opt: any) => ({
        option: opt.value, // 👈 match your form structure
      })) || [{ option: "" }],
        required: customSetting.required ?? false,
      });
    }
  }, [customSetting, form.reset]);

  const onSubmit = async (values: FormData) => {
    try {
      await submit(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const onSubmitUpdate = async (values: FormData) => {
    try {
      await submitUpdate(values);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  return {
    onSubmit,
    onSubmitUpdate,
    isPendingUpdate,
    form,
    isPending,
    inputTypeOptions, 
    showOptions,
    sectionOptions,
    data,
    isLoadingSettings,
    submitDelete,
    isPendingDelete
  };
};

export default useCustomFieldSetup;
