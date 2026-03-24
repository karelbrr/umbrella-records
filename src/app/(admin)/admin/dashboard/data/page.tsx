import { DataManagmentTabs } from "@/components/data/data-managment-tabs";

export default function DataManagementPage() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
            Data Management
          </h1>
          <p className="text-muted-foreground lg:text-left text-center">
            Manage your genres, keys, and tags in one place.
          </p>
        </div>
      </div>

      <DataManagmentTabs />
    </div>
  );
}
