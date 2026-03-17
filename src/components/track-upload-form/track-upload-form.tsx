"use client";
import { MediaAssetsForm } from "./media-assets-form";
import { toast } from "sonner";
import { useRef, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/hooks/create-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/auth-provider";
import { uploadFileToSupabase } from "@/hooks/upload";
import { MiscellaneousForm } from "./miscellaneous-form";
import { GeneralInformationForm } from "./general-information-form";

export interface FormData {
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
  tags: string[];
}

export function TrackUploadForm() {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { user } = useAuth();

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

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
      tags: [],
    },
  });

  useEffect(() => {
    if (user?.id) {
      setValue("producer", user.id);
    }
  }, [user, setValue]);

  const mediaUrlValue = watch("media_url");
  const isUrlEntered = mediaUrlValue && mediaUrlValue.length > 0 ? true : false;

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

    if (!allowedExt.test(file.name)) {
      setUploadError("Only MP3, WAV or FLAC files are allowed.");
      setFileName(null);
      setAudioFile(null);
      setIsUploaded(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploadError(null);
    setFileName(file.name);
    setAudioFile(file);

    const objectUrl = URL.createObjectURL(file);
    const audio = new Audio(objectUrl);
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      const formattedLength = formatTime(duration);
      setValue("length", formattedLength, { shouldValidate: true });
      setIsUploaded(true);
      URL.revokeObjectURL(objectUrl);
    };
    audio.onerror = () => {};
  };

  const handleRemoveFile = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const currentMediaUrl = watch("media_url");

    if (currentMediaUrl) {
      try {
        const urlParts = currentMediaUrl.split("/tracks/");
        const filePath = urlParts[urlParts.length - 1];

        if (filePath) {
          const { error } = await supabase.storage
            .from("tracks")
            .remove([filePath]);

          if (error) {
            console.error(
              "Error removing file from Supabase Storage:",
              error.message,
            );
          } else {
            toast.success("Audio file removed from storage");
          }
        }
      } catch (err) {
        console.error("Failed to parse URL for file deletion:", err);
      }
    }

    setFileName(null);
    setIsUploaded(false);
    setIsGenerated(false);
    setAudioFile(null);

    setValue("length", "");
    setValue("name", "");
    setValue("tags", []);
    setValue("bpm", "");
    setValue("key", "");
    setValue("genre", "");
    setValue("description", "");
    setValue("media_url", "");
    setValue("is_desc_ai", false);

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
      setCoverFile(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFileName(null);
    setCoverFile(null);
    setIsGenerated(false);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };
  const queryClient = useQueryClient();
  const createSongMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      let finalMediaUrl = formData.media_url;
      let finalImgUrl = formData.img_url;

      if (audioFile && !formData.media_url) {
        finalMediaUrl = await uploadFileToSupabase(audioFile, "tracks");
      }
      if (coverFile) {
        finalImgUrl = await uploadFileToSupabase(coverFile, "images");
      }

      const { data, error } = await supabase
        .from("beats_tracks")
        .insert([
          {
            name: formData.name,
            bpm: formData.bpm,
            producer: formData.producer || user?.id || null,
            genre: formData.genre || null,
            key: formData.key || null,
            length: formData.length,
            media_url: finalMediaUrl,
            img_url: finalImgUrl,
            description: formData.description,
            is_new: formData.is_new,
            is_desc_ai: formData.is_desc_ai,
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
      setFileName(null);
      setAudioFile(null);
      setImageFileName(null);
      setCoverFile(null);
      setIsUploaded(false);
    },

    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const isUploading = createSongMutation.isPending;

  return (
    <form id="track-upload-form" onSubmit={handleSubmit(onSubmit)}>
      {(isUploading || isGenerating) && (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      )}
      <div
        className={`grid gap-6 lg:grid-cols-3 ${
          isUploading || isGenerating
            ? "pointer-events-none opacity-50 blur-xs"
            : ""
        }`}
      >
        {/* Left Column - Track Details */}
        <GeneralInformationForm
          errors={errors}
          control={control}
          register={register}
          isUploaded={isUploaded}
          setValue={setValue}
          audioFile={audioFile}
          setIsGenerating={setIsGenerating}
          setIsGenerated={setIsGenerated}
          isGenerated={isGenerated}
        />

        {/* Middle Column - Media & Status */}
        <MediaAssetsForm
          fileInputRef={fileInputRef}
          isUrlEntered={isUrlEntered}
          handleAudioChange={handleAudioChange}
          fileName={fileName}
          handleRemoveFile={handleRemoveFile}
          uploadError={uploadError}
          imageInputRef={imageInputRef}
          isImgUrlEntered={isImgUrlEntered}
          handleImageChange={handleImageChange}
          imageFileName={imageFileName}
          handleRemoveImage={handleRemoveImage}
        />

        {/* Right Column - Miscellaneous */}
        <MiscellaneousForm control={control} />
      </div>

      {/* Footer Actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button
          disabled={isUploading || isGenerating}
          type="button"
          variant="outline"
        >
          Cancel
        </Button>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button disabled={isUploading || isGenerating}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Track"
              )}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ready to upload?</AlertDialogTitle>
              <AlertDialogDescription>
                You are about to upload{" "}
                <strong>{watch("name") || "this track"}</strong> to the library.
                Please ensure all details are correct.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  // close dialog then submit the form reliably
                  setIsDialogOpen(false);
                  const form = document.getElementById(
                    "track-upload-form",
                  ) as HTMLFormElement | null;
                  if (form) {
                    // requestSubmit is preferred over submit to trigger React/validation handlers
                    if (typeof form.requestSubmit === "function") {
                      form.requestSubmit();
                    } else {
                      form.submit();
                    }
                  }
                }}
              >
                Confirm Upload
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}
