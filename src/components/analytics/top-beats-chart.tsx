"use client";
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
  type ChartConfig,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import {  useTopBeatsPlays } from "@/lib/analytics-api";

const chartConfig = {
  plays: {
    label: "Total Plays",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TopBeatsChart() {
  const { data, isLoading, error } = useTopBeatsPlays();
  

  return (
    <Card className="flex flex-col bg-zinc-950 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-white">Top 5 Most Played Beats</CardTitle>
        <CardDescription className="text-zinc-400">
          Which tracks are performing the best overall.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {isLoading ? (
          <div className="flex h-[300px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
          </div>
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center text-red-500 text-sm">
            Failed to load beat stats.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                hide // Schováme osu X pro čistší "SaaS" vzhled
              />
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
                fill="hsl(270 70% 60%)" // Hezká fialová pro hudbu
                radius={[0, 4, 4, 0]}
                barSize={32}
                animationDuration={1000}
                // Přidání labelu přímo na konec baru
                label={{
                  position: "right",
                  fill: "#888",
                  fontSize: 12,
                  offset: 10,
                }}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
