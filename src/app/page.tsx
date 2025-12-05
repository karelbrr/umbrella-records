import { CollectionsGrid } from "@/components/landing-page/collections-grid";
import { Hero } from "../components/landing-page/hero";

import { AboutStudio } from "@/components/landing-page/about-studio";
import RecentBeats from "@/components/landing-page/latest-beats";

export const metadata = {
  title: "Umbrella Records",
  description:
    "Umbrella Records is a modern recording studio and online beat store. A professional space for recording, music production, and purchasing high-quality beats for artists and producers.",
};

export default function Home() {
  return (
    <section>
      <Hero />
      <hr />
      <AboutStudio />
      {/* <hr />
      <CollectionsGrid /> */}
      <hr />
      <RecentBeats />
    </section>
  );
}
