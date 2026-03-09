"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import { useTrafficData } from "@/lib/analytics-api";

const chartConfig = {
  beatViews: {
    label: "Beat Views",
    theme: {
      light: "hsl(var(--chart-1))",
      dark: "hsl(270 70% 60%)",
    },
  },
  pageVisits: {
    label: "Page Visits",
    theme: {
      light: "hsl(var(--chart-2))",
      dark: "hsl(180 70% 50%)",
    },
  },
} satisfies ChartConfig;

export function TrafficChart() {
  const { data, isLoading, error } = useTrafficData();

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-zinc-800 p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 ">
          <CardTitle className="text-white">Traffic Overview</CardTitle>
          <CardDescription className="text-zinc-400">
            Real-time tracking of engagement over the last 30 days
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex h-[350px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          </div>
        ) : error ? (
          <div className="flex h-[350px] w-full items-center justify-center text-red-500">
            Failed to load analytics data.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillBeatViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(270 70% 60%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(270 70% 60%)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="fillPageVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(180 70% 50%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(180 70% 50%)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-zinc-800"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                className="text-zinc-500 text-xs"
                minTickGap={32}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                className="text-zinc-500 text-xs"
                tickFormatter={(val) => (val > 0 ? val : "")}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="pageVisits"
                type="natural"
                fill="url(#fillPageVisits)"
                stroke="hsl(180 70% 50%)"
                strokeWidth={2}
                stackId="visits"
                animationDuration={1500}
              />
              <Area
                dataKey="beatViews"
                type="natural"
                fill="url(#fillBeatViews)"
                stroke="hsl(270 70% 60%)"
                strokeWidth={2}
                stackId="beats"
                animationDuration={1500}
              />
              <ChartLegend content={<ChartLegendContent />} className="pt-4" />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
