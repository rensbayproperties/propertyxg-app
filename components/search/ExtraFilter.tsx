"use client";
import React, { useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown, Tag } from "lucide-react";
import { Options } from "nuqs";
import { cn } from "@/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  setBaths: <Shallow>(
    value: string | ((old: string) => string | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  setBeds: <Shallow>(
    value: string | ((old: string) => string | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  baths: string;
  beds: string;
  className?: string;
}

const ExtraFilter = ({
  beds,
  baths,
  setBaths,
  setBeds,
  className
}: Props) => {
  const [isLoading, startTransition] = useTransition();
  const handleBeds = (value: string) => {
    setBeds(value, { startTransition });
  };
  const handleBaths = (value: string) => {
    setBaths(value, { startTransition });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          {/* <Tag className="mr-2 h-4 w-4" /> */}
          <span className="text-muted-foreground">Bed / Bath</span>
          <ChevronDown className="ml-5 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-96 w-[50vw] z-[99999]">
        <div className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="beds" className="mb-1">
                Beds
              </Label>
              <div>
                <BedroomBathroomSelect
                  name="property_bedroom"
                  label="Bedroom"
                  onUpdate={(value: string) => handleBeds(value)}
                  options={["studio", "0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="baths" className="mb-1">
                Baths
              </Label>
              <div>
                <BedroomBathroomSelect
                  name="property_bathroom"
                  label="Bathroom"
                  onUpdate={(value: string) => handleBaths(value)}
                  options={["0", "1", "2", "3", "4", "5", "6", "7", "8"]}
                />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const BedroomBathroomSelect = ({
  onUpdate,
  options,
}: {
  name: string;
  label: string;
  options: string[];
  onUpdate: (value: string) => void;
}) => {
  const [val, setVal] = useState("");

  return (
    <div className="relative z-[99999999]">
      <Select
        onValueChange={(val) => {
          setVal(val);
          onUpdate(val);
        }}
        value={val}
      >
        <SelectTrigger>
          <SelectValue placeholder="" />
        </SelectTrigger>

        <SelectContent className="z-[999999999]">
          {options.map((s) => (
            <SelectItem
              value={s}
              key={s}
              className="capitalize"
            >
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExtraFilter;
