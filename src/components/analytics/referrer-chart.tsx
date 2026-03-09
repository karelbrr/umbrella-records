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

const data = [
  { name: "Google", value: 450, color: "#4285F4" },
  { name: "Instagram", value: 300, color: "#E1306C" },
  { name: "Direct", value: 200, color: "#10b981" },
  { name: "YouTube", value: 150, color: "#FF0000" },
  { name: "BeatStars", value: 100, color: "#8b5cf6" },
];

export function ReferrerChart() {
  return (
    <Card className="flex flex-col bg-black border-zinc-800">
      <CardHeader>
        <CardTitle>Traffic Sources</CardTitle>
        <CardDescription>Where your listeners are coming from</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60} // Tímto vytvoříme "Donut" efekt
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-zinc-400 text-xs">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
