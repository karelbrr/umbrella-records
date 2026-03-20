"use client";

import {
  Eye,
  Music2,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  useBeatPlayStats,
  useBeatStats,
  useWebsiteStats,
} from "@/lib/analytics-api";
export function MetricCards() {
  const websiteQuery = useWebsiteStats();
  const beatsQuery = useBeatStats();
  const beatPlaysQuery = useBeatPlayStats();

  const metrics = [
    {
      title: "Website Visits",
      value: websiteQuery.isLoading
        ? "---"
        : websiteQuery.data?.toLocaleString(),
      change: "+5.2%",
      trend: "up" as const,
      icon: Eye,
      description: "total page loads",
    },
    {
      title: "Beat Impressions",
      value: beatsQuery.isLoading ? "---" : beatsQuery.data?.toLocaleString(),
      change: "+18.1%",
      trend: "up" as const,
      icon: Music2,
      description: "views on beat details",
    },
    {
      title: "Beat Plays",
      value: beatPlaysQuery.isLoading
        ? "---"
        : beatPlaysQuery.data?.toLocaleString(),
      change: "+18.1%",
      trend: "up" as const,
      icon: Play,
      description: "times beats was played",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="gap-0 py-0 bg-zinc-950">
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold tracking-tight">
                    {metric.value}
                  </p>
                  {/* <span
                    className={`inline-flex items-center text-xs font-medium ${
                      metric.trend === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="mr-0.5 size-3" />
                    ) : (
                      <ArrowDownRight className="mr-0.5 size-3" />
                    )}
                    {metric.change}
                  </span> */}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
