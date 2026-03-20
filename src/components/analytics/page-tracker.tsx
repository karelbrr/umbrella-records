"use client";
import { useTrackEvent } from "@/hooks/track-event";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PageTracker({
  eventType = "page_view",
  beatId,
}: {
  eventType?: any;
  beatId?: string;
}) {
  const { mutate } = useTrackEvent();
  const pathname = usePathname();
  const hasTrackedThisPath = useRef<string | null>(null);

  useEffect(() => {
    const trackingKey = `${pathname}${beatId ? `-${beatId}` : ""}`;

    if (hasTrackedThisPath.current === trackingKey) {
      return;
    }

    mutate({ eventType, beatId });
    hasTrackedThisPath.current = trackingKey;
  }, [mutate, eventType, beatId, pathname]);

  return null;
}
