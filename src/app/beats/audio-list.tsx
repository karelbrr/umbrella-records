import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../hooks/createClient";
import AudioListItem from "./audio-list-item";
import { Skeleton } from "@/components/ui/skeleton";
import FetchError from "@/components/fetch-error";

interface Props {
  beatsFilters?: {
    genre?: string;
    key?: string;
    sortBy?: string;
    keys?: { key: string }[] | null;

    search?: string;
  };
  setBeatsFilters?: (value: any) => void;
}

interface AudioListItemType {
  id: string;
  name: string;
  bpm: number;
  img_url: string;
  is_new: boolean;
  key?: string | null;
  producer?: string | null;
  genres: { genre: string }[] | null;
  keys?: { key: string }[] | null;
  profiles?: { username: string }[] | null;
  created_at: string;
}

export function AudioList({ beatsFilters, setBeatsFilters }: Props) {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select(
        "id,name,bpm,img_url,is_new,producer,genres(genre),keys(key),created_at,profiles(username)"
      );

    if (error) throw new Error(error.message);

    return (data || []).map((item: any) => ({
      ...item,
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

  const { data, error, isLoading } = useQuery<AudioListItemType[]>({
    queryKey: ["beats", beatsFilters || {}],
    queryFn: fetchBeats,
  });

  const filteredData = React.useMemo(() => {
    if (!data) return [] as AudioListItemType[];
    const f = beatsFilters || {};
    let result = [...data] as AudioListItemType[];

    // Search (name, producer, genre)
    if (f.search && f.search.trim() !== "") {
      const q = f.search.toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || "").toString().toLowerCase();
        const producer = (item.producer || "").toString().toLowerCase();
        const genreMatch = (item.genres || []).some((g) =>
          g.genre.toLowerCase().includes(q)
        );
        return name.includes(q) || producer.includes(q) || genreMatch;
      });
    }

    // Genre filter
    if (f.genre) {
      if (f.genre !== "none") {
        result = result.filter((item) =>
          (item.genres || []).some((g) => g.genre === f.genre)
        );
      }
    }

    // Key filter
    if (f.key) {
      if (f.key !== "none") {
        result = result.filter((item) => {
          // support either a top-level `key` or a `keys` relation array
          if (item.key && item.key === f.key) return true;
          if (item.keys && Array.isArray(item.keys)) {
            return item.keys.some((k) => k.key === f.key);
          }

          return false;
        });
      }
    }

    // Sorting
    if (f.sortBy) {
      if (f.sortBy === "bpm-asc") {
        result.sort((a, b) => (a.bpm || 0) - (b.bpm || 0));
      } else if (f.sortBy === "bpm-desc") {
        result.sort((a, b) => (b.bpm || 0) - (a.bpm || 0));
      } else if (f.sortBy === "newest") {
        // sort by created_at (newest first)
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (f.sortBy === "price-low" || f.sortBy === "price-high") {
        // no price field available — keep original order
      } else if (f.sortBy === "none") {
        // no sorting
      }
    }

    return result;
  }, [data, beatsFilters]);

  const skeletonCount = 10;

  return (
    <div
      className={`grid gap-x-7 mt-5 min-h-[83vh] grid-cols-1 gap-y-10 mb-10 lg:mb-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5`}
    >
      {isLoading || error
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className={`flex flex-col  items-start `}>
              <Skeleton className="w-full h-[260px] rounded-none" />
              <Skeleton className="w-3/4 h-[20px] mt-5 rounded-sm" />
              <Skeleton className="w-1/4 h-[15px] mt-3.5 rounded-sm" />
              <Skeleton className="w-3/4 h-[15px] mt-4 rounded-sm" />
            </div>
          ))
        : filteredData?.map((item, index) => (
            <AudioListItem
              animation_index={index}
              key={item.id}
              id={item.id}
              name={item.name}
              bpm={item.bpm}
              cover={item.img_url}
              is_new={item.is_new}
              music_key={
                Array.isArray(item.keys) && item.keys.length > 0
                  ? item.keys[0].key
                  : "unknown"
              }
              height={400}
              genre={
                Array.isArray(item.genres) && item.genres.length > 0
                  ? item.genres[0].genre
                  : "unknown"
              }
              producer={
                Array.isArray(item.profiles) && item.profiles.length > 0
                  ? item.profiles[0].username
                  : "unknown"
              }
            />
          ))}

      {filteredData.length === 0 && !isLoading && !error && (
        <p className="text-center text-lg col-span-full mt-5 font-satoshi text-muted-foreground">
          No beats found matching the criteria.
        </p>
      )}

      {error && <FetchError />}
    </div>
  );
}
