"use client";

import { chargeSchema } from "@/lib/schemas";
import { ChargeColumns } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import useAxiosAuth from "./useAxiosAuth";

type ChargeFormData = z.infer<typeof chargeSchema>;

const getChargeCollection = (payload: any): ChargeColumns[] => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.charges)) return payload.charges;
  if (Array.isArray(payload?.charge)) return payload.charge;
  if (Array.isArray(payload?.list)) return payload.list;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getTotal = (payload: any, fallback: number) => {
  return (
    payload?.total ??
    payload?.pagination?.totalItems ??
    payload?.meta?.total ??
    fallback
  );
};

const useCharge = () => {
  const router = useRouter();
  const axiosAuth = useAxiosAuth();
  const queryClient = useQueryClient();

  const form = useForm<ChargeFormData>({
    resolver: zodResolver(chargeSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "RECURRING",
    },
  });

  const [currentPage, setCurrentPage] = useQueryState(
    "page",
    parseAsInteger.withOptions({ shallow: false }).withDefault(1)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withOptions({ shallow: false, history: "push" }).withDefault(10)
  );

  const { data: chargeResponse, isLoading: gettingCharges } = useQuery({
    queryKey: ["charges", { currentPage, pageSize }],
    queryFn: async () => {
      const res = await axiosAuth.get(`/charge?limit=${pageSize}&page=${currentPage}`);
      const payload = res.data?.data ?? res.data;
      const charges = getChargeCollection(payload);
      return {
        data: charges,
        total: getTotal(payload, charges.length),
      };
    },
  });

  const { mutateAsync: createCharge, isPending: isCreatingCharge } = useMutation({
    mutationFn: (values: ChargeFormData) => axiosAuth.post("/charge", values),
    onSuccess: () => {
      toast("Success", { description: "Charge created successfully." });
      queryClient.invalidateQueries({ queryKey: ["charges"] });
      router.push("/charges");
    },
  });

  const { mutateAsync: deleteCharge, isPending: isDeletingCharge } = useMutation({
    mutationFn: (id: string) => axiosAuth.delete(`/charge/${id}`),
    onSuccess: () => {
      toast("Success", { description: "Charge deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
  });

  const { mutateAsync: updateCharge, isPending: isUpdatingCharge } = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: ChargeFormData;
    }) => axiosAuth.patch(`/charge/${id}`, values),
    onSuccess: () => {
      toast("Success", { description: "Charge updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["charges"] });
    },
  });

  const getChargeById = async (id: string) => {
    const res = await axiosAuth.get(`/charge/${id}`);
    return res.data?.data ?? res.data;
  };

  const onSubmit = async (values: ChargeFormData) => {
    try {
      await createCharge(values);
    } catch (error) {
      toast("Failed", {
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  return {
    form,
    onSubmit,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    charges: chargeResponse,
    gettingCharges,
    deleteCharge,
    isDeletingCharge,
    updateCharge,
    isUpdatingCharge,
    getChargeById,
    isCreatingCharge,
  };
};

export default useCharge;
