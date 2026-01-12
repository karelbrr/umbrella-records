"use client";

import type React from "react";
import { useForm, Controller } from "react-hook-form"; // Importujeme Controller
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, ImageIcon, Music } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";

const genres = [
  "Hip Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Jazz",
  "Classical",
  "Country",
  "Reggae",
  "Latin",
];

const musicalKeys = [
  "C Major",
  "C Minor",
  "C# Major",
  "C# Minor",
  "D Major",
  "D Minor",
  "D# Major",
  "D# Minor",
  "E Major",
  "E Minor",
  "F Major",
  "F Minor",
  "F# Major",
  "F# Minor",
  "G Major",
  "G Minor",
  "G# Major",
  "G# Minor",
  "A Major",
  "A Minor",
  "A# Major",
  "A# Minor",
  "B Major",
  "B Minor",
];

interface FormData {
  name: string;
  producer: string;
  genre: string;
  key: string;
  bpm: number | "";
  length: string;
  description: string;
  is_new: boolean;
  is_desc_ai: boolean;
  media_url: string;
  img_url: string;
}

export function TrackUploadForm() {
  const [isUploaded, setIsUploaded] = useState(false);
  // Inicializace "normálního" React Hook Formu
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      producer: "",
      genre: "",
      key: "",
      bpm: "",
      length: "",
      description: "",
      is_new: true,
      is_desc_ai: false,
      media_url: "",
      img_url: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    // Zde pošli data na server
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Track Details */}
        <div className="space-y-6">
          <Card className="bg-black">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Track Name - Používáme klasický register */}
              <div className="space-y-2">
                <Label htmlFor="name">Track Name</Label>
                <Input
                  id="name"
                  placeholder="Enter track name"
                  {...register("name", { required: "Track name is required" })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Producer */}
              <div className="space-y-2">
                <Label htmlFor="producer">Producer</Label>
                <Input
                  id="producer"
                  placeholder="Enter producer name"
                  {...register("producer", {
                    required: "Producer is required",
                  })}
                />
                {errors.producer && (
                  <p className="text-sm text-red-500">
                    {errors.producer.message}
                  </p>
                )}
              </div>

              {/* Genre and Key - Používáme Controller, protože shadcn Select není nativní input */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <Controller
                    name="genre"
                    control={control}
                    rules={{ required: "Select a genre" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.genre && (
                    <p className="text-sm text-red-500">
                      {errors.genre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 ">
                  <Label>Musical Key</Label>
                  <Controller
                    name="key"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select key" />
                        </SelectTrigger>
                        <SelectContent>
                          {musicalKeys.map((key) => (
                            <SelectItem key={key} value={key}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* BPM and Length */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bpm">BPM</Label>
                  <Input
                    id="bpm"
                    type="number"
                    placeholder="120"
                    {...register("bpm", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Input
                    id="length"
                    placeholder="3:45"
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
                  className="min-h-[120px] resize-none"
                  {...register("description")}
                />
              </div>

              {/* AI Generated Switch - Používáme Controller */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="is_desc_ai" className={`cursor-pointer ${!isUploaded && 'text-muted-foreground'}`}>
                    {!isUploaded && "Upload an audio file to use "}AI Generation
                  </Label>
                  <p className={`text-sm text-muted-foreground ${!isUploaded && 'opacity-50'}`}>
                    Use AI to draft your data automatically
                  </p>
                </div>
                <Controller
                  name="is_desc_ai"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      disabled={!isUploaded}
                      id="is_desc_ai"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Media & Status */}

        <Card className="bg-black">
          <CardHeader>
            <CardTitle>Media Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Audio Upload URL */}
            <div className="space-y-2">
              <Label>Audio File</Label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-black p-6 transition-colors hover:border-muted-foreground/50">
                <Music className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  Drag and drop your audio file
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  MP3, WAV, or FLAC (max 50MB)
                </p>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </div>
              <Input
                placeholder="Or enter audio URL"
                className="mt-2"
                {...register("media_url")}
              />
            </div>

            {/* Cover Art URL */}
            <div className="space-y-2">
              <Label>Cover Art</Label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-black p-6 transition-colors hover:border-muted-foreground/50">
                <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="mb-1 text-sm font-medium text-foreground">
                  Upload cover art
                </p>
                <p className="mb-3 text-xs text-muted-foreground">
                  PNG, JPG, or WebP (1:1 ratio recommended)
                </p>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
              </div>
              <Input
                placeholder="Or enter image URL"
                className="mt-2"
                {...register("img_url")}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black">
          <CardHeader>
            <CardTitle>Visibility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="is_new" className="cursor-pointer">
                  Mark as New Release
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display a "New" badge on this track
                </p>
              </div>
              <Controller
                name="is_new"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="is_new"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save Track</Button>
      </div>
    </form>
  );
}
