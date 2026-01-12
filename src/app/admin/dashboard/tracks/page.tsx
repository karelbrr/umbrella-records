"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { supabase } from "@/hooks/createClient";
import { useQuery } from "@tanstack/react-query";

export interface AudioListItem {
  id: string;
  created_at: string | number | Date;
  name: string | null;
  media_url: string;
  bpm: number | null;
  length: string | null;

  img_url: string | null;
  is_new: boolean | null;
  description: string | null;
  is_desc_ai: boolean | null;
  producer: string | null;
  key: string | null;
  genre: string | null;
}

export default function Page() {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select("*, genres(genre), keys(key), profiles(username)");

    if (error) throw new Error(error.message);

    return (data || []).map((item: any) => {
      
      const getValue = (data: any, field: string) => {
        if (!data) return null;
        if (Array.isArray(data)) {
          return data.length > 0 ? data[0][field] : null;
        }
        return data[field];
      };

      return {
        ...item,
        genre: getValue(item.genres, "genre"),
        key: getValue(item.keys, "key"),
        producer: getValue(item.profiles, "username"),
        genres: undefined,
        keys: undefined,
        profiles: undefined,
      };
    });
  }

  const { data, error, isLoading } = useQuery<AudioListItem[]>({
    queryKey: ["BeatsForAdmin"],
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
              <DataTable data={data || []} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
