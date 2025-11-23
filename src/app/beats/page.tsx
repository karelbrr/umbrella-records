import { AudioSection } from "./audio-section";

export const metadata = {
  title: "Beats | Umbrella Records",
  description:
    "Discover and preview original beats and instrumentals from Umbrella Records. Filter by genre, key, and BPM, listen to previews, and listen high-quality tracks.",
};

export default function Page() {
  return (
    <section className="container m-auto  pt-[10vh] px-4 bg-black">
      <div className="flex items-center justify-between">
        <h1 className="text-[44px] font-satoshi text-white font-semibold tracking-tight line-clamp-1 font-satoshi">
          beats
        </h1>
      </div>
      <AudioSection />
    </section>
  );
}
