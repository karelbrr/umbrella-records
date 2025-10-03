"use client";
import { AudioDetailHeader } from "./AudioDetailHeader";
import { supabase } from "@/app/createClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";

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
}

function Page() {
  const [isAudioPlayerShown, setIsAudioPlayerShown] = useState<boolean>(true);
  const { id } = useParams();
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_track")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  const { data, error, isLoading } = useQuery<AudioDetails>({
    queryKey: ["beats", id],
    queryFn: fetchBeats,
  });

  return (
    <section className="px-32 pt-[10vh] h-[90vh] bg-black">
      <AudioDetailHeader
        data={data ? data : ({} as AudioDetails)}
        isLoading={isLoading}
        error={error}
        setIsAudioPlayerShown={setIsAudioPlayerShown}
      />
      <h3 className="text-[44px] mt-10  font-extralight font-satoshi text-zinc-300">
        related beats
      </h3>
      <div className={`grid gap-x-10 grid-cols-5`}></div>

      {isAudioPlayerShown && (
        <AudioPlayer media_url={data?.media_url} isLoading={isLoading} />
      )}
    </section>
  );
}

export default Page;
