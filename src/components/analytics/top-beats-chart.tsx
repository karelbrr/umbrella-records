"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
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
  type ChartConfig,
} from "@/components/ui/chart"
import { topBeats } from "./mock-data"

const chartConfig = {
  plays: {
    label: "Total Plays",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig

export function TopBeatsChart() {
  return (
    <Card className="flex flex-col bg-black">
      <CardHeader>
        <CardTitle>Top 5 Most Played Beats</CardTitle>
        <CardDescription>
          All-time play counts for your most popular beats
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={topBeats}
            layout="vertical"
            margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={110}
              tickMargin={4}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="plays"
              fill="var(--color-chart-1)"
              radius={[0, 4, 4, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
