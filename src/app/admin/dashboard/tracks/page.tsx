"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import data from "../data.json";
import { supabase } from "@/hooks/createClient";
import { useQuery } from "@tanstack/react-query";

// export interface AudioDetails {
//   id: string;
//   created_at: string | number | Date;
//   name: string | null;
//   media_url: string;
//   bpm: number | null;
//   key: string | null;
//   length: string | null;
//   producer: string | null;
//   img_url: string | null;
//   is_new: boolean | null;
//   description: string | null;
//   is_desc_ai: boolean | null;
//   genres: { genre: string } | null;
//   keys: { key: string } | null;
// }

export interface BeatTrack {
  id: string;
  name: string | null;
  bpm: number | null;
  genres: { genre: string }[] | null;
}

export default function Page() {
  async function fetchBeats(): Promise<BeatTrack[]> {
    const res = await supabase
      .from("beats_tracks")
      .select("id,name,bpm,genres(genre)");

    if (res.error) throw new Error(res.error.message);

    return (res.data ?? []) as BeatTrack[];
  }

  const { data: trackData, error, isLoading } = useQuery<BeatTrack[]>({
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
