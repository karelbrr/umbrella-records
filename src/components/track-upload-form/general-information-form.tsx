import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import { useSongFormOptions } from "@/hooks/use-song-options";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { uploadFileToSupabase } from "@/hooks/upload";
import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";
import { supabase } from "@/hooks/create-client";
import { useQuery } from "@tanstack/react-query";

export function GeneralInformationForm({
  errors,
  control,
  register,
  isUploaded,
  setValue,
  audioFile,
  setIsGenerating,
  setIsGenerated,
  isGenerated,
}: {
  errors: any;
  control: any;
  register: any;
  isUploaded: boolean;
  setValue: any;
  audioFile: File | null;
  setIsGenerating: any;
  setIsGenerated: any;
  isGenerated: boolean;
}) {
  const {
    genres,
    keys,
    tags: allTags,
    isLoading: areSelectsLoading,
  } = useSongFormOptions();

  const handleAiGeneration = async (isChecked: boolean) => {
    if (!isChecked) return;

    if (!audioFile) {
      toast.error("Audio file is missing.");
      setValue("is_desc_ai", false);
      return;
    }

    setIsGenerating(true);
    toast.info("Uploading & Analyzing... This might take a minute.");

    try {
      const uploadedAudioUrl = await uploadFileToSupabase(audioFile, "tracks");
      setValue("media_url", uploadedAudioUrl, { shouldValidate: true });

      const genreNames = genres.map((g) => g.name);
      const tagNames = allTags ? allTags.map((t) => t.tag_title) : [];

      const response = await fetch("/api/generate-audio-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioUrl: uploadedAudioUrl,
          allowedGenres: genreNames,
          allowedTags: tagNames,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }
      const { name, bpm, key, genre, description, tags } = data.aiMetadata;

      const matchedGenre = genres.find((g) => {
        const dbName = g.name.toLowerCase().replace(/[^a-z0-9]/g, "");
        const aiName = genre.toLowerCase().replace(/[^a-z0-9]/g, "");
        return dbName === aiName;
      });

      if (matchedGenre) {
        setValue("genre", String(matchedGenre.id), {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        console.warn("AI returned genre not found in DB:", genre);
      }

      const matchedKey = keys.find(
        (k) => k.name.toLowerCase() === key.toLowerCase(),
      );
      if (matchedKey)
        setValue("key", String(matchedKey.id), {
          shouldValidate: true,
          shouldDirty: true,
        });

      if (tags && Array.isArray(tags) && allTags) {
        const matchedTagIds = tags
          .map((aiTagName: string) => {
            // Robustní porovnání (lowercase + trim)
            const foundTag = allTags.find(
              (dbTag) =>
                dbTag.tag_title.toLowerCase().trim() ===
                aiTagName.toLowerCase().trim(),
            );
            return foundTag ? foundTag.id : null;
          })
          .filter((id) => id !== null); // Odstraníme tagy, které jsme v DB nenašli

        // Nastavení do react-hook-form
        setValue("tags", matchedTagIds, {
          shouldValidate: true,
          shouldDirty: true,
        });

        if (matchedTagIds.length === 0) {
          console.warn(
            "AI returned tags, but none matched your database titles:",
            tags,
          );
        }
      }

      if (bpm)
        setValue("bpm", bpm, { shouldValidate: true, shouldDirty: true });
      if (description)
        setValue("description", description, {
          shouldValidate: true,
          shouldDirty: true,
        });

      if (name)
        setValue("name", name, { shouldValidate: true, shouldDirty: true });

      toast.success("AI Generation complete!");
      setIsGenerated(true);
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      toast.error(`Failed to generate metadata: ${error.message}`);
      setValue("is_desc_ai", false);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-black h-full">
      <CardHeader>
        <CardTitle>General Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Track Name</Label>
          <Input
            id="name"
            placeholder="Enter track name"
            {...register("name", {
              required: "Track name is required",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Genre</Label>
            <Controller
              name="genre"
              control={control}
              rules={{
                required: "Select a genre",
              }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={areSelectsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        areSelectsLoading ? "Loading..." : "Select a Genre"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre.id} value={String(genre.id)}>
                        {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.genre && (
              <p className="text-sm text-red-500">{errors.genre.message}</p>
            )}
          </div>

          <div className="space-y-2 ">
            <Label>Musical Key</Label>
            <Controller
              name="key"
              control={control}
              rules={{
                required: "Select a key",
              }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={areSelectsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        areSelectsLoading ? "Loading..." : "Select a Key"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {keys.map((key) => (
                      <SelectItem key={key.id} value={String(key.id)}>
                        {key.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.key && (
              <p className="text-sm text-red-500">{errors.key.message}</p>
            )}
          </div>
        </div>

        {/* BPM and Length */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="bpm">BPM</Label>
            <Input
              id="bpm"
              type="number"
              placeholder="e.g. 120"
              min={20}
              max={300}
              {...register("bpm", {
                required: "BPM is required",
                valueAsNumber: true,
                min: {
                  value: 20,
                  message: "Minimum BPM is 20",
                },
                max: {
                  value: 300,
                  message: "Maximum BPM is 300",
                },
              })}
              onKeyDown={(e) =>
                ["-", "e", "E", "+"].includes(e.key) && e.preventDefault()
              }
            />

            {errors.bpm && (
              <p className="text-sm text-red-500">{errors.bpm.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="length">Length</Label>
            <Input
              id="length"
              disabled={true}
              placeholder="0:00"
              {...register("length")}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the track..."
            className="min-h-[120px] !bg-black resize-none"
            {...register("description", {
              required: "Description is required",
            })}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* AI Generated Switch - Používáme Controller */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label
              htmlFor="is_desc_ai"
              className={`cursor-pointer ${!isUploaded && "text-muted-foreground"}`}
            >
              {!isUploaded && "Upload a beat to use "}AI Generation{" "}
              <Badge
                variant="outline"
                className={`border-purple-500 text-purple-400 ${!isUploaded && "opacity-50"}`}
              >
                <Sparkles className="mr-0.5 h-3 w-3" /> Beta
              </Badge>
            </Label>
            <p
              className={`text-sm text-muted-foreground ${!isUploaded && "opacity-50"}`}
            >
              Use AI to draft your data automatically
            </p>
          </div>
          <Controller
            name="is_desc_ai"
            control={control}
            render={({ field }) => (
              <Switch
                disabled={!isUploaded || isGenerated}
                id="is_desc_ai"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  handleAiGeneration(checked);
                }}
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
