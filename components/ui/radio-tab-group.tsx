"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioTabs = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      className={cn(
        "flex w-full rounded-lg border p-1 bg-white",
        className
      )}
      {...props}
    />
  )
})
RadioTabs.displayName = "RadioTabs"

const RadioTab = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "group relative flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-1 text-sm font-medium transition border border-transparent",
        "text-muted-foreground",
        "data-[state=checked]:bg-brand/20 data-[state=checked]:text-foreground data-[state=checked]:border-brand/10",
        className
      )}
      {...props}
    >

      {children}
    </RadioGroupPrimitive.Item>
  )
})
RadioTab.displayName = "RadioTab"

export { RadioTabs, RadioTab }
