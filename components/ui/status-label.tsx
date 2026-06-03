import * as React from "react"

import { cn } from "@/lib/utils"

const StatusLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "bg-blue-100 px-2 py-1 rounded-full text-sm text-blue-900 inline-flex flex-col gap-2",
            className
        )}
        {...props}
    />
))
StatusLabel.displayName = "StatusLabel"

export default StatusLabel
