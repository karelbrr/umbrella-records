import { format, subDays } from "date-fns";
import { createClient } from "@supabase/supabase-js";

export function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function getTrafficData(
  days: number = 30,
  visualHint: string = "area-chart",
) {
  const pastDate = subDays(new Date(), days).toISOString();

  const { data, error } = await getAdminSupabase()
    .from("events")
    .select("created_at, event_type")
    .gte("created_at", pastDate)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const dailyMap = new Map();

  for (let i = days; i >= 0; i--) {
    const dateKey = format(subDays(new Date(), i), "MMM dd");
    dailyMap.set(dateKey, { date: dateKey, pageVisits: 0, beatViews: 0 });
  }

  data.forEach((event) => {
    const dateKey = format(new Date(event.created_at), "MMM dd");
    if (dailyMap.has(dateKey)) {
      const current = dailyMap.get(dateKey);
      if (event.event_type === "page_view") current.pageVisits++;
      if (event.event_type === "beat_view") current.beatViews++;
    }
  });

  return {
    data: Array.from(dailyMap.values()),
    visualHint: visualHint,
  };
}

// 2. Get Website Visits
export async function getWebsiteStats() {
  const { count, error } = await getAdminSupabase()
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "page_view");

  if (error) throw error;
  return count || 0;
}

// 3. Get Beat Impressions
export async function getBeatStats() {
  const { count, error } = await getAdminSupabase()
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "beat_view");

  if (error) throw error;
  return count || 0;
}

// 4. Get Beat Plays
export async function getBeatPlayStats() {
  const { count, error } = await getAdminSupabase()
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("event_type", "beat_play");

  if (error) throw error;
  return count || 0;
}

// 5. Get Top Beats
export async function getTopBeatsPlays(
  limit: number = 5,
  visualHint: string = "bar-chart",
) {
  const { data, error } = await getAdminSupabase()
    .from("events")
    .select(`beat_id, beats_tracks ( name )`)
    .eq("event_type", "beat_play");

  if (error) throw error;

  const beatCounts: Record<string, { name: string; plays: number }> = {};

  data.forEach((event: any) => {
    const id = event.beat_id;
    if (!id || !event.beats_tracks) return;
    const trackName = event.beats_tracks.name;

    if (!beatCounts[id]) {
      beatCounts[id] = { name: trackName, plays: 0 };
    }
    beatCounts[id].plays++;
  });

  const sortedData = Object.values(beatCounts)
    .sort((a, b) => b.plays - a.plays)
    .slice(0, limit);

  return {
    data: sortedData,
    visualHint: visualHint,
  };
}

// 6. Get Traffic Sources
export async function getTrafficSources() {
  const { data, error } = await getAdminSupabase()
    .from("events")
    .select("jsonb_metadata");

  if (error) throw error;
  return data;
}
