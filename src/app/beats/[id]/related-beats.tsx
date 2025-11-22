"use client";
import { supabase } from "@/hooks/createClient";
import FetchError from "@/components/fetch-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import AudioListItem from "../audio-list-item";
import { useParams } from "next/navigation";

interface AudioListItemType {
  id: string;
  name: string;
  bpm: number;
  img_url: string;
  is_new: boolean;
  genres: { genre: string }[] | null;
  keys?: { key: string }[] | null;
}

function RelatedBeats() {
  const { id } = useParams();

  async function fetchBeats() {
    if (!id) return [];
    const { data, error } = await supabase
      .from("beats_tracks")
      .select("id,name,bpm,img_url,is_new,genres(genre),keys(key)")
      .neq("id", id);

    if (error) throw new Error(error.message);

    if (!data) return [];

    return data.map((item) => ({
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
    }));
  }

  const { data, error, isLoading } = useQuery<AudioListItemType[]>({
    queryKey: ["relatedBeats"],
    queryFn: fetchBeats,
  });

  const skeletonCount = 10;
  return (
    <section className="container m-auto px-4 pt-[10vh]  bg-black">
      <h1 className="text-[44px] font-satoshi text-white font-semibold tracking-tight line-clamp-1 font-satoshi">
        related beats
      </h1>
      <div
        className={`grid grid-cols-1 space-y-5 md:grid-cols-3 lg:grid-cols-5 gap-x-7 mt-5 min-h-[83vh]`}
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
          : data?.map((item) => (
              <AudioListItem
                key={item.id}
                id={item.id}
                name={item.name}
                bpm={item.bpm}
                cover={item.img_url}
                is_new={item.is_new}
                genre={
                  Array.isArray(item.genres) && item.genres.length > 0
                    ? item.genres[0].genre
                    : "unknown"
                }
                music_key={
                  Array.isArray(item.keys) && item.keys.length > 0
                    ? item.keys[0].key
                    : "unknown"
                }
              />
            ))}

        {error && <FetchError />}
      </div>
    </section>
  );
}

export default RelatedBeats;
