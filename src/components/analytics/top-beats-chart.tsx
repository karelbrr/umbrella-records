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
import { useTopBeatsPlays } from "@/lib/analytics-api";

const chartConfig = {
  plays: {
    label: "Total Plays",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TopBeatsChart() {
  const { data, isLoading, error } = useTopBeatsPlays();

  return (
    <Card className="bg-zinc-950 border-zinc-800 w-full h-full flex flex-col overflow-hidden">
      <CardHeader className="pl-5 border-b border-zinc-800">
        <CardTitle className="text-white ">
          Top 5 Most Played Beats
        </CardTitle>
        <CardDescription className="text-zinc-500">
          Which tracks are performing the best overall.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-2 sm:p-6 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex h-[250px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-600" />
          </div>
        ) : error ? (
          <div className="flex h-[250px] items-center justify-center text-red-500 text-sm">
            Failed to load beat stats.
          </div>
        ) : (
         
          <ChartContainer
            config={chartConfig}
            className="w-full h-[250px] lg:max-h-[350px] aspect-auto"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 45, left: 0, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  className="text-zinc-500 text-[10px] sm:text-xs"
                  tickFormatter={(value) =>
                    value.length > 12 ? `${value.substring(0, 10)}...` : value
                  }
                />

                <ChartTooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Bar
                  dataKey="plays"
                  fill="hsl(270 70% 60%)"
                  radius={[0, 4, 4, 0]}
                  barSize={28}
                  animationDuration={1000}
                  label={{
                    position: "right",
                    fill: "#71717a",
                    fontSize: 10,
                    offset: 10,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
