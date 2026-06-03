"use client";
import { useSession } from "next-auth/react";

export const HeaderSettings = () => {
  const { data: session }: { data: any } = useSession();
  const headerSettings = {
    headers: {
      Authorization: `Bearer ${session?.user?.access_token}`,
    },
  };
  return { headerSettings, session };
};
