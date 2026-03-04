import { TrackUploadForm } from "@/components/track-upload-form/track-upload-form";
import type { ComponentType } from "react";

const TrackUploadFormComponent =
  TrackUploadForm as unknown as ComponentType<any>;

export interface AudioListItem {
  id: string;
  created_at: string | number | Date;
  name: string | null;
  media_url: string;
  bpm: number | null;
  length: string | null;

  img_url: string | null;
  is_new: boolean | null;
  description: string | null;
  is_desc_ai: boolean | null;
  producer: string | null;
  key: string | null;
  genre: string | null;
}

export default function UploadTrackPage() {
  return (
    <div className="lg:px-8 px-4 py-6 space-y-10">
      <div>
        <h1 className=" text-3xl font-bold lg:text-left text-center tracking-tight text-foreground">
          Upload New Track
        </h1>
        <p className="mt-1  lg:text-left text-center text-muted-foreground">
          Add a new track to your audio library
        </p>
      </div>

      {/* Form */}
      <TrackUploadFormComponent />
    </div>
  );
}
