"use client"

import { useFieldArray, useFormContext } from "react-hook-form";

export function useUnitsConfig() {
    const {
        control,
        register,
        formState: { errors },
    } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "units",
        keyName: "id",
    });

    return {
        control,
        fields,
        register,
        remove,
        append,
        errors,
    };
}
