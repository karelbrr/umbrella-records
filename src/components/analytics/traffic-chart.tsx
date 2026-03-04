"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { trafficData } from "./mock-data"

const chartConfig = {
  beatViews: {
    label: "Beat Views",
    color: "var(--color-chart-1)",
  },
  pageVisits: {
    label: "Page Visits",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig

export function TrafficChart() {
  return (
    <Card className="bg-black">
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
        <CardDescription>
          Beat views vs page visits over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <AreaChart
            data={trafficData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillBeatViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillPageVisits" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-2)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              className="stroke-border/50"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval="preserveStartEnd"
              tickCount={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="pageVisits"
              type="monotone"
              fill="url(#fillPageVisits)"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="beatViews"
              type="monotone"
              fill="url(#fillBeatViews)"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
