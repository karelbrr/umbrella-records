"use client";
import AudioListItem from "@/components/audio-list/audio-list-item";
import { supabase } from "@/hooks/create-client";
import FetchError from "@/components/ui/fetch-error";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface AudioListItemType {
  id: string;
  name: string;
  bpm: number;
  img_url: string;
  is_new: boolean;
  genres: { genre: string }[] | null;
  keys?: { key: string }[] | null;
  profiles?: { username: string }[] | null;
}

function RecentBeats() {
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select(
        "id,name,bpm,img_url,is_new,genres(genre),keys(key),profiles(username)"
      )
      .order("created_at", { ascending: false })
      .limit(3);

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
      profiles: item.profiles
        ? Array.isArray(item.profiles)
          ? item.profiles
          : [item.profiles]
        : [],
    }));
  }

  const { data, error, isLoading } = useQuery<AudioListItemType[]>({
    queryKey: ["latestBeats"],
    queryFn: fetchBeats,
  });

  const skeletonCount = 3;

  return (
    <section
      id="latest-beats"
      className="bg-black py-20  lg:h-screen flex justify-center  flex-col  container px-4 m-auto"
    >
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-4xl lg:text-7xl font-medium opacity-95 text-center font-satoshi"
      >
        latest beats dropped.
      </motion.h2>
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
            : data?.map((item, index) => (
                <AudioListItem
                  animation_index={index}
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
                  producer={
                    Array.isArray(item.profiles) && item.profiles.length > 0
                      ? item.profiles[0].username
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
