"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";
import { axiosAuth } from "@/lib/api";

const useAxiosAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();
  const token = session?.tokens?.access_token

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config: any) => {
        if (!config.headers["Authorization"]) {
          console.log("🔑 Adding token to request:", token ? "Token present" : "No token");
          console.log("🔍 Session data:", session);
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        console.log("🚨 API Error:", error?.response?.status, error?.response?.data);
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          console.log("🔄 Attempting token refresh...");
          prevRequest.sent = true;
          try {
            const newAccessToken = await refreshToken();
            console.log("✅ Token refreshed successfully");
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken?.access_token}`;
            return axiosAuth(prevRequest);
          } catch (refreshError) {
            console.error("❌ Token refresh failed:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosAuth;
};

export default useAxiosAuth;
