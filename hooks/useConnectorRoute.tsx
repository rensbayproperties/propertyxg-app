"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { parseAsInteger, useQueryState } from "nuqs";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof ConnectorRouteSchema>;
export const ConnectorRouteSchema = z.object({
  connector_type: z.enum(["DNCR", "LISTING_BAYUT", "LISTING_PROPERTYFINDER"]),
});

const useConnectorRoute = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();


  const form = useForm<FormData>({
    resolver: zodResolver(ConnectorRouteSchema),
    defaultValues: {
      connector_type: undefined,
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: async (credentials: FormData) => {
      console.log("cred", credentials)

      if ( credentials.connector_type === "DNCR") {
        router.push("/dncr/connector");
      } if (credentials.connector_type === "LISTING_BAYUT") {
        // router.push("/dncr/connector");
        
      } else {
        // router.push("/dncr/connector");
      }{

      }
    },
    onSuccess: (res) => {
    },
  });

  const onSubmit = async (values: z.infer<typeof ConnectorRouteSchema>) => {
    try {
      await submit(values as any);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };


  return {
    onSubmit,
    form,
    isPending,
    open,
    setOpen,
  };
};

export default useConnectorRoute;
