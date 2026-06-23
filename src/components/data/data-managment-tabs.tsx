"use client"
import { useSongFormOptions } from "@/hooks/use-song-options";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Loader2, Music, Tag } from "lucide-react";
import { GenresTab } from "@/components/data/genres-tab";
import { KeysTab } from "@/components/data/keys-tab";
import { TagsTab } from "@/components/data/tags-tab";

export function DataManagmentTabs() {
  const {
    genres,
    keys,
    tags: allTags,
    isLoading: areSelectsLoading,
  } = useSongFormOptions();

  if (areSelectsLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="genres" className="space-y-6">
      <TabsList className="bg-black border-border/20">
        <TabsTrigger value="genres" className="gap-2">
          <Layers className="size-4" /> Genres
        </TabsTrigger>
        <TabsTrigger value="keys" className="gap-2">
          <Music className="size-4" /> Keys
        </TabsTrigger>
        <TabsTrigger value="tags" className="gap-2">
          <Tag className="size-4" /> Tags
        </TabsTrigger>
      </TabsList>

      <TabsContent value="genres">
        <GenresTab data={genres || []} />
      </TabsContent>
      <TabsContent value="keys">
        <KeysTab data={keys || []} />
      </TabsContent>
      <TabsContent value="tags">
        <TagsTab data={allTags || []} />
      </TabsContent>
    </Tabs>
  );
}
