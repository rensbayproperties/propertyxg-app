import { axiosAuth } from "@/lib/api";
import { apiClient } from "@/lib/apiClient";
import { LocationResponse } from "@/types";

export const getLocations = async (params?: {
  parent?: string | number;
  page?: number;
  limit?: number;
  top_location?: number | string;
}): Promise<LocationResponse> => {
  try {
    // Create URLSearchParams to handle query parameters
    const queryParams = new URLSearchParams();

    if (params?.parent) {
      queryParams.append("parent", params.parent.toString());
    }

    if (params?.top_location) {
      queryParams.append("top_location", params.top_location.toString());
    }

    if (params?.page) {
      queryParams.append("page", params.page.toString());
    }

    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    // Construct the URL with query parameters
    const url = `/locations${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response: LocationResponse = await apiClient.get(url);
    return response;
  } catch (error: any) {
    throw error;
  }
};

import {} from "@/types";

// Authentication API calls

/**
 * Send password reset email to user
 * @param email - User's email address
 */
export const forgotPassword = async (email: string) => {
  const response = await axiosAuth.post(`/auth/forgot-password`, { email });
  return response.data;
};

/**
 * Verify if password reset token is valid
 * @param token - Reset token from email link
 */
export const verifyResetToken = async (token: string) => {
  const response = await axiosAuth.post(`/auth/verify-reset-token`, { token });
  return response.data;
};

/**
 * Reset user password with token
 * @param token - Reset token from email link
 * @param password - New password
 */
export const resetPassword = async (token: string, password: string) => {
  const response = await axiosAuth.post(`/auth/reset-password`, {
    token,
    password,
  });
  return response.data;
};

// export const getSample = async (
//   id: string
// ): Promise<SampleResponse> => {
//   const response: SampleResponse = await apiClient.get(
//     `api/${id}`
//   );
//   return response;
// };
