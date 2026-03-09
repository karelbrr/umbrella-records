"use client";
import { useTrackEvent } from "@/hooks/track-event";
import { useEffect } from "react";

export function PageTracker({
  eventType = "page_view",
  beatId,
}: {
  eventType?: any;
  beatId?: string;
}) {
  const { mutate } = useTrackEvent();

  useEffect(() => {
    mutate({ eventType, beatId });
    console.log(`Tracked event: ${eventType}${beatId ? ` for beat ID: ${beatId}` : ""}`); 
    
  }, [mutate, eventType, beatId]);

  return null; 
}
