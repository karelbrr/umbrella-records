"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const getHeaderName = (path: string) => {
    if (path === "/admin/dashboard" || path === "/admin/dashboard/") {
      return "Overview";
    }
    const remainingPath = path.replace("/admin/dashboard/", "");
    const firstSegment = remainingPath.split("/")[0];

    return firstSegment;
  };

  const formatTitle = (str: string): string => {
    if (!str) return "";
    const cleaned = str.replace(/[-_]+/g, " ").trim();
    return cleaned
      .split(/\s+/)
      .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : ""))
      .join(" ");
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {formatTitle(getHeaderName(pathname))}
        </h1>
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
