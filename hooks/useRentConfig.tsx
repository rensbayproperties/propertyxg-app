"use client";

import { useFieldArray, useFormContext } from "react-hook-form";

export function useRentConfig() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "charges",
    keyName: "key",
  });

  return {
    control,
    fields,
    append,
    remove,
    errors,
  };
}
