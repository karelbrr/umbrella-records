"use client";
import { AudioWaveform } from "lucide-react";
import { GridScan } from "../backgrounds/GridScan";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

export function Hero({}) {
  return (
    <section className="max-h-screen relative">
      <div className="relative bg-black w-full h-[100vh]">
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
          {" "}
          <Badge variant={"outline"} className="mb-2">demo site - beta v1.0.7</Badge>
          <h1
            id="hero"
            className="scroll-mt-[2000px] text-xl lg:text-4xl font-medium opacity-90 flex items-center  font-satoshi"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
              rhythm
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            >
              <AudioWaveform
                strokeWidth={1.5}
                className="mx-2 lg:mx-5 mt-0.5 lg:mt-2"
              />
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            >
              creative{" "}
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
            >
              <AudioWaveform
                strokeWidth={1.5}
                className="mx-2 lg:mx-5 mt-0.5 lg:mt-2"
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
            >
              sound{" "}
            </motion.span>{" "}
          </h1>
          {/* <p className="opacity-90 mt-3 font-light font-satoshi ">beats crafted with emotion, energy, and a unique vibe.</p> */}
        </div>
      </div>
    </section>
  );
}
