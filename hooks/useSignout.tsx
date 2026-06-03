"use client"
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const useSignout = () => {
  const router = useRouter()
  const handleSignOut = async () => {
    const result = await signOut({ redirect: false, callbackUrl: "/signin" });
    // router.push(result.url);
    router.push("/");
  };
  return { handleSignOut }
};

export default useSignout;
