import LightRays from "@/components/LightRays";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import { AudioWaveform } from "lucide-react";

import { AboutStudio } from "@/components/landing-page/about-studio";
import { GridScan } from "@/components/GridScan";
export default function Home() {
  return (
    <section>
      <section className="max-h-screen relative">
        <div className="relative bg-black w-full h-[100vh]">
          {/* Background effect */}
          <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <LightRays
              raysOrigin="top-center"
              raysColor="#ffffff"
              raysSpeed={1}
              lightSpread={1}
              rayLength={4}
              followMouse={false}
              mouseInfluence={0.1}
              noiseAmount={1.2}
              distortion={0.05}
              className="custom-rays"
            />
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white">
            <Image
              src="/images/main-logo.png"
              className="pointer-events-none opacity-80 w-[65%] lg:w-auto"
              alt="umbrella records"
              width={800}
              height={200}
            />
          </div>
        </div>
      </section>

      
      <section className="max-h-screen relative">
        <div className="relative bg-black w-full h-[100vh]">
          {/* Background effect */}

          <div style={{ width: "100%", height: "100vh", position: "relative" }}>
            <GridScan
              sensitivity={0.1}
              lineThickness={1}
              linesColor="#392e4e"
              gridScale={0.05}
              scanColor="#ffffff"
              scanOpacity={0.02}
              enablePost
              bloomIntensity={0.6}
              chromaticAberration={0.0}
              noiseIntensity={0.01}
            />
          </div>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center text-white">
            <h2 className="text-xl lg:text-4xl font-medium opacity-90 flex items-center  font-satoshi">
              rhythm <AudioWaveform strokeWidth={1.5} className="mx-2 lg:mx-5 mt-0.5 lg:mt-2" />{" "}
              creative <AudioWaveform strokeWidth={1.5} className="mx-2 lg:mx-5 mt-0.5 lg:mt-2" />{" "}
              sound
            </h2>
            {/* <p className="opacity-90 mt-3 font-light font-satoshi ">beats crafted with emotion, energy, and a unique vibe.</p> */}
          </div>
        </div>
      </section>
      

      <AboutStudio />
    </section>
  );
}
