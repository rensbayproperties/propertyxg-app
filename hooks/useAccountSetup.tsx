"use client";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import useAxiosAuth from "./useAxiosAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { accountsetupSchema } from "@/lib/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";

type FormData = z.infer<typeof accountsetupSchema>;
const useAccountSetup = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [validToken, setValidToken] = useState("");
  const [initialPageLoad, setInitialPageLoad] = useState(true);

  const form = useForm<FormData>({
    resolver: zodResolver(accountsetupSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: (credentials: any) => {
      return axiosAuth.post(`/user-invites/complete-signup`, credentials);
    },
    onSuccess: async (res, vars) => {
      // router.push("/signin");

      console.log("res", res?.data);
      console.log("vars", vars);

      const result = await signIn("credentials", {
        redirect: false,
        email: res?.data?.data?.email || "",
        password: vars?.password || "",
      });

      if (result?.ok) {
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
      } else {
        toast("Failed", {
          description: result?.error,
        });
      }

      toast("Success", {
        description: "Account setup was successful",
      });
    },
  });

  const { mutateAsync: verifyToken } = useMutation({
    mutationFn: () => {
      return axiosAuth.post(`/user-invites/validate`, {
        token: token,
      });
    },
    onSuccess: (res: any) => {
      if (res.data.success === true) {
        setInitialPageLoad(false);
        setValidToken(token);
      } else {
        toast("Failed", {
          description: "Something went wrong. Please try again later",
        });
        // router.push("/forgot-password");
      }
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const modifiedValues = {
        ...values,
        token: validToken,
      };
      await submit(modifiedValues);
    } catch (err: any) {
      toast("Failed", {
        description: "Error while Submitting",
      });
    }
  };

  useEffect(() => {
    if (token && initialPageLoad) {
      verifyToken();
    }
  }, [token, initialPageLoad]);

  return { onSubmit, initialPageLoad, form, isPending };
};

export default useAccountSetup;
