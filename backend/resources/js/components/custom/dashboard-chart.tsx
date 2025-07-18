"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Raw order type
type Order = {
  id: number
  user_id: number
  price: string
  status: "paid" | "pending" | "shipped"
  created_at: string
  updated_at: string
}

const productTypes = {
  paid: { label: "Paid", color: "#4CAF50" },
  shipped: { label: "Shipped", color: "#2196F3" },
  pending: { label: "Pending", color: "#FFC107" },
}

function groupOrdersByDate(orders: Order[]) {
  const grouped: Record<string, { date: string; paid?: number; shipped?: number; pending?: number }> = {}

  orders.forEach((order) => {
    const dateKey = new Date(order.updated_at).toISOString().slice(0, 10) // YYYY-MM-DD

    if (!grouped[dateKey]) {
      grouped[dateKey] = { date: dateKey, paid: 0, shipped: 0, pending: 0 }
    }

    const price = parseFloat(order.price)

    if (order.status in grouped[dateKey]) {
      grouped[dateKey][order.status] = (grouped[dateKey][order.status] || 0) + price
    }
  })

  return Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export default function DashboardChart({ rawData }: { rawData: Order[] }) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [productType, setProductType] = React.useState<"paid" | "shipped" | "pending">("shipped")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const groupedData = React.useMemo(() => groupOrdersByDate(rawData), [rawData])

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date()
    const days = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - days)

    return groupedData.filter((item) => new Date(item.date) >= startDate)
  }, [groupedData, timeRange])

  const color = productTypes[productType]?.color ?? "#999"

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Orders - {productTypes[productType]?.label}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Total for the selected range</span>
          <span className="@[540px]/card:hidden">Last period</span>
        </CardDescription>
        <CardAction className="flex flex-wrap gap-2">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(val) => val && setTimeRange(val)}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={(val) => setTimeRange(val as string)}>
            <SelectTrigger className="w-36 @[767px]/card:hidden">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={productType} onValueChange={(val) => setProductType(val as any)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(productTypes).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No data available for this range.</p>
        ) : (
          <ChartContainer config={{}} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                defaultIndex={isMobile ? -1 : 10}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey={productType}
                type="natural"
                fill="url(#fillColor)"
                stroke={color}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
