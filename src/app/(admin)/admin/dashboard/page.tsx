import { DashboardLatestTracks } from "@/components/dashboard/dashboard-latest-tracks";

export const metadata = {
  title: "Dashboard | Umbrella Records Admin",
  description: "Dashboard admin page",
};

export default function AdminDashboardPage() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div>
        <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your catalogue and view performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <DashboardLatestTracks />

        <section className="h-full min-h-[300px] flex flex-col justify-center items-center rounded-xl border-2 border-dashed border-muted/30 bg-muted/5">
          <div className="text-center text-sm text-muted-foreground">
          </div>
        </section>
      </div>
    </div>
  );
}
