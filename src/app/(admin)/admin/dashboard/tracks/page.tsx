"use client";

import { DataTable } from "@/components/data-table";
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
      .select(
        `
      *,
      genres (id, genre),
      keys (id, key),
      profiles (id, username)
    `,
      )
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((item: any) => {
      const unwrapRelation = (relationData: any) => {
        if (!relationData) return null;
        return Array.isArray(relationData) ? relationData[0] : relationData;
      };

      return {
        ...item,
        genres: unwrapRelation(item.genres),
        keys: unwrapRelation(item.keys),
        profiles: unwrapRelation(item.profiles),
      };
    });
  }

  const { data, error, isLoading } = useQuery<AudioListItem[]>({
    queryKey: ["BeatsForAdmin"],
    queryFn: fetchBeats,
  });

  return (
    <div className="lg:px-8 px-4 py-4">
      <div className="mb-8">
        <h1 className="mt-4 text-3xl font-bold tracking-tight lg:text-left text-center text-foreground">
          Edit the Track
        </h1>
        <p className="mt-1 text-muted-foreground lg:text-left text-center">
          Manage and edit tracks in your audio library from the admin dashboard
        </p>
      </div>

      {/* Form */}
      <DataTable data={data || []} />
    </div>
  );
}
