"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { parseAsInteger, useQueryState } from "nuqs";
import { dncrConnectorSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof dncrConnectorSchema>;
const useConnector = () => {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [errors, setErrors] = useState([]);

  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger
      .withOptions({ shallow: false, history: "push" })
      .withDefault(10)
  );

  const form = useForm<FormData>({
    resolver: zodResolver(dncrConnectorSchema),
    defaultValues: {
      connector_type: "DNCR",
      client_id: "",
      client_secret: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: async (credentials: FormData) => {
      const res = await axiosAuth.post("/connectors", credentials);
      return res;
    },
    onSuccess: (res) => {
      if (res?.data?.success === true) {
        setErrors([]);
        setDetails(res?.data?.data?.details);
        toast("Success", {
          description: "Connection successful.",
        });
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["connector-list"] });
        router.push("/settings/connectors");
        // setOpen(true);
      } else {
        if (res?.data?.data?.previously_checked) {
          setErrors(res?.data?.data?.previously_checked);
          toast("Error", {
            description: "Numbers previously checked. Please remove.",
          });
        }
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof dncrConnectorSchema>) => {
    try {
      await submit(values as any);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const { data: connectors, isLoading: isLoadingConnectors } = useQuery({
    queryKey: ["connector-list"],
    queryFn: async () => {
      const res = await axiosAuth.get(
        `connectors?limit=${pageSize}&page=${currentPage}`
      );
      return res.data?.data;
    },
  });

  const { mutateAsync: deleteConnector, isPending: isDeleting } = useMutation({
    mutationFn: ({ Id }: { Id: string }) => {
      const res = axiosAuth.delete(`/connectors/${Id}`);
      res.then((res) => {
        if (res.data.success === true) {
          queryClient.invalidateQueries({ queryKey: ["connector-list"] });
        }
      });
      return res;
    },
  });

  return {
    onSubmit,
    form,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isPending,
    open,
    setOpen,
    details,
    errors,
    connectors,
    isLoadingConnectors,
    deleteConnector,
    isDeleting,
  };
};

export default useConnector;
