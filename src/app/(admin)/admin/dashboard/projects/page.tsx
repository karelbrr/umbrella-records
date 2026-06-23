import ProjectsList from "@/components/projects/projects-list";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectsOverviewPage() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
            Projects{" "}
          </h1>
          <p className="text-muted-foreground lg:text-left text-center">
            Manage and organize your music beat projects
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/dashboard/projects/new">
            <Plus className="size-4" />
            New Project
          </Link>
        </Button>
      </div>

      <ProjectsList />
    </div>
  );
}
