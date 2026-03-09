import { useMutation } from "@tanstack/react-query";
import { supabase } from "./create-client";
import { getStoredUTMs } from "./get-utm-params";

interface TrackEventParams {
  eventType: "page_view" | "beat_view" | "beat_play";
  beatId?: string;
  extraMetadata?: Record<string, any>;
}

export function useTrackEvent() {
  const utms = getStoredUTMs();
  return useMutation({
    mutationFn: async ({
      eventType,
      beatId,
      extraMetadata = {},
    }: TrackEventParams) => {
      const metadata = {
        url: window.location.href,
        referrer: document.referrer,
        browser: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        ...utms,
        ...extraMetadata,
      };
      const { error } = await supabase.from("events").insert({
        event_type: eventType,
        beat_id: beatId || null,
        jsonb_metadata: metadata,
      });

      if (error) throw new Error(error.message);
      return { eventType, beatId };
    },
    onError: (error) => {
      console.error("Analytics tracking failed:", error);
    },
  });
}
