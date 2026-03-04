import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DateRangePicker } from "@/components/analytics/date-range-picker";
import { MetricCards } from "@/components/analytics/metric-cards";
import { TrafficChart } from "@/components/analytics/traffic-chart";
import { TopBeatsChart } from "@/components/analytics/top-beats-chart";
import { RecentActivity } from "@/components/analytics/recent-activity";
export const metadata = {
  title: "Analytics | Umbrella Records Admin",
  description: "Analytics admin page",
};

export default function Page() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div>
        {/* Page Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
        <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
              Dashboard Analytics
            </h1>
            <p className="text-muted-foreground">
              Track your beat sales performance and audience engagement
            </p>
          </div>
          <DateRangePicker />
        </div>

        {/* Metric Cards */}
        <section aria-label="Key metrics" className="mb-6">
          <MetricCards />
        </section>

        {/* Traffic Chart */}
        <section aria-label="Traffic overview" className="mb-6">
          <TrafficChart />
        </section>

        {/* Bottom Row: Bar Chart + Recent Activity */}
        <section aria-label="Details" className="grid gap-6 lg:grid-cols-2">
          <TopBeatsChart />
          <RecentActivity />
        </section>
      </div>
    </div>
  );
}
