"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDate } from "@/hooks/format-date";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/hooks/create-client";
import { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { useSongFormOptions } from "@/hooks/use-song-options";
import Image from "next/image";
import { uploadFileToSupabase } from "@/hooks/upload";
import {
  Activity,
  AlignLeft,
  Calendar,
  Clock,
  ImageIcon,
  Loader2,
  Music,
  Music2,
  RotateCcw,
  Sparkles,
  Tag,
  Tags,
  Upload,
  Zap,
} from "lucide-react";

interface EditTrackSheetProps {
  track: any;
}

type FormValues = {
  name: string;
  created_at?: string;
  producer: string;
  bpm: number | null;
  key: string;
  genre: string;
  length: string;
  description: string;
  img_url?: string;
  is_desc_ai: boolean;
  is_new?: boolean;
  tags: string[];
};

export function EditTrackSheet({ track }: EditTrackSheetProps) {
  const [open, setOpen] = useState(false);
  const {
    genres,
    keys,
    tags: allTags,
    isLoading: areSelectsLoading,
  } = useSongFormOptions();
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTagIds = (beatTags: any[] | undefined | null): string[] => {
    if (!beatTags || !Array.isArray(beatTags)) return [];
    return beatTags.map((bt) => bt?.tags?.id || bt?.tag_id).filter(Boolean);
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: track.name ?? "",
      created_at: track.created_at ? formatDate(track.created_at) : undefined,
      producer: track.profiles?.id ?? track.producer ?? "",
      bpm: track.bpm ?? null,
      key: track.keys?.id ? String(track.keys.id) : "",
      genre: track.genres?.id ? String(track.genres.id) : "",
      img_url: track.img_url ?? "",
      length: track.length ?? "",
      description: track.description ?? "",
      is_desc_ai: !!track.is_desc_ai,
      is_new: !!track.is_new,
      tags: extractTagIds(track.beat_tags),
    },
  });

  useEffect(() => {
    reset({
      name: track.name ?? "",
      created_at: track.created_at ? formatDate(track.created_at) : undefined,
      producer: track.profiles?.id ?? track.producer ?? "",
      bpm: track.bpm ?? null,
      key: track.keys?.id
        ? String(track.keys.id)
        : track.key
          ? String(track.key)
          : "",
      genre: track.genres?.id
        ? String(track.genres.id)
        : track.genre
          ? String(track.genre)
          : "",
      img_url: track.img_url ?? "",
      length: track.length ?? "",
      description: track.description ?? "",
      is_desc_ai: !!track.is_desc_ai,
      is_new: !!track.is_new,
      tags: extractTagIds(track.beat_tags),
    });
  }, [track, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImageFromSupabase = async (imageUrl: string) => {
    if (imageUrl) {
      try {
        const urlParts = imageUrl.split("/images/");
        const filePath = urlParts[urlParts.length - 1];
        if (filePath) {
          const { error } = await supabase.storage
            .from("images")
            .remove([filePath]);

          if (error) {
            console.error(
              "Error removing image from Supabase Storage:",
              error.message,
            );
          }
        }
      } catch (err) {
        console.error("Failed to parse URL for file deletion:", err);
      }
    }
  };

  const queryClient = useQueryClient();
  const updateTrackMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      let finalImgUrl = track.img_url;

      if (newImageFile) {
        removeImageFromSupabase(finalImgUrl);
        finalImgUrl = await uploadFileToSupabase(newImageFile, "images");
      }

      const updatePayload: any = {
        name: values.name,
        bpm: values.bpm ?? null,
        producer: values.producer || null,
        key: values.key || null,
        genre: values.genre || null,
        length: values.length || null,
        description: values.description || null,
        img_url: finalImgUrl,
        is_desc_ai: !!values.is_desc_ai,
        is_new: !!values.is_new,
      };

      const { data, error } = await supabase
        .from("beats_tracks")
        .update(updatePayload)
        .eq("id", track.id)
        .select();

      if (error) throw new Error(error.message);

      const { error: deleteError } = await supabase
        .from("beat_tags")
        .delete()
        .eq("beat_id", track.id);

      if (deleteError) throw new Error(deleteError.message);

      if (values.tags && values.tags.length > 0) {
        const tagsToInsert = values.tags.map((tagId: string | number) => ({
          beat_id: track.id,
          tag_id: tagId,
        }));

        const { error: insertError } = await supabase
          .from("beat_tags")
          .insert(tagsToInsert);

        if (insertError) throw new Error(insertError.message);
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Track updated");
      queryClient.invalidateQueries({ queryKey: ["BeatsForAdmin"] });
      setOpen(false);
      setNewImageFile(null);
      setImagePreview(null);
    },
    onError: (err: any) => {
      toast.error(`Update failed: ${err?.message ?? err}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    const rawOriginalTags = track.beat_tags?.map((t: any) => t.tags?.id) || [];
    const normalizedFormTags = (values.tags || []).map(String).sort();
    const normalizedOriginalTags = rawOriginalTags.map(String).sort();

    const formPayload = {
      name: values.name || null,
      bpm: values.bpm ? Number(values.bpm) : null,
      key: values.key ? String(values.key) : null,
      genre: values.genre ? String(values.genre) : null,
      length: values.length || null,
      description: values.description || null,
      is_desc_ai: !!values.is_desc_ai,
      is_new: !!values.is_new,
      tags: normalizedFormTags,
    };

    const original = {
      name: track.name || null,
      bpm: track.bpm ? Number(track.bpm) : null,
      key: track.key
        ? String(track.key)
        : track.keys?.id
          ? String(track.keys.id)
          : null,
      genre: track.genre
        ? String(track.genre)
        : track.genres?.id
          ? String(track.genres.id)
          : null,
      length: track.length || null,
      description: track.description || null,
      is_desc_ai: !!track.is_desc_ai,
      is_new: !!track.is_new,
      tags: normalizedOriginalTags,
    };

    const isSame = JSON.stringify(formPayload) === JSON.stringify(original);

    if (isSame && !newImageFile) {
      toast("Update some fields or upload a new cover to save");
      return;
    }

    updateTrackMutation.mutate(values);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full sm:w-auto sm:max-w-sm">
        <SheetHeader className="pb-0">
          <SheetTitle>Edit Track</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-3 px-4">
            <div className=" p-4 grid grid-cols-4 space-x-4 rounded-lg border ">
              {/* Track Title */}
              <div className="space-y-2 col-span-2">
                <Label
                  htmlFor="title"
                  className=" text-muted-foreground flex items-center gap-2"
                >
                  <Music className="h-3.5 w-3.5" /> Track Title
                </Label>
                <Input
                  id="title"
                  placeholder="E.g. Midnight City"
                  {...register("name", {
                    required: "Track title is required",
                  })}
                  className=" bg-background border-border focus-visible:ring-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Created At (ReadOnly) */}
              <div className="space-y-2 col-span-2">
                <Label
                  htmlFor="created_at"
                  className=" text-muted-foreground flex items-center gap-2"
                >
                  <Calendar className="h-3.5 w-3.5" /> Date Uploaded
                </Label>
                <Input
                  disabled
                  id="created_at"
                  {...register("created_at")}
                  className=" bg-background border-border opacity-60 cursor-not-allowed "
                />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border ">
                {/* BPM */}
                <div className="space-y-2">
                  <Label
                    htmlFor="bpm"
                    className=" text-muted-foreground flex items-center gap-2"
                  >
                    <Activity className="h-3.5 w-3.5" /> BPM
                  </Label>
                  <Input
                    type="number"
                    id="bpm"
                    placeholder="128"
                    {...register("bpm", {
                      valueAsNumber: true,
                      min: {
                        value: 20,
                        message: "BPM must be at least 20",
                      },
                      max: {
                        value: 300,
                        message: "BPM cannot exceed 300",
                      },
                    })}
                    className="h-10 bg-background"
                  />
                  {errors.bpm && (
                    <p className="text-xs text-red-500">{errors.bpm.message}</p>
                  )}
                </div>

                {/* Length */}
                <div className="space-y-2">
                  <Label
                    htmlFor="length"
                    className=" text-muted-foreground flex items-center gap-2"
                  >
                    <Clock className="h-3.5 w-3.5" /> Length
                  </Label>
                  <Input
                    id="length"
                    placeholder="MM:SS"
                    disabled={true}
                    maxLength={5}
                    {...register("length", {
                      required: "Required",
                      pattern: {
                        value: /^[0-9]{1,2}:[0-5][0-9]$/,
                        message: "Format MM:SS",
                      },
                    })}
                    className="h-10 bg-background opacity-70"
                  />
                  {errors.length && (
                    <p className="text-[10px] font-medium text-red-500 ">
                      {errors.length.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border ">
                {/* Key */}
                <div className="space-y-2">
                  <Label
                    htmlFor="key"
                    className=" text-muted-foreground flex items-center gap-2"
                  >
                    <Music2 className="h-3.5 w-3.5" /> Key
                  </Label>
                  <Controller
                    control={control}
                    name="key"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 bg-background border-border w-full">
                          <SelectValue
                            placeholder={
                              areSelectsLoading ? "..." : "Select Key"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {keys?.map((k) => (
                            <SelectItem key={k.id} value={String(k.id)}>
                              {k.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label
                    htmlFor="genre"
                    className=" text-muted-foreground flex items-center gap-2"
                  >
                    <Tag className="h-3.5 w-3.5" /> Genre
                  </Label>
                  <Controller
                    control={control}
                    name="genre"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-10 bg-background border-border w-full">
                          <SelectValue
                            placeholder={
                              areSelectsLoading ? "..." : "Select Genre"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {genres?.map((g) => (
                            <SelectItem key={g.id} value={String(g.id)}>
                              {g.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Description */}
            <div className="space-y-2 p-4 rounded-lg border ">
              <Label
                htmlFor="desc"
                className=" text-muted-foreground flex items-center gap-2"
              >
                <AlignLeft className="h-3.5 w-3.5" /> Description
              </Label>

              <Textarea
                id="desc"
                placeholder="Write something about your track..."
                className="min-h-[120px] max-h-[140px] !bg-black border-border resize-none focus-visible:ring-1 transition-all"
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
            {/* Cover Image */}
            <div className="p-4 rounded-lg border space-y-4">
              <Label className=" text-muted-foreground flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5" /> Track Cover Art
              </Label>

              <div className="flex items-start gap-6 p-3 rounded-lg border ">
                <div className="relative shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm">
                  <Image
                    src={
                      imagePreview ||
                      track.img_url ||
                      "/images/missing-image.png"
                    }
                    alt="cover img"
                    className="aspect-square object-cover transition-all "
                    width={120}
                    height={120}
                  />
                </div>

                <div className="flex flex-col gap-2.5 py-1">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Cover Image</h4>
                    <p className="text-xs text-muted-foreground leading-none">
                      Min. 500x500px, JPG or PNG.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />

                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs w-fit"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-3.5 w-3.5" />
                      Change Image
                    </Button>

                    {imagePreview && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 w-fit"
                        onClick={() => {
                          setNewImageFile(null);
                          setImagePreview(null);
                        }}
                      >
                        <RotateCcw className="mr-2 h-3.5 w-3.5" />
                        Reset to original
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TAGS SECTION */}
            <div className="space-y-2 p-4 rounded-lg border">
              <div className="space-y-1">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Tags className="h-3.5 w-3.5" /> Tags
                </Label>
                <p className="text-xs text-muted-foreground">
                  Select tags to help categorize your track.
                </p>
              </div>

              <Controller
                name="tags"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {areSelectsLoading
                      ? [1, 2, 3, 4, 5, 6].map((i) => (
                          <div
                            key={i}
                            className="h-8 w-16 animate-pulse bg-muted rounded-full"
                          />
                        ))
                      : allTags?.map((tag) => {
                          const currentValues = Array.isArray(field.value)
                            ? field.value
                            : [];
                          const isSelected = currentValues.some(
                            (id: any) => String(id) === String(tag.id),
                          );

                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => {
                                let newValue;
                                if (isSelected) {
                                  newValue = currentValues.filter(
                                    (id: any) => String(id) !== String(tag.id),
                                  );
                                } else {
                                  newValue = [...currentValues, tag.id];
                                }
                                field.onChange(newValue);
                              }}
                              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors focus-visible:ring-1 focus:outline-none ${
                                isSelected
                                  ? "bg-accent text-accent-foreground border-accent"
                                  : "bg-transparent border-border hover:bg-accent/10"
                              }`}
                            >
                              {tag.tag_title}
                            </button>
                          );
                        })}
                  </div>
                )}
              />
              {errors.tags && (
                <p className="text-sm text-red-500">
                  {errors.tags.message as string}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg border ">
                {/* AI Description Toggle */}
                <div className="flex items-center justify-between space-x-2 rounded-md border bg-background/50 p-3 transition-colors hover:bg-background/80">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="is_desc_ai"
                      className=" text-muted-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" /> AI Desc
                    </Label>
                    <span className="text-[10px] text-muted-foreground/60 leading-none">
                      AI Generated
                    </span>
                  </div>
                  <Controller
                    control={control}
                    name="is_desc_ai"
                    render={({ field }) => (
                      <Checkbox
                        id="is_desc_ai"
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(!!v)}
                      />
                    )}
                  />
                </div>

                {/* Badge Toggle */}
                <div className="flex items-center justify-between space-x-2 rounded-md border bg-background/50 p-3 transition-colors hover:bg-background/80">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="is_new"
                      className=" text-muted-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <Zap className="h-3 w-3 " /> New Tag
                    </Label>
                    <span className="text-[10px] text-muted-foreground/60 leading-none">
                      Fresh Release
                    </span>
                  </div>
                  <Controller
                    control={control}
                    name="is_new"
                    render={({ field }) => (
                      <Checkbox
                        id="is_new"
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(!!v)}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="">
                <Button
                  type="submit"
                  className="w-full h-12 shadow-md transition-all hover:shadow-primary/20"
                  disabled={updateTrackMutation.isPending}
                >
                  {updateTrackMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Track...
                    </>
                  ) : (
                    "Confirm & Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
