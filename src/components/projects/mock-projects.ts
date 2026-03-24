export type ProjectStatus = "idea" | "composition" | "mixing" | "mastered";

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  lastModified: string;
  createdAt: string;
}

export const statusConfig: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  idea: {
    label: "Idea",
    className:
      "bg-zinc-500/10 text-zinc-500 dark:bg-zinc-400/10 dark:text-zinc-400",
  },
  composition: {
    label: "Composition",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
  },
  mixing: {
    label: "Mixing",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-500",
  },
  mastered: {
    label: "Mastered",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
  },
};

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Summer Vibes Beat Pack",
    status: "mastered",
    lastModified: "2 hours ago",
    createdAt: "Mar 15, 2026",
  },
  {
    id: "2",
    title: "Midnight Trap Session",
    status: "mixing",
    lastModified: "5 hours ago",
    createdAt: "Mar 14, 2026",
  },
  {
    id: "3",
    title: "Lo-Fi Dreams Vol. 2",
    status: "composition",
    lastModified: "1 day ago",
    createdAt: "Mar 12, 2026",
  },
  {
    id: "4",
    title: "Drill Instrumentals",
    status: "mixing",
    lastModified: "2 days ago",
    createdAt: "Mar 10, 2026",
  },
  {
    id: "5",
    title: "R&B Smooth Collection",
    status: "idea",
    lastModified: "3 days ago",
    createdAt: "Mar 8, 2026",
  },
  {
    id: "6",
    title: "Afrobeat Fusion",
    status: "composition",
    lastModified: "4 days ago",
    createdAt: "Mar 5, 2026",
  },
  {
    id: "7",
    title: "Cinematic Orchestral Pack",
    status: "mastered",
    lastModified: "1 week ago",
    createdAt: "Mar 1, 2026",
  },
  {
    id: "8",
    title: "Tech House Grooves",
    status: "idea",
    lastModified: "1 week ago",
    createdAt: "Feb 28, 2026",
  },
];
