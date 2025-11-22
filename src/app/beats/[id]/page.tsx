import { supabase } from "@/hooks/createClient";
import type { Metadata } from "next";
import { BeatDetails } from "./beat-details";
import RelatedBeats from "./related-beats";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { data, error } = await supabase
    .from("beats_tracks")
    .select("name,description")
    .eq("id", params.id)
    .single();

  if (error) {
    return {
      title: "Beat not found",
      description: "This beat does not exist",
    };
  }

  return {
    title: data?.name ? `${data.name} | Umbrella Records` : `Beat ${params.id}`,
    description: data?.description ?? "Beat details",
  };
}

function Page() {
  return (
    <section className="min-h-screen bg-black pb-32 pt-[5vh]">
      <BeatDetails />
      <RelatedBeats />
    </section>
  );
}

export default Page;
