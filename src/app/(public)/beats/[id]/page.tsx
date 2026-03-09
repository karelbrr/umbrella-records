import { supabase } from "@/hooks/create-client";
import type { Metadata } from "next";
import { BeatDetails } from "./beat-details";
import RelatedBeats from "./related-beats";
import { PageTracker } from "@/components/analytics/page-tracker";

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await paramsPromise;

  const { data, error } = await supabase
    .from("beats_tracks")
    .select("name,description")
    .eq("id", id)
    .single();

  if (error) {
    return {
      title: "Beat not found",
      description: "This beat does not exist",
    };
  }

  return {
    title: data?.name ? `${data.name} | Umbrella Records` : `Beat ${id}`,
    description: data?.description ?? "Beat details",
  };
}

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const beatId = resolvedParams.id;
  return (
    <section className="min-h-screen bg-black pb-32 pt-[6vh]">
      <PageTracker eventType="beat_view" beatId={beatId} />
      <BeatDetails />
      <RelatedBeats />
    </section>
  );
}

export default Page;
