import * as React from "react"

import { cn } from "@/lib/utils"

const AlertBox = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "bg-blue-100 p-2 rounded text-sm text-blue-900 flex flex-col gap-2",
            className
        )}
        {...props}
    />
))
AlertBox.displayName = "AlertBox"

const AlertBoxHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
AlertBoxHeader.displayName = "AlertBoxHeader"

const AlertBoxTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("font-semibold leading-none tracking-tight", className)}
        {...props}
    />
))
AlertBoxTitle.displayName = "AlertBoxTitle"

const AlertBoxDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
        {...props}
    />
))
AlertBoxDescription.displayName = "AlertBoxDescription"

const AlertBoxContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
AlertBoxContent.displayName = "AlertBoxContent"

const AlertBoxFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
AlertBoxFooter.displayName = "AlertBoxFooter"

export { AlertBox, AlertBoxHeader, AlertBoxFooter, AlertBoxTitle, AlertBoxDescription, AlertBoxContent }
