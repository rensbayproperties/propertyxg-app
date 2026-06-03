"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

interface VerifyTokenResult {
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
}

const useVerifyToken = (token: string | null): VerifyTokenResult => {
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsValid(false);
        setIsLoading(false);
        setError("No token provided");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post('/user-invites/validate', {
          token,
        });

        if (response.data) {
          setIsValid(true);
          setError(null);
        }
      } catch (error: any) {
        console.error("Token verification error:", error);
        const errorMessage = error?.response?.data?.message || "Invalid or expired token";
        setError(errorMessage);
        setIsValid(false);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return {
    isValid,
    isLoading,
    error,
  };
};

export default useVerifyToken;

