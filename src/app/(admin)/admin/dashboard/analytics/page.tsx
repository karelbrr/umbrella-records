import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetricCards } from "@/components/analytics/metric-cards";
import { TrafficChart } from "@/components/analytics/traffic-chart";
import { TopBeatsChart } from "@/components/analytics/top-beats-chart";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { ReferrerChart } from "@/components/analytics/referrer-chart";
import AiAnalyticsContainer from "@/components/ai-analytics/ai-analytics-container";

export const metadata = {
  title: "Analytics | Umbrella Records Admin",
  description: "Analytics admin page",
};

export default function Page() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10 h-full ">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
              Dashboard Analytics
            </h1>
            <p className="text-muted-foreground lg:text-left text-center">
              Track your beat sales performance and audience engagement
            </p>
          </div>
        </div>
        <section className="">
          <Tabs defaultValue="overview" className="h-full">
            <TabsList className="mb-5 bg-black border border-card">
              <TabsTrigger value="overview" className=" mx-0.5">
                Standard Overview
              </TabsTrigger>
              <TabsTrigger value="ai-analytics" className="gap-2 mx-0.5">
                AI Analytics{" "}
                <Badge
                  variant="outline"
                  className="border-purple-500 text-purple-400"
                >
                  <Sparkles className="mr-0.5 h-3 w-3" /> Beta
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              {/* Metric Cards */}
              <section aria-label="Key metrics" className="mb-6">
                <MetricCards />
              </section>

              {/* Traffic Chart */}
              <section aria-label="Traffic overview" className="mb-6">
                <TrafficChart />
              </section>

              {/* Bottom Row: Bar Chart + Referrer */}
              <section
                aria-label="Details"
                className="grid gap-6 lg:grid-cols-2 "
              >
                <TopBeatsChart />
                <ReferrerChart />
              </section>
            </TabsContent>
            <TabsContent value="ai-analytics" className="h-full ">
              <AiAnalyticsContainer />
            </TabsContent>
          </Tabs>
        </section>
      </div>
  );
}
