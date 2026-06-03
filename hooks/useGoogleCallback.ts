"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FetchError } from "@/lib/FetchError";


const useGoogleCallback = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    const login = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/auth/session");
            const session = await res.json();
            // logged in
            if (session?.user?.id) {
                const subdomain = session?.user?.company?.username;
                if (subdomain) {
                    window.location.href = `http://${subdomain}.${process.env.NEXT_PUBLIC_AUTH_URL}/home`;
                } else {
                    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/company-setup`;
                }
            }
        } catch (error) {
            if (error instanceof FetchError) {
                // toast({ type: "error", message: error.data.message });
            } else {
                // trapError(error);
            }
        }

        setIsLoading(false);
    };
    return {
        login
    };
};

export default useGoogleCallback;
