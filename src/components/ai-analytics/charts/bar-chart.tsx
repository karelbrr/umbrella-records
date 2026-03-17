"use client";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  plays: {
    label: "Total Plays",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BarChartComponent({ data }: { data: any[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={120}
          className="text-zinc-400 text-xs"
        />
        <ChartTooltip
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar
          dataKey="plays"
          fill="hsl(270 70% 60%)"
          radius={[0, 4, 4, 0]}
          barSize={32}
          animationDuration={1000}
          label={{
            position: "right",
            fill: "#888",
            fontSize: 12,
            offset: 10,
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
