"use client";
import { signIn } from "next-auth/react";

const useGoogleSignin = () => {
    const login = async () => {
        signIn("google", {
            callbackUrl: `/google-callback`,
        });
    };

    return {
        login
    };
};

export default useGoogleSignin;
