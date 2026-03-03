"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/hooks/createClient";
import { useSongFormOptions } from "@/hooks/useSongOptions";

interface FiltersBarProps {
  beatsFilters?: {
    genre?: string;
    key?: string;
    sortBy?: string;
    search?: string;
  };
  setBeatsFilters: (value: any) => void;
}

export function FiltersBar({ beatsFilters, setBeatsFilters }: FiltersBarProps) {
  const { genres, keys, isLoading: areSelectsLoading } = useSongFormOptions();

  useEffect(() => {
    console.log(beatsFilters);
  }, [beatsFilters]);

  return (
    <div className="space-y-4 mt-2">
      {/* Search */}
      <div className="relative bg-none">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search beats, artists, tags..."
          type="text"
          value={beatsFilters?.search || ""}
          onChange={(e) =>
            setBeatsFilters((prev: any) => ({
              ...prev,
              search: e.target.value,
            }))
          }
          className="pl-12 h-12 !bg-none border-border text-base"
        />
      </div>

      {/* Filters Row */}
      <div className="flex  space-x-3">
        <Select
          value={beatsFilters?.genre}
          onValueChange={(v) =>
            setBeatsFilters((prev: any) => ({ ...(prev || {}), genre: v }))
          }
          defaultValue={"none"}
        >
          <SelectTrigger
            className="h-11 space-x-1 bg-none border-border"
            aria-label="Genre"
          >
            <SelectValue placeholder={areSelectsLoading ? "Loading..." : "Genre"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Genres</SelectItem>
            {genres?.map((g: any) => (
              <SelectItem key={String(g?.id ?? g)} value={String(g?.name ?? g?.genre ?? g)}>
                {g?.name ?? g?.genre ?? g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={beatsFilters?.key}
          onValueChange={(v) =>
            setBeatsFilters((prev: any) => ({ ...(prev || {}), key: v }))
          }
          defaultValue={"none"}
        >
          <SelectTrigger
            className="h-11 space-x-1 bg-none border-border"
            aria-label="Key"
          >
            <SelectValue placeholder={areSelectsLoading ? "Loading..." : "Key"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Keys</SelectItem>
            {keys?.map((k: any) => (
              <SelectItem key={String(k?.id ?? k)} value={String(k?.name ?? k?.key ?? k)}>
                {k?.name ?? k?.key ?? k}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={beatsFilters?.sortBy}
          defaultValue="none"
          onValueChange={(v) =>
            setBeatsFilters((prev: any) => ({ ...(prev || {}), sortBy: v }))
          }
        >
          <SelectTrigger
            className="h-11 space-x-1 font-satoshi bg-none border-border col-span-2"
            aria-label="Sort by"
          >
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Default Sort</SelectItem>

            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="bpm-asc">BPM ↑</SelectItem>
            <SelectItem value="bpm-desc">BPM ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
