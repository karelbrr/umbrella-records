import { Hero } from "../components/landing-page/hero";

import { AboutStudio } from "@/components/landing-page/about-studio";
import RecentBeats from "@/components/landing-page/latest-beats";
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
