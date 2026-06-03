// import { userSchema } from "@/schemas/user";
import { useForm } from "react-hook-form";
import { FetchError, trapError } from "@/lib/fetch-json";
import { yupResolver } from "@hookform/resolvers/yup";
// import toast from "@/components/Toast";
// import { signIn } from "next-auth/react";
import { useState } from "react";

function useLogin() {
  const [status, setStatus] = useState("idle");
  const methods = useForm({
    resolver: yupResolver({}),
  });

  async function handleSubmit(formData) {
    return await tryPost(formData);
  }

  async function tryPost(data) {
    setStatus("pending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.status === 200) {
        methods.reset();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      if (error instanceof FetchError) {
        // toast({ type: "error", message: error.data.message });
      } else {
        trapError(error);
      }
    }
  }

  return {
    status,
    methods,
    handleSubmit: methods.handleSubmit(handleSubmit),
  };
}

export default useLogin;
