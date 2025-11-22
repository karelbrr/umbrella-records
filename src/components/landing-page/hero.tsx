import LightRays from "@/components/backgrounds/LightRays";
import Image from "next/image";

export function Hero({}) {
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
          {/* <Image
            src="/images/main-logo.png"
            className="pointer-events-none opacity-80 w-[65%] lg:w-1/4"
            alt="umbrella records"
            width={800}
            height={200}
          /> */}
        </div>
      </div>
    </section>
  );
}
