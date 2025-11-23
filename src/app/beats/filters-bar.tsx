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
  const { data: genres, isLoading: genresLoading } = useQuery<string[], Error>({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("genre")
        .order("genre", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => r.genre as string);
    },
  });

  // Fetch keys from Supabase
  const { data: keys, isLoading: keysLoading } = useQuery<string[], Error>({
    queryKey: ["keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("keys")
        .select("key")
        .order("key", { ascending: true });
      if (error) throw error;
      return (data || []).map((r: any) => r.key as string);
    },
  });

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
          <SelectTrigger className="h-11 space-x-1 bg-none border-border">
            <SelectValue placeholder={genresLoading ? "Loading..." : "Genre"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Genres</SelectItem>
            {genres?.map((g: string) => (
              <SelectItem key={g} value={g}>
                {g}
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
          <SelectTrigger className="h-11 space-x-1 bg-none border-border">
            <SelectValue placeholder={keysLoading ? "Loading..." : "Key"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Keys</SelectItem>
            {keys?.map((k: string) => (
              <SelectItem key={k} value={k}>
                {k}
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
          <SelectTrigger className="h-11 space-x-1 font-satoshi bg-none border-border col-span-2">
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
