"use client";
import { Button } from "@/components/ui/button";
import { supabase } from "@/hooks/create-client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import FetchError from "@/components/ui/fetch-error";
import { getDaysSinceUpload } from "@/lib/get-beat";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

import { Play, Calendar, Clock, Pause } from "lucide-react";
import { usePlayer } from "@/components/context/player-context";

export interface AudioDetails {
  id: string;
  created_at: string | number | Date;
  name: string | null;
  media_url: string;
  bpm: number | null;
  key: string | null;
  length: string | null;
  producer: string | null;
  profiles: { username: string } | null;
  img_url: string | null;
  description: string | null;
  is_desc_ai: boolean | null;
  is_new: boolean | null;
  genres: { genre: string } | null;
  keys: { key: string } | null;
  beat_tags: {
    tags: {
      tag_title: string;
    };
  }[];
}

export function BeatDetails() {
  const { id } = useParams();
  async function fetchBeats() {
    const { data, error } = await supabase
      .from("beats_tracks")
      .select(
        `
      *,
      genres(genre),
      keys(key),
      profiles(username),
      beat_tags (
        tags (
          tag_title
        )
      )
    `,
      )
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  const { data, error, isLoading } = useQuery<AudioDetails>({
    queryKey: ["beatsForBeatsDetails", id],
    queryFn: fetchBeats,
  });

  const { playBeat, togglePlay, isPlaying } = usePlayer();

  return (
    <div className="pb-2">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 md:pt-20">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Cover Art - with entrance animation */}
          <div className="space-y-6 ">
            <div className="relative aspect-square overflow-hidden">
              {isLoading || error ? (
                <Skeleton className="w-full h-full " />
              ) : (
                <Image
                  src={data?.img_url || ""}
                  alt={data?.name || "Beat Cover"}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            {/* Mobile Play Button */}
          </div>

          {/* Beat Info - with entrance animation */}
          <div className="space-y-8  ">
            {/* Title & Artist */}
            <div className="space-y-3">
              {isLoading || error ? (
                <Skeleton className=" w-1/2 lg:w-[500px] h-14 mt-2" />
              ) : (
                <h1 className="text-5xl md:text-6xl  lg:text-7xl font-satoshi tracking-tighter text-balance leading-none">
                  {data?.name}
                </h1>
              )}

              {isLoading || error ? (
                <Skeleton className="w-[100px] h-8 mt-[20px] " />
              ) : (
                <p className="text-2xl text-muted-foreground  font-satoshi font-medium">
                  {data?.profiles?.username ?? "none"}
                </p>
              )}
            </div>

            {/* Price & Actions */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex gap-3 flex-1">
                {isPlaying ? (
                  <Button
                    size="lg"
                    disabled={isLoading || !!error}
                    onClick={togglePlay}
                    className="gap-2 h-12 px-8 text-base font-satoshi font-semibold"
                  >
                    <Pause className="h-5 w-5 fill-current" />
                    Pause
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    disabled={isLoading || !!error}
                    onClick={() => data && playBeat(data)}
                    className="gap-2 h-12 px-8 text-base font-satoshi font-semibold"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Play
                  </Button>
                )}

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
              <div className="space-y-2 p-4 bg-black border border-border">
                <div className="text-sm text-muted-foreground ">BPM</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-7 mt-3 " />
                ) : (
                  <div className="text-3xl font-bold ">{data?.bpm}</div>
                )}
              </div>
              <div className="space-y-2 p-4 bg-black border border-border">
                <div className="text-sm text-muted-foreground ">KEY</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-7 mt-3 " />
                ) : (
                  <div className="text-3xl font-bold">{data?.keys?.key}</div>
                )}
              </div>
              <div className="space-y-2 p-4 bg-black border border-border">
                <div className="text-sm text-muted-foreground ">GENRE</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-7 mt-3 " />
                ) : (
                  <div className="text-xl font-bold">
                    {data?.genres?.genre || "unknown"}
                  </div>
                )}
              </div>
              <div className="space-y-2 p-4 bg-black border border-border">
                <div className="text-sm text-muted-foreground ">DURATION</div>
                {isLoading || error ? (
                  <Skeleton className="w-[80px] h-7 mt-3 " />
                ) : (
                  <div className="text-xl font-bold ">{data?.length}</div>
                )}
              </div>
            </div>

            {/* Tags */}
            {(isLoading || (data?.beat_tags && data.beat_tags.length > 0)) && (
              <div className="space-y-2">
                <h2 className="text-xl font-bold font-satoshi tracking-tight">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2 pt-2">
                  {isLoading ? (
                    <>
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-16" />
                      <Skeleton className="h-9 w-28" />
                    </>
                  ) : (
                    data?.beat_tags?.map((item, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-accent/10 border border-border font-satoshi text-sm"
                      >
                        {item.tags.tag_title}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {isLoading || error ? (
              <div className="pt-4">
                <Skeleton className="lg:w-[300px] h-6" />
                <div className="flex flex-col space-y-3">
                  <Skeleton className="w-full h-5 mt-3" />
                  <Skeleton className="w-full h-5" />
                  <Skeleton className="w-3/4 lg:w-[500px] h-5" />
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                <div className="flex space-x-2">
                  <h2 className="text-xl font-bold font-satoshi tracking-tight">
                    About This Beat
                  </h2>
                  {data?.is_desc_ai && (
                    <Badge variant={"outline"} className="bg-violet-950 ">
                      Generated by Ai
                    </Badge>
                  )}
                </div>
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

      {/* Error Alert */}
      {error && <FetchError />}
    </div>
  );
}
