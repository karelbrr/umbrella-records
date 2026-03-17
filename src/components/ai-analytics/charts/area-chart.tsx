"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMemo } from "react";

export function AreaChartComponent({ data }: { data: any[] }) {
  // 1. Definice barev, které budeme točit
  const colors = [
    "hsl(270 70% 60%)", // Fialová (Beat Views)
    "hsl(180 70% 50%)", // Tyrkysová (Page Visits)
    "hsl(150 70% 50%)", // Zelená
    "hsl(30 80% 60%)", // Oranžová
  ];

  const { chartConfig, dataKeys } = useMemo(() => {
    if (!data || data.length === 0) return { chartConfig: {}, dataKeys: [] };

    const keys = Object.keys(data[0]).filter(
      (k) => k !== "date" && k !== "name",
    );

    const config: ChartConfig = {};
    keys.forEach((key, i) => {
      config[key] = {
        label: key
          .replace(/([A-Z])/g, " $1")
          .trim()
          .replace(/^\w/, (c) => c.toUpperCase()),
        color: colors[i % colors.length],
      };
    });

    return { chartConfig: config, dataKeys: keys };
  }, [data]);

  if (dataKeys.length === 0) return null;

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
      >
        <defs>
          {/* Dynamicky generované přechody pro každý klíč */}
          {dataKeys.map((key, i) => (
            <linearGradient
              key={`grad-${key}`}
              id={`fill-${key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor={colors[i % colors.length]}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={colors[i % colors.length]}
                stopOpacity={0.05}
              />
            </linearGradient>
          ))}
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
          className="text-zinc-500 text-[10px]"
          minTickGap={32}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={12}
          className="text-zinc-500 text-[10px]"
          tickFormatter={(val) => (val > 0 ? val : "")}
        />

        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent indicator="dot" />}
        />

        {/* Dynamické vykreslení všech Area komponent */}
        {dataKeys.map((key, i) => (
          <Area
            key={key}
            dataKey={key}
            type="natural"
            fill={`url(#fill-${key})`}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            stackId="stack" // Pokud chceš, aby se grafy sčítaly nad sebe, nechej "stack", jinak dej i
            animationDuration={1500}
          />
        ))}

        <ChartLegend content={<ChartLegendContent />} className="pt-4" />
      </AreaChart>
    </ChartContainer>
  );
}
