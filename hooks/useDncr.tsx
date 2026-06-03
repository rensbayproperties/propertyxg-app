"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAuth from "./useAxiosAuth";
import { parseAsInteger, useQueryState } from "nuqs";
import { dncrSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof dncrSchema>;
const useDncr = () => {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState([]);
  const [errors, setErrors] = useState([]);
  const [initialPageLoad, setInitialPageLoad] = useState(true);

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
    resolver: zodResolver(dncrSchema),
    defaultValues: {
      connector_type: "DNCR",
      numbers: [""],
    },
  });

  const { mutateAsync: submit, isPending } = useMutation({
    mutationFn: async (credentials: FormData) => {
      const res = await axiosAuth.post("/dncr/search", credentials);
      return res;
    },
    onSuccess: (res) => {
      if (res?.data?.success === true) {
        setErrors([]);
        setDetails(res?.data?.data);
        console.log("the res", res?.data?.data )
        toast("Success", {
          description: "Check successful.",
        });
        setOpen(true);
        form.reset();
      } if (res?.data?.success === false) {
        toast.error(res?.data?.message);
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

  const onSubmit = async (values: z.infer<typeof dncrSchema>) => {
    try {
      await submit(values as any);
    } catch (err: any) {
      toast("Failed", {
        description: "Something went wrong. Please try again later",
      });
    }
  };

  const { data: dncrList, isLoading: isLoadingList } = useQuery({
    queryKey: ["dncr-list", { pageSize, currentPage }],
    queryFn: async () => {
      const res = await axiosAuth.get(
        `/dncr/history?limit=${pageSize}&page=${currentPage}`
      );
      console.log("all dncr", res.data?.data)
      return res.data?.data;
    },
  });


  const { mutateAsync: dncrValidate } = useMutation({
    mutationFn: (value: string) => {
      return axiosAuth.get(`/connectors/single`, {
        params: { value },
      });
    },
    onSuccess: (res: any) => {
      if (res.data.success === true && res?.data?.data?.status === 'ACTIVE') {
        setInitialPageLoad(false);
      } else {
        toast("Failed", {
          description: "Something went wrong. Please try again later",
        });
      }
    },
  });

  useEffect(() => {
    dncrValidate("DNCR")
  }, [])

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
    dncrList,
    isLoadingList,
    initialPageLoad
  };
};

export default useDncr;
