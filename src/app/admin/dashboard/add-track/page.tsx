"use client";

import { AppSidebar } from "@/components/app-sidebar";

import { SiteHeader } from "@/components/site-header";
import { TrackUploadForm } from "@/components/track-upload-form";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col">
          <div className="px-8  py-4">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                Upload New Track
              </h1>
              <p className="mt-1 text-muted-foreground">
                Add a new track to your audio library
              </p>
            </div>
            {/* Form */}
            <TrackUploadForm />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
