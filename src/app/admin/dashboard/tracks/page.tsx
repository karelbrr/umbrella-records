"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import data from "../data.json";
import { supabase } from "@/app/createClient";
import { useQuery } from "@tanstack/react-query";

export interface AudioDetails {
  id: string;
  created_at: string | number | Date;
  name: string | null;
  media_url: string;
  bpm: number | null;
  key: string | null;
  length: string | null;
  producer: string | null;
  img_url: string | null;
  description: string | null;
  is_desc_ai: boolean | null;
  genres: { genre: string } | null;
  keys: { key: string } | null;
}

export default function Page() {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select("id,name,bpm,genres(genre)");

    if (error) throw new Error(error.message);

    return data
  }

  const { data: trackData, error, isLoading } = useQuery<AudioDetails[]>({
    queryKey: ["beats"],
    queryFn: fetchBeats,
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 md:gap-6 ">
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
