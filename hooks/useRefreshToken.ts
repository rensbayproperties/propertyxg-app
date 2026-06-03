"use client";

import { axiosAuth } from "@/lib/api";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = session?.tokens?.refresh_token;
      const user = session?.user

      console.log("🔄 Refresh token attempt:", { 
        hasRefreshToken: !!refreshToken, 
        userId: user?.id,
        sessionExists: !!session 
      });

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const res = await axiosAuth.post("/auth/refresh-token", {
        userId: user?.id,
        refreshToken,
      });

      console.log('🔄 Refresh token response:', res?.data);
      const { access_token, refresh_token } = res?.data?.data;

      if (access_token && refresh_token && update) {
        console.log('✅ Setting new tokens in session');

        await update({
          tokens: {
            access_token,
            refresh_token,
          },
        });

        return { access_token, refresh_token };
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (error) {
      console.error("❌ Refresh token error:", error);
      throw error;
    }
  }, [session, update]);

  return refreshToken;
};
