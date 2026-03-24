"use client";

import Link from "next/link";
import { statusConfig } from "@/components/projects/mock-projects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Clock } from "lucide-react";
import { supabase } from "@/hooks/create-client";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/hooks/format-date";

export type Projectproject_status =
  | "idea"
  | "composition"
  | "mixing"
  | "mastered";

export interface Project {
  id: string;
  title: string;
  project_status: Projectproject_status;
  last_modified: string;
  created_at: string;
}

export default function ProjectsList() {
  const { data: projectsData, isLoading: projectsLoading } = useQuery<
    Project[]
  >({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("last_modified", { ascending: true });
      if (error) throw new Error(error.message);

      return data;
    },
  });

  // --- SKELETON LOADING STATE ---
  if (projectsLoading) {
    return (
      <section>
        {/* Skeleton pro Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-border bg-transparent p-4"
            >
              <Skeleton className="size-10 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Skeleton pro Tabulku */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableCell>
                    <Skeleton className="h-5 w-[60%]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    );
  }

  // --- LOADED STATE (Když jsou data připravená) ---
  const safeData = projectsData || []; // Bezpečný fallback, aby filter a length nepadaly

  return (
    <section>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Projects",
            value: safeData.length,
            icon: Music,
          },
          {
            label: "In Progress",
            value: safeData.filter(
              (p) =>
                p.project_status === "composition" ||
                p.project_status === "mixing",
            ).length,
            icon: Clock,
          },
          {
            label: "Mastered",
            value: safeData.filter((p) => p.project_status === "mastered")
              .length,
            icon: Music,
          },
          {
            label: "Ideas",
            value: safeData.filter(
              (p) => p.project_status?.toLowerCase().trim() === "idea",
            ).length,
            icon: Music,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-lg border border-border bg-transparent p-4"
          >
            <div className="flex size-10 items-center justify-center rounded-md bg-muted">
              <stat.icon className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Projects Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {safeData.map((project) => {
              return (
                <TableRow key={project.id} className="group cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/admin/dashboard/projects/${project.id}`}
                      className="font-medium hover:underline text-foreground"
                    >
                      {project.title || "Untitled Project"}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        statusConfig[project.project_status]?.className
                      }
                    >
                      {statusConfig[project.project_status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatDate(project.last_modified)}
                  </TableCell>
                </TableRow>
              );
            })}

            {safeData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-24 text-center text-muted-foreground"
                >
                  No projects found. Create your first beat!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
