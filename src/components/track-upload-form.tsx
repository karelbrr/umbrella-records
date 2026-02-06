"use client";
import { toast } from "sonner";
import { useRef } from "react";
import { useForm, Controller, set } from "react-hook-form";
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
import { Upload, ImageIcon, Music, FileAudio, X } from "lucide-react";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { supabase } from "@/hooks/createClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./context/auth-provider";
import { useSortedKeys } from "@/hooks/useSortedKeys";

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

type SelectItem = {
  id: number;
  name: string;
};

export function TrackUploadForm() {
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user } = useAuth();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      producer: user?.id || "",
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

  const mediaUrlValue = watch("media_url");
  const isUrlEntered = mediaUrlValue && mediaUrlValue.length > 0 ? true : false;

  const { data: genresData = [], isLoading: genresLoading } = useQuery<
    SelectItem[]
  >({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("genres")
        .select("genre,id")
        .order("genre", { ascending: true });
      if (error) throw new Error(error.message);
      return data ? data.map((g: any) => ({ id: g.id, name: g.genre })) : [];
    },
  });

  const { data: keysData = [], isLoading: keysLoading } = useQuery<
    SelectItem[]
  >({
    queryKey: ["keys"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("keys")
        .select("key,id")
        .order("key", { ascending: true });
      if (error) throw new Error(error.message);
      return data ? data.map((k: any) => ({ id: k.id, name: k.key })) : [];
    },
  });

  const genresToUse = genresData && genresData.length > 0 ? genresData : [];
  const keysToUse = keysData && keysData.length > 0 ? keysData : [];
  const sortedKeys = useSortedKeys(keysToUse);

  const onSubmit = (data: FormData) => {
    const hasAudio =
      fileName || (data.media_url && data.media_url.trim().length > 0);

    const hasImage =
      imageFileName || (data.img_url && data.img_url.trim().length > 0);

    if (!hasAudio || !hasImage) {
      toast.error("Please provide both an audio file and cover art.");
      return;
    }

    createSongMutation.mutate(data);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleAudioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const allowedExt = /\.(mp3|wav|flac)$/i;

    if (!file) return;

    // Validate extension
    if (!allowedExt.test(file.name)) {
      setUploadError("Only MP3, WAV or FLAC files are allowed.");
      setFileName(null);
      setIsUploaded(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Clear previous errors
    setUploadError(null);

    setFileName(file.name);

    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);

    audio.onloadedmetadata = () => {
      const duration = audio.duration;

      const formattedLength = formatTime(duration);
      setValue("length", formattedLength, { shouldValidate: true });

      setIsUploaded(true);
      URL.revokeObjectURL(objectUrl);
    };

    audio.onerror = () => {
      setFileName(null);
      setIsUploaded(false);
      URL.revokeObjectURL(objectUrl);
      setUploadError("Error loading audio file.");
    };
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
    setIsUploaded(false);
    setValue("length", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const imgUrlValue = watch("img_url");
  const isImgUrlEntered = !!(imgUrlValue && imgUrlValue.length > 0);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFileName(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  const queryClient = useQueryClient();
  const createSongMutation = useMutation({
    mutationFn: async (newSongData: FormData) => {
      const { data, error } = await supabase
        .from("beats_tracks")
        .insert([
          {
            name: newSongData.name,
            bpm: newSongData.bpm,
            key: newSongData.key,
            genre: newSongData.genre,
            length: newSongData.length,
            media_url: newSongData.media_url,
            img_url: newSongData.img_url,
            description: newSongData.description,
            is_new: newSongData.is_new,
            is_desc_ai: newSongData.is_desc_ai,
          },
        ])
        .select();

      if (error) throw new Error(error.message);
      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      toast.success("Song created successfully");
      reset();
    },

    onError: (error) => {
      toast.error(`Chyba při ukládání: ${error.message}`);
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Track Details */}
        <div className="space-y-6 ">
          <Card className="bg-black h-full">
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
                        disabled={genresLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              keysLoading ? "Loading..." : "Select a Genre"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {genresToUse.map((genre) => (
                            <SelectItem key={genre.id} value={genre.id}>
                              {genre.name}
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
                    rules={{ required: "Select a key" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={keysLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              keysLoading ? "Loading..." : "Select a Key"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {sortedKeys.map((key) => (
                            <SelectItem key={key.id} value={key.id}>
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
                  <Input id="length" disabled={true} placeholder="0:00" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the track..."
                  className="min-h-[120px] resize-none"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* AI Generated Switch - Používáme Controller */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="is_desc_ai"
                    className={`cursor-pointer ${
                      !isUploaded && "text-muted-foreground"
                    }`}
                  >
                    {!isUploaded && "Upload an audio file to use "}AI Generation
                  </Label>
                  <p
                    className={`text-sm text-muted-foreground ${
                      !isUploaded && "opacity-50"
                    }`}
                  >
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
            <div className="space-y-2 h-[270px]">
              <Label>Audio File</Label>

              <input
                type="file"
                accept="audio/*"
                className="hidden"
                ref={fileInputRef}
                disabled={isUrlEntered}
                onChange={handleAudioChange}
              />

              <div
                onClick={() => !fileName && fileInputRef.current?.click()}
                className={`flex flex-col  items-center justify-center rounded-lg border-2 border-dashed py-6 px-4 transition-colors 
              ${
                fileName
                  ? "border-primary/25 mt-5  bg-primary/5 cursor-default"
                  : isUrlEntered
                  ? "border-muted-foreground/10 bg-muted/5 opacity-50 cursor-not-allowed"
                  : "border-muted-foreground/25 bg-black hover:border-muted-foreground/50 cursor-pointer hover:bg-muted/10"
              }`}
              >
                {fileName ? (
                  <div className="flex w-full items-center justify-between ">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileAudio className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ready to upload
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Music className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="mb-1 text-sm font-medium text-foreground">
                      {isUrlEntered
                        ? "Audio URL entered below"
                        : "Drag and drop your audio file"}
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      MP3, WAV, or FLAC (max 50MB)
                    </p>
                    {uploadError && (
                      <p className="mb-3 text-xs text-red-500">{uploadError}</p>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUrlEntered}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Browse Files
                    </Button>
                  </>
                )}
              </div>

              <Input
                placeholder="Or enter audio URL"
                className="mt-2"
                disabled={!!fileName}
                {...register("media_url")}
              />
            </div>

            {/* Cover Art URL */}
            <div className="space-y-2 h-[270px]">
              <Label>Cover Art</Label>

              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                ref={imageInputRef}
                disabled={isImgUrlEntered}
                onChange={handleImageChange}
              />

              <div
                onClick={() =>
                  !imageFileName &&
                  !isImgUrlEntered &&
                  imageInputRef.current?.click()
                }
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-6 px-4 transition-colors 
      ${
        imageFileName
          ? "border-primary/25 mt-5 bg-primary/5 cursor-default"
          : isImgUrlEntered
          ? "border-muted-foreground/10 bg-muted/5 opacity-50 cursor-not-allowed"
          : "border-muted-foreground/25 bg-black hover:border-muted-foreground/50 cursor-pointer hover:bg-muted/10"
      }`}
              >
                {imageFileName ? (
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ImageIcon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                          {imageFileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ready to upload
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mb-2 h-10 w-10 text-muted-foreground" />
                    <p className="mb-1 text-sm font-medium text-foreground">
                      {isImgUrlEntered
                        ? "Image URL entered below"
                        : "Upload cover art"}
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">
                      PNG, JPG, or WebP (1:1 ratio recommended)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isImgUrlEntered}
                      onClick={(e) => {
                        e.stopPropagation();
                        imageInputRef.current?.click();
                      }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Choose Image
                    </Button>
                  </>
                )}
              </div>

              <Input
                placeholder="Or enter image URL"
                className="mt-2"
                disabled={!!imageFileName}
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
