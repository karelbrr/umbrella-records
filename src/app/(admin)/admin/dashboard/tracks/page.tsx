import EditTrackSection from "@/components/edit-track-section";

export const metadata = {
  title: "Tracks | Umbrella Records Admin",
  description: "Tracks admin page",
};

export default function Page() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div>
        <h1 className=" text-3xl font-bold tracking-tight lg:text-left text-center text-foreground">
          Edit the Track
        </h1>
        <p className="mt-1 text-muted-foreground lg:text-left text-center">
          Manage and edit tracks in your audio library from the admin dashboard
        </p>
      </div>

      {/* Form */}
      <EditTrackSection />
    </div>
  );
}
