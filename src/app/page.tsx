import { Hero } from "../components/landing-page/hero";
import { AboutStudio } from "@/components/landing-page/about-studio";
import RecentBeats from "@/components/landing-page/latest-beats";
import type { Metadata } from "next";

export const metadata: Metadata = {
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
      <hr />
      <RecentBeats />
    </section>
  );
}
