"use client";

import { useState, useEffect } from "react";
import { useController, Control } from "react-hook-form";
import PhoneInputLib, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
  control: Control<any>;
  name: string;
  defaultCountry?: Country;
  placeholder?: string;
}

export function PhoneInput({ control, name, defaultCountry = "AE", placeholder }: PhoneInputProps) {
  const {
    field: { value, onChange },
  } = useController({ control, name });

  return (
    <PhoneInputLib
      international
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange}
      placeholder={placeholder || "Enter phone number"}
      className="w-full border rounded-md p-2 bg-input"
    />
  );
}

