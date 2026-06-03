"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { cn } from "@/lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

/* =========================
   CONTAINER
========================= */
const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

/* =========================
   STYLE
========================= */
const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, c]) => c.theme || c.color
  )

  if (!colorConfig.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, item]) => {
    const color =
      item.theme?.[theme as keyof typeof item.theme] || item.color
    return color ? `--color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

/* =========================
   TOOLTIP
========================= */

const ChartTooltip = RechartsPrimitive.Tooltip

type TooltipProps = {
  active?: boolean
  payload?: Payload<ValueType, NameType>[]   // ✅ FIX
  label?: string | number
} & React.ComponentProps<"div">

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  TooltipProps
>(({ active, payload, className, label }, ref) => {
  const { config } = useChart()

  if (!active || !Array.isArray(payload) || payload.length === 0) return null

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-[8rem] rounded-lg border bg-white px-3 py-2 text-xs shadow-lg",
        className
      )}
    >
      <div className="font-medium mb-1">{label}</div>

      {payload.map((item, index) => {
        const key = `${item.name || item.dataKey || "value"}`
        const itemConfig = config[key]

        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />

            <span className="text-gray-500">
              {itemConfig?.label || item.name}
            </span>

            <span className="ml-auto font-mono">
              {item.value?.toString()}
            </span>
          </div>
        )
      })}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltip"

/* =========================
   LEGEND
========================= */

const ChartLegend = RechartsPrimitive.Legend

type LegendPayloadItem = {
  value: string
  color?: string
  dataKey?: string
}

type ChartLegendProps = {
  payload?: LegendPayloadItem[]   // ✅ FIX (explicit type)
  verticalAlign?: "top" | "bottom"
  hideIcon?: boolean
  nameKey?: string
} & React.ComponentProps<"div">

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  ChartLegendProps
>(
  (
    { className, payload, verticalAlign = "bottom", hideIcon = false },
    ref
  ) => {
    const { config } = useChart()

    if (!Array.isArray(payload) || payload.length === 0) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item, index) => {
          const key = item.dataKey || item.value
          const itemConfig = config[key]

          return (
            <div key={index} className="flex items-center gap-1.5">
              {!hideIcon && (
                <div
                  className="h-2 w-2 rounded"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label || item.value}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

/* =========================
   EXPORTS
========================= */

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}