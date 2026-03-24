"use client";
import { DataTable } from "@/components/data-table";
import { supabase } from "@/hooks/create-client";
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
  beat_tags: {
    tags: {
      id: string;
      tag_title: string;
    };
  }[];
}

export default function EditTrackSection() {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select(
        `
      *,
      genres (id, genre),
      keys (id, key),
      profiles (id, username)
,beat_tags(tags(id, tag_title))
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

  const { data } = useQuery<AudioListItem[]>({
    queryKey: ["BeatsForAdmin"],
    queryFn: fetchBeats,
  });

  return <DataTable data={data || []} />;
}
