import type { AxiosInstance } from "axios";

const formDataMultipartConfig = {
  transformRequest: [
    (data: unknown, headers: Record<string, unknown>) => {
      if (typeof FormData !== "undefined" && data instanceof FormData) {
        delete headers["Content-Type"];
      }
      return data;
    },
  ],
};

/** POST `/media/upload/single` — returns `data.id` from the API envelope. */
export const uploadSingleMediaFile = async (
  axiosAuth: AxiosInstance,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file, file.name);
  const response = await axiosAuth.post("/media/upload/single", formData, formDataMultipartConfig);
  const body = response?.data;
  const id = body?.data?.id;
  if (!id || typeof id !== "string") {
    throw new Error(body?.message || "Upload did not return a media id.");
  }
  return id;
};
