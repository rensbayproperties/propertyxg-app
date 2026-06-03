import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";

export const useImportContacts = () => {
  const queryClient = useQueryClient();
  const axiosAuth = useAxiosAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axiosAuth.post("/contact/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    },

    onSuccess: () => {
      toast.success("Contacts imported successfully!");

      // 🔥 Automatically refresh table anywhere it’s used
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },

    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.message || "Import failed");
    },
  });
};
