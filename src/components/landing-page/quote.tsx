"use client";
import { AudioWaveform } from "lucide-react";
import { GridScan } from "../backgrounds/GridScan";

export function Quote({}) {
  return (
    <section className="max-h-screen relative">
      <div className="relative bg-black w-full h-[100vh]">
        {/* Background effect */}

        <div
          style={{
            width: "100%",
            height: "100vh",
            position: "relative",
          }}
        >
          <GridScan
            sensitivity={0.1}
            lineThickness={1}
            linesColor="#382e4e"
            gridScale={0.05}
            scanColor="#ffffff"
            scanOpacity={0.1}
            bloomIntensity={0.5}
            scanGlow={0.6}
            chromaticAberration={0.001}
            noiseIntensity={0.002}
          />
        </div>

        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white">
          <h2 className="text-xl lg:text-4xl font-medium opacity-90 flex items-center  font-satoshi">
            rhythm{" "}
            <AudioWaveform
              strokeWidth={1.5}
              className="mx-2 lg:mx-5 mt-0.5 lg:mt-2"
            />{" "}
            creative{" "}
            <AudioWaveform
              strokeWidth={1.5}
              className="mx-2 lg:mx-5 mt-0.5 lg:mt-2"
            />{" "}
            sound
          </h2>
          {/* <p className="opacity-90 mt-3 font-light font-satoshi ">beats crafted with emotion, energy, and a unique vibe.</p> */}
        </div>
      </div>
    </section>
  );
}
