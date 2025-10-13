"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Play,
  ShoppingCart,
  Calendar,
  Clock,
  Music2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/app/createClient";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import AudioPlayer from "@/components/AudioPlayer";
import FetchError from "@/components/FetchError";
import { getDaysSinceUpload } from "@/lib/get-beat";
import { Skeleton } from "@/components/ui/skeleton";

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
  description: string | null;
  genres: { genre: string } | null;
}

function Page() {
  const [isAudioPlayerShown, setIsAudioPlayerShown] = useState<boolean>(false);
  const { id } = useParams();
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select("*,genres(genre)")
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
    <div className="min-h-screen bg-black pb-32  pt-[5vh]">


      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Cover Art - with entrance animation */}
          <div className="space-y-6 ">
            <div className="relative aspect-square overflow-hidden bg-muted border border-border shadow-2xl">
              <Image
                src={data?.img_url || "/images/missing-image.png"}
                alt={data?.name || "Beat Cover"}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Mobile Play Button */}
            <div className="md:hidden flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2 h-14 text-lg font-semibold"
              >
                <Play className="h-5 w-5 fill-current" />
                Play
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 h-14 px-8 bg-transparent"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Beat Info - with entrance animation */}
          <div className="space-y-8  ">
            {/* Title & Artist */}
            <div className="space-y-3">
              {isLoading || error ? (
                <Skeleton className="w-[500px] h-14 mt-2" />
              ) : (
                <h1 className="text-5xl md:text-6xl  lg:text-7xl font-satoshi tracking-tighter text-balance leading-none">
                  {data?.name}
                </h1>
              )}

              {isLoading || error ? (
                <Skeleton className="w-[100px] h-8 mt-[20px] " />
              ) : (
                <p className="text-2xl text-muted-foreground  font-satoshi font-medium">
                  {/* {data?.producer} */} 2mjz
                </p>
              )}
            </div>

            {/* Price & Actions */}
            <div className="flex items-center gap-4 pt-4">
              {/* <div className="text-4xl font-bold font-mono">$20</div> */}
              <div className="hidden md:flex gap-3 flex-1">
                <Button
                  size="lg"
                  disabled={isLoading}
                  className="gap-2 h-12 px-8 text-base font-satoshi font-semibold"
                >
                  <Play className="h-5 w-5 fill-current" />
                  Play
                </Button>
                {/* <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 h-12 px-8 bg-transparent"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Purchase
                </Button> */}
              </div>
            </div>

            {/* Beat Specs Grid */}
            <div className="grid grid-cols-2 font-satoshi gap-4 pt-4">
              <div className="space-y-2 p-4 bg-card/30 border border-border">
                <div className="text-sm text-muted-foreground ">BPM</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-8 mt-3 " />
                ) : (
                  <div className="text-3xl font-bold ">{data?.bpm}</div>
                )}
              </div>
              <div className="space-y-2 p-4 bg-card/30 border border-border">
                <div className="text-sm text-muted-foreground ">KEY</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-8 mt-3 " />
                ) : (
                  <div className="text-3xl font-bold">{data?.key}</div>
                )}
              </div>
              <div className="space-y-2 p-4 bg-card/30 border border-border">
                <div className="text-sm text-muted-foreground ">GENRE</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-8 mt-3 " />
                ) : (
                  <div className="text-xl font-bold">
                    {data?.genres?.genre || "unknown"}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4 bg-card/30 border border-border">
                <div className="text-sm text-muted-foreground ">DURATION</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-8 mt-3 " />
                ) : (
                  <div className="text-xl font-bold ">{data?.length}</div>
                )}
              </div>
            </div>

            {/* Tags */}
            {/* <div className="flex flex-wrap gap-2 pt-2">
              {beat.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-accent/10 border border-accent/20 text-accent text-sm font-mono uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div> */}

            {/* Description */}
            {isLoading || error ? (
              <div className="pt-4">
                <Skeleton className="w-[300px] h-6" />
                <div className="flex flex-col space-y-3">
                  <Skeleton className="w-full h-5 mt-3" />
                  <Skeleton className="w-full h-5" />
                  <Skeleton className="w-[500px] h-5" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                <h2 className="text-xl font-bold font-satoshi tracking-tight">
                  About This Beat
                </h2>
                <p className="text-muted-foreground font-satoshi leading-relaxed text-lg">
                  {data?.description || "--"} 
                </p>
              </div>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 pt-4 text-sm font-satoshi text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {typeof data?.created_at === "string" ||
                  data?.created_at instanceof Date
                    ? getDaysSinceUpload(data.created_at as string | Date)
                    : "--"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{data?.length || "--"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Beats Section */}

      {/* Error Alert */}
      {error && <FetchError />}

      {/* Audio Player */}
      {isAudioPlayerShown && (
        <AudioPlayer
          media_url={data?.media_url}
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}

export default Page;
