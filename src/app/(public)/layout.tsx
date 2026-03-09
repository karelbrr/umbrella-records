import SmoothScrollProvider from "@/components/context/smooth-scroll-provider";
import { Navbar } from "../../components/navbar";
import { Footer } from "../../components/footer";
import { PlayerProvider } from "@/components/context/player-context";
import AudioPlayer from "@/components/audio-player/audio-player";
import { UTMTracker } from "@/components/analytics/utm-tracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScrollProvider>
      <PlayerProvider>
        <div className="flex min-h-screen flex-col bg-black text-white">
          <Navbar />
          <UTMTracker />
          <main className="flex-1">{children}</main>
          <AudioPlayer />
          <Footer />
        </div>
      </PlayerProvider>
    </SmoothScrollProvider>
  );
}
