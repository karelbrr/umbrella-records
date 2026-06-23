"use client";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/hooks/format-date";
import { supabase } from "@/hooks/create-client";
import { useQuery } from "@tanstack/react-query";

export function DashboardLatestTracks() {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select(
        "id,name,bpm,img_url,is_new,created_at,genres(genre),keys(key),profiles(username)",
      )
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) throw new Error(error.message);

    return data.map((item) => ({
      ...item,
      created_at: item.created_at,
      genres: item.genres
        ? Array.isArray(item.genres)
          ? item.genres
          : [item.genres]
        : [],
      keys: item.keys
        ? Array.isArray(item.keys)
          ? item.keys
          : [item.keys]
        : [],
      profiles: item.profiles
        ? Array.isArray(item.profiles)
          ? item.profiles
          : [item.profiles]
        : [],
    }));
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["latestBeats"],
    queryFn: fetchBeats,
  });
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" /> Recent Uploads
        </h2>
        <Link
          href="/admin/dashboard/tracks"
          className="text-xs text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="space-y-3">
        {(data || []).map((track) => (
          <div
            key={track.id}
            className="group relative flex items-center gap-4 p-3 rounded-md border  transition-all shadow-sm"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border">
              <Image
                src={track.img_url || "/placeholder-img.png"}
                alt={track.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                {track.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Music2 className="h-3 w-3" /> {track.keys?.[0]?.key ?? "N/A"}
                </span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" /> {track.bpm || "--"} BPM
                </span>
              </div>
            </div>

            <div className="text-right pr-2">
              <Badge variant="outline" className="text-[9px] h-5">
                {track.genres?.[0]?.genre ?? "No Genre"}
              </Badge>
              <p className="text-[10px] text-muted-foreground mt-1 italic">
                {formatDate(track?.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
