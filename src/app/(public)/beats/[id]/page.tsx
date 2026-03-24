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
    .select("name, description, img_url")
    .eq("id", id)
    .single();

  if (error || !data) {
    return {
      title: "Beat not found",
      description: "This beat does not exist",
    };
  }

  const title = `${data.name} | Umbrella Records`;
  const description =
    data.description ?? "Listen to this beat on Umbrella Records.";
  const imageUrl = data.img_url;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      url: `https://umbrellarecords.cz/beat/${id}`,
      siteName: "Umbrella Records",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Cover art for beat ${data.name}`,
        },
      ],
      locale: "cs_CZ",
      type: "music.song",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [imageUrl],
    },
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
