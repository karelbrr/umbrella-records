"use client";
interface Props {
  id: string;
  name: string;
  bpm: number;
  cover?: string;
  genre?: string;
  is_new?: boolean;
  music_key?: string;
  height?: number;
}

import Image from "next/image";
import { Play } from "lucide-react";

export default function AudioListItem({
  name,
  bpm,
  id,
  cover,
  genre,
  is_new,
  music_key,
  height,
}: Props) {
  return (
    <a
      href={`/beats/${id}`}
      className={`${height ? "lg:h-[400px]" : "h-auto"}`}
    >
      <div className="group relative overflow-hidden  bg-card/30 border border-border transition-all ">
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={cover || "/images/missing-image.png"}
            alt={name || "Beat Cover"}
            width={height ? 400 : 500}
            height={height ? 400 : 500}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/60">
            <Play className="h-6 w-6 fill-current opacity-0 transition-all group-hover:opacity-100 " />
          </div>

          {/* Price Badge */}
          {is_new && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 text-sm font-satoshi">
              new
            </div>
          )}
        </div>

        {/* Beat Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg tracking-tight line-clamp-1 font-satoshi">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground font-satoshi">{bpm}</p>

          {/* Beat Details */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-satoshi pt-2">
            <span>{bpm} BPM</span>
            <span>•</span>
            <span>{music_key}</span>
            <span>•</span>
            <span>{genre}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
