import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
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
        className={cn(
          "flex w-full h-full justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%" aspect={undefined}>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
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

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

// New Chart Components
interface ChartProps {
  data: any
  className?: string
  config?: ChartConfig
}

const LineChart: React.FC<ChartProps> = ({ data, className, config = {} }) => {
  // Process the data format to be compatible with Recharts
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // If it's already in the right format, return it
    if (!data.labels && Array.isArray(data)) {
      return data;
    }

    // For chart data that comes from Dashboard.tsx (format with labels and datasets)
    if (data.labels && data.datasets) {
      return data.labels.map((label: string, index: number) => {
        const result: Record<string, any> = { name: label };
        
        // Add a property for each dataset
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const key = dataset.label || `dataset${datasetIndex}`;
          result[key] = dataset.data[index];
        });
        
        return result;
      });
    }
    
    return [];
  }, [data]);

  return (
    <ChartContainer className={cn("w-full h-full", className)} config={config}>
      <RechartsPrimitive.LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <ChartTooltip />
        
        {data.datasets ? (
          data.datasets.map((dataset: any, index: number) => (
            <RechartsPrimitive.Line
              key={index}
              type="monotone"
              dataKey={dataset.label || `dataset${index}`}
              stroke={dataset.borderColor || `hsl(${index * 45}, 70%, 50%)`}
              strokeWidth={2}
              dot={{ fill: dataset.borderColor || `hsl(${index * 45}, 70%, 50%)` }}
            />
          ))
        ) : (
          <RechartsPrimitive.Line
            type="monotone"
            dataKey={Object.keys(chartData[0] || {}).find(key => key !== "name") || "value"}
            stroke="#8884d8"
            strokeWidth={2}
          />
        )}
      </RechartsPrimitive.LineChart>
    </ChartContainer>
  );
};

const BarChart: React.FC<ChartProps> = ({ data, className, config = {} }) => {
  // Process the data format to be compatible with Recharts
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // If it's already in the right format, return it
    if (!data.labels && Array.isArray(data)) {
      return data;
    }

    // For chart data that comes from Dashboard.tsx (format with labels and datasets)
    if (data.labels && data.datasets) {
      return data.labels.map((label: string, index: number) => {
        const result: Record<string, any> = { name: label };
        
        // Add a property for each dataset
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const key = dataset.label || `dataset${datasetIndex}`;
          result[key] = dataset.data[index];
        });
        
        return result;
      });
    }
    
    return [];
  }, [data]);

  return (
    <ChartContainer className={cn("w-full h-full", className)} config={config}>
      <RechartsPrimitive.BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey="name" />
        <RechartsPrimitive.YAxis />
        <ChartTooltip />
        
        {data.datasets ? 
          data.datasets.map((dataset: any, index: number) => (
            <RechartsPrimitive.Bar 
              key={index}
              dataKey={dataset.label || `dataset${index}`} 
              fill={dataset.backgroundColor?.[0] || `hsl(${index * 45}, 70%, 50%)`} 
            />
          )) : (
            <RechartsPrimitive.Bar 
              dataKey={Object.keys(chartData[0] || {}).find(key => key !== "name") || "value"} 
              fill="#8884d8" 
            />
          )
        }
      </RechartsPrimitive.BarChart>
    </ChartContainer>
  );
};

const PieChart: React.FC<ChartProps> = ({ data, className, config = {} }) => {
  // Process the data format to be compatible with Recharts
  const pieData = React.useMemo(() => {
    if (!data) return [];
    
    // If it's already in the right format, return it
    if (!data.labels && Array.isArray(data)) {
      return data;
    }

    // For chart data that comes from Dashboard.tsx (format with labels and datasets)
    if (data.labels && data.datasets && data.datasets[0]) {
      return data.labels.map((label: string, index: number) => ({
        name: label,
        value: data.datasets[0].data[index],
        fill: data.datasets[0].backgroundColor?.[index] || `hsl(${index * 45}, 70%, 50%)`,
      }));
    }
    
    return [];
  }, [data]);

  return (
    <ChartContainer className={cn("w-full h-full", className)} config={config}>
      <RechartsPrimitive.PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
        <ChartTooltip />
        <RechartsPrimitive.Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
          isAnimationActive={true}
        >
          {pieData.map((entry: any, index: number) => (
            <RechartsPrimitive.Cell 
              key={`cell-${index}`} 
              fill={entry.fill || `hsl(${index * 45}, 70%, 50%)`} 
            />
          ))}
        </RechartsPrimitive.Pie>
        <RechartsPrimitive.Legend />
      </RechartsPrimitive.PieChart>
    </ChartContainer>
  );
};

const RadarChart: React.FC<ChartProps> = ({ data, className, config = {} }) => {
  // Process the data format to be compatible with Recharts
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // If it's already in the right format, return it
    if (!data.labels && Array.isArray(data)) {
      return data;
    }

    // For chart data that comes from Dashboard.tsx (format with labels and datasets)
    if (data.labels && data.datasets) {
      return data.labels.map((label: string, index: number) => {
        const result: Record<string, any> = { name: label };
        
        // Add a property for each dataset
        data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const key = dataset.label || `dataset${datasetIndex}`;
          result[key] = dataset.data[index];
        });
        
        return result;
      });
    }
    
    return [];
  }, [data]);

  return (
    <ChartContainer className={cn("w-full h-full", className)} config={config}>
      <RechartsPrimitive.RadarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 5 }}>
        <RechartsPrimitive.PolarGrid />
        <RechartsPrimitive.PolarAngleAxis dataKey="name" />
        <RechartsPrimitive.PolarRadiusAxis />
        <ChartTooltip />
        
        {data.datasets ? 
          data.datasets.map((dataset: any, index: number) => (
            <RechartsPrimitive.Radar
              key={index}
              name={dataset.label || `Dataset ${index}`}
              dataKey={dataset.label || `dataset${index}`}
              stroke={dataset.borderColor || `hsl(${index * 45}, 70%, 50%)`}
              fill={dataset.backgroundColor || `hsl(${index * 45}, 70%, 20%, 0.3)`}
              isAnimationActive={true}
            />
          )) : (
            <RechartsPrimitive.Radar
              name="Data"
              dataKey={Object.keys(chartData[0] || {}).find(key => key !== "name") || "value"}
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              isAnimationActive={true}
            />
          )
        }
        <RechartsPrimitive.Legend />
      </RechartsPrimitive.RadarChart>
    </ChartContainer>
  );
};

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  LineChart,
  BarChart,
  PieChart,
  RadarChart,
}
