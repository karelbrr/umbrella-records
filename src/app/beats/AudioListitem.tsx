"use client";
interface Props {
  id: string;
  itemsPerRow: number;
  name: string;
  bpm: number;
  genre?: string;
}

import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AudioListItem({ itemsPerRow, name, bpm, id, genre }: Props) {
  return (
    <a href={`/beats/${id}`}>
      <div className="group relative overflow-hidden h-auto bg-card/30 border border-border transition-all ">
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={"/images/missing-image.png"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/60">
            <a href={`/beats/${id}`}>
              <Button
                size="icon"
                className="h-14 w-14 rounded-full bg-white text-black opacity-0 transition-all group-hover:opacity-100 hover:scale-110"
              >
                <Play className="h-6 w-6 fill-current" />
              </Button>
            </a>
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 text-sm font-satoshi">
            new
          </div>
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
            <span>Dm</span>
            <span>•</span>
            <span>{genre}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
