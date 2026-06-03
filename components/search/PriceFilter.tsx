"use client";
import React, { useTransition } from "react";
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

interface Props {
  setMaxPrice: <Shallow>(
    value: string | ((old: string) => string | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  setMinPrice: <Shallow>(
    value: string | ((old: string) => string | null) | null,
    options?: Options<Shallow> | undefined
  ) => Promise<URLSearchParams>;
  maxPrice: string;
  minPrice: string;
  className?: string;
}

const PriceFilter = ({
  minPrice,
  maxPrice,
  setMaxPrice,
  setMinPrice,
  className
}: Props) => {
  const [isLoading, startTransition] = useTransition();
  const handleMinPrice = (value: string) => {
    setMinPrice(value, { startTransition });
  };
  const handleMaxPrice = (value: string) => {
    setMaxPrice(value, { startTransition });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          {/* <Tag className="mr-2 h-4 w-4" /> */}
          <span className="text-muted-foreground">Price</span>
          <ChevronDown className="ml-5 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="md:w-96 w-[50vw] z-[99999]">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="min-price">
                Minimum
              </Label>
              <Input
                id="min-price"
                value={minPrice ?? ""}
                type="number"
                onChange={(e) => handleMinPrice(e.target.value)}
                className={cn(
                  "w-full md:max-w-sm h-9 bg-white",
                  isLoading && "animate-pulse"
                )}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-price">
                Maximum
              </Label>
              <Input
                id="max-price"
                type="number"
                value={maxPrice ?? ""}
                onChange={(e) => handleMaxPrice(e.target.value)}
                className={cn(
                  "w-full md:max-w-sm h-9 bg-white",
                  isLoading && "animate-pulse"
                )}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PriceFilter;
