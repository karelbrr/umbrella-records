"use client";

import { useTrackEvent } from "@/hooks/trackEvent";
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
  }, [mutate, eventType, beatId]);

  return null; 
}
