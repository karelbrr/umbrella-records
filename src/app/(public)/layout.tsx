// Metadata mohou být i zde, pokud jsou specifická pro veřejnou část
import SmoothScrollProvider from "@/components/context/smooth-scroll-provider";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { PlayerProvider } from "@/components/context/player-context";
import AudioPlayer from "@/components/audio-player/audio-player";

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

          <main className="flex-1">{children}</main>

          <AudioPlayer />
          <Footer />
        </div>
      </PlayerProvider>
    </SmoothScrollProvider>
  );
}
