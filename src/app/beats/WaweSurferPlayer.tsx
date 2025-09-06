"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveSurferPlayer() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ffffff",
        progressColor: "#ffffff",
        cursorColor: "#ffffff",
        height: 50,
        barWidth: 0.5,
      });

      wavesurfer.current.load("/sound.mp3");

      wavesurfer.current.on("finish", () => setIsPlaying(false));
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, []);

  const togglePlay = () => {
    if (!wavesurfer.current) return;
    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <section>
      <div className="  text-white w-full flex items-center">
        <div ref={waveformRef} className="w-[400px] mr-4 opacity-90" />

        

        <button
          onClick={togglePlay}
          className="px-4 py-2 bg-blurple rounded  text-white"
        >
          {isPlaying ? "pause" : "play"}
        </button>
      </div>
    </section>
  );
}
