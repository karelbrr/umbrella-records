"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSongFormOptions } from "@/hooks/use-song-options";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface FiltersBarProps {
  beatsFilters?: {
    genre?: string;
    key?: string;
    sortBy?: string;
    search?: string;
    tags?: string[];
  };
  setBeatsFilters: (value: any) => void;
}

export function FiltersBar({ beatsFilters, setBeatsFilters }: FiltersBarProps) {
  const {
    genres,
    keys,
    tags: allTags,
    isLoading: areSelectsLoading,
  } = useSongFormOptions();

  const [localSearch, setLocalSearch] = useState(beatsFilters?.search || "");

  useEffect(() => {
    setLocalSearch(beatsFilters?.search || "");
  }, [beatsFilters?.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== (beatsFilters?.search || "")) {
        setBeatsFilters((prev: any) => ({
          ...prev,
          search: localSearch,
        }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, setBeatsFilters]);

  const handleTagToggle = (tagId: string) => {
    setBeatsFilters((prev: any) => {
      const currentTags = prev?.tags || [];
      const isSelected = currentTags.includes(tagId);

      return {
        ...prev,
        tags: isSelected
          ? currentTags.filter((id: string) => id !== tagId)
          : [...currentTags, tagId],
      };
    });
  };

  const clearTags = () => {
    setBeatsFilters((prev: any) => ({
      ...prev,
      tags: [],
    }));
  };

  return (
    <div className="space-y-4 mt-2">
      {/* Search */}
      <div className="relative bg-none">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search beats, artists, tags..."
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-12 h-12 !bg-none border-border text-base"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap space-y-3 md:space-y-0 space-x-3">
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
            <SelectValue
              placeholder={areSelectsLoading ? "Loading..." : "Genre"}
            />
          </SelectTrigger>
          <SelectContent data-lenis-prevent>
            <SelectItem value="none">All Genres</SelectItem>
            {genres?.map((g: any) => (
              <SelectItem
                key={String(g?.id ?? g)}
                value={String(g?.name ?? g?.genre ?? g)}
              >
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
            <SelectValue
              placeholder={areSelectsLoading ? "Loading..." : "Key"}
            />
          </SelectTrigger>
          <SelectContent data-lenis-prevent className="max-h-[400px]">
            <SelectItem value="none">All Keys</SelectItem>
            {keys?.map((k: any) => (
              <SelectItem
                key={String(k?.id ?? k)}
                value={String(k?.name ?? k?.key ?? k)}
              >
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-9 space-x-2 font-satoshi !bg-black !border-border col-span-2 justify-between"
            >
              <div className="flex items-center">
                <span>Tags</span>
                {beatsFilters?.tags && beatsFilters.tags.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-2 h-5 px-1.5 py-0 text-[10px] bg-accent text-accent-foreground"
                  >
                    {beatsFilters.tags.length}
                  </Badge>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-60 p-0 bg-black border-border"
            align="start"
          >
            <div className="p-3 border-b border-border">
              <h4 className="font-medium leading-none font-satoshi">
                Filter by Tags
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Select one or more vibes.
              </p>
            </div>

            <ScrollArea className="h-[250px] p-2" data-lenis-prevent>
              <div className="space-y-1">
                {allTags?.map((tag) => {
                  const isSelected = beatsFilters?.tags?.includes(tag.id);
                  return (
                    <div
                      key={tag.id}
                      onClick={() => handleTagToggle(tag.id)}
                      className="flex items-center space-x-2 rounded-sm px-2 py-1.5 cursor-pointer hover:bg-accent/10 transition-colors"
                    >
                      <Checkbox
                        id={`filter-${tag.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                        className="border-muted-foreground"
                      />
                      <label
                        htmlFor={`filter-${tag.id}`}
                        className="text-sm font-satoshi leading-none cursor-pointer flex-grow"
                        onClick={(e) => e.preventDefault()}
                      >
                        {tag.tag_title}
                      </label>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {beatsFilters?.tags && beatsFilters.tags.length > 0 && (
              <div className="p-2 border-t border-border">
                <Button
                  onClick={clearTags}
                  variant="ghost"
                  className="w-full h-8 text-xs font-satoshi hover:bg-red-500/10 hover:text-red-500"
                >
                  Clear tags
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
