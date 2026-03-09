import { supabase } from "@/hooks/create-client";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";

// 1. Hook for Traffic Data (for Traffic Chart)
export function useTrafficData() {
  return useQuery({
    queryKey: ["analytics", "traffic-chart"],
    queryFn: async () => {
      const thirtyDaysAgo = subDays(new Date(), 30).toISOString();

      const { data, error } = await supabase
        .from("events")
        .select("created_at, event_type")
        .gte("created_at", thirtyDaysAgo)
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Transform raw events into daily buckets
      const dailyMap = new Map();

      // Fill map with empty days first (so no gaps in chart)
      for (let i = 30; i >= 0; i--) {
        const dateKey = format(subDays(new Date(), i), "MMM dd");
        dailyMap.set(dateKey, { date: dateKey, pageVisits: 0, beatViews: 0 });
      }

      // Populate buckets with real data
      data.forEach((event) => {
        const dateKey = format(new Date(event.created_at), "MMM dd");
        if (dailyMap.has(dateKey)) {
          const current = dailyMap.get(dateKey);
          if (event.event_type === "page_view") current.pageVisits++;
          if (event.event_type === "beat_view") current.beatViews++;
        }
      });

      return Array.from(dailyMap.values());
    },
  });
}
// 2. Hook for Website Visits (General Traffic)
export function useWebsiteStats() {
  return useQuery({
    queryKey: ["analytics", "website-views"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "page_view");

      if (error) throw new Error(error.message);
      return count || 0;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 3. Hook for Beat Impressions (Product Interest)
export function useBeatStats() {
  return useQuery({
    queryKey: ["analytics", "beat-views"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "beat_view");

      if (error) throw new Error(error.message);
      return count || 0;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 4. Hook for Beat Plays (Product Interest)
export function useBeatPlayStats() {
  return useQuery({
    queryKey: ["analytics", "beat-play"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })
        .eq("event_type", "beat_play");

      if (error) throw new Error(error.message);
      return count || 0;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 5. Hook for Top Beats (Product Performance)
export function useTopBeatsPlays() {
  return useQuery({
    queryKey: ["analytics", "top-beats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          beat_id,
          beats_tracks (
            name
          )
        `,
        )
        .eq("event_type", "beat_play");

      if (error) throw error;

      const beatCounts: Record<string, { name: string; plays: number }> = {};

      data.forEach((event: any) => {
        const id = event.beat_id;
        if (!id) return;

        const trackName = event.beats_tracks?.name;

        if (!beatCounts[id]) {
          beatCounts[id] = {
            name: trackName || "Deleted/Unknown Beat",
            plays: 0,
          };
        } else if (
          trackName &&
          beatCounts[id].name === "Deleted/Unknown Beat"
        ) {
          beatCounts[id].name = trackName;
        }

        beatCounts[id].plays++;
      });

      return Object.values(beatCounts)
        .sort((a, b) => b.plays - a.plays)
        .slice(0, 5);
    },
    staleTime: 1000 * 60 * 5,
  });
}

// 6. Hook for Top Traffics Sources (Product Sources)
// export function useTrafficSources() {
//   return useQuery({
//     queryKey: ["analytics", "traffic-sources"],
//     queryFn: async () => {
//       const { data, error } = await supabase.from("events").select(
//         `
//           jsonb_metadata
//         `,
//       );

//       if (error) throw error;

//       return data;
//     },
//     staleTime: 1000 * 60 * 5,
//   });
// }
