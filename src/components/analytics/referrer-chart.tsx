"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTrafficSources } from "@/lib/analytics-api";
import { Loader2 } from "lucide-react";

export function ReferrerChart() {
  const { data: trafficSources, isLoading } = useTrafficSources();

  const palette = [
    "#6366F1", // Indigo
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Red
  ];

  type ReferrerAggregate = { source: string; count: number };

  const aggregatedData: ReferrerAggregate[] = Object.values(
    (trafficSources ?? []).reduce(
      (acc: Record<string, ReferrerAggregate>, curr: any) => {
        const sourceName =
          curr?.metadata?.utm_source ||
          curr?.jsonb_metadata?.utm_source ||
          "Direct / Organic";

        if (!acc[sourceName]) {
          acc[sourceName] = { source: sourceName, count: 0 };
        }
        acc[sourceName].count += 1;
        return acc;
      },
      {} as Record<string, ReferrerAggregate>,
    ),
  ).sort((a: ReferrerAggregate, b: ReferrerAggregate) => b.count - a.count);

  const chartData = aggregatedData.map((item, idx) => ({
    name: item.source,
    value: item.count,
    color: palette[idx % palette.length],
  }));

  return (
    <Card className="bg-zinc-950 border-zinc-800">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b border-zinc-800 p-0  pl-5">
        <CardTitle className="text-white">Traffic Sources</CardTitle>
        <CardDescription className="text-zinc-500">
          Where your listeners are coming from
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4 min-h-[300px] flex items-center justify-center">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-zinc-700" />
        ) : chartData.length > 0 ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#09090b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#a1a1aa" }}
                  itemStyle={{
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  formatter={(value: number, name: string) => [value, "Views"]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-zinc-400 text-xs px-2">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-zinc-600 text-sm">No traffic data yet</div>
        )}
      </CardContent>
    </Card>
  );
}
