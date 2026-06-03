"use client"

import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export function useDNCRConfig() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "numbers",
    keyName: "id",
  });

    // Ensure there's at least one field on mount
    useEffect(() => {
        if (fields.length === 0) {
            append(""); // Add an empty field when the form initializes
        }
    }, [fields, append]);

  return {
    control,
    fields,
    register,
    remove,
    append,
    errors,
  };
}
