"use client";

import AudioListItem from "@/app/beats/audio-list-item";
import { supabase } from "@/hooks/createClient";
import FetchError from "@/components/fetch-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface AudioListItemType {
  id: string;
  name: string;
  bpm: number;
  img_url: string;
  is_new: boolean;
  genres: { genre: string }[] | null;
  keys?: { key: string }[] | null;
}

function RecentBeats() {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select("id,name,bpm,img_url,is_new,genres(genre),keys(key)");

    if (error) throw new Error(error.message);

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
    queryKey: ["latestBeats"],
    queryFn: fetchBeats,
  });

  const skeletonCount = 3;

  return (
    <section className="bg-black py-20 lg:px-0 lg:h-screen flex justify-center  flex-col  container px-4 m-auto">
      <h2 className="text-4xl lg:text-7xl font-medium opacity-95 text-center font-satoshi">
        latest beats dropped.
      </h2>
      <section className="container mt-10 bg-black">
        <div className={`grid grid-cols-1 space-y-5 md:grid-cols-3   gap-x-7 `}>
          {isLoading || error
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i} className={`flex flex-col  items-start `}>
                  <Skeleton className="w-full h-[480px] rounded-none" />
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
    </section>
  );
}

export default RecentBeats;
