"use client";

import {
  Flame,
  Moon,
  Zap,
  HeartHandshake,
  CloudRain,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import SpotlightCard from "../ui/SpotlightCard";
import { motion } from "framer-motion";

const collections = [
  {
    id: "trap",
    title: "Hard Trap",
    description: "Aggressive 808s and fast hi-hats",
    icon: Flame,
    href: "/beats?genre=trap",
    spotlightColor:
      "rgba(255, 80, 50, 0.30)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  {
    id: "lofi",
    title: "Late Night",
    description: "Chill, RnB and Lofi vibes",
    icon: Moon,
    href: "/beats?genre=lofi",
    spotlightColor:
      "rgba(0, 229, 255, 0.2)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  {
    id: "drill",
    title: "UK / NY Drill",
    description: "Dark melodies and sliding basses",
    icon: Zap,
    href: "/beats?genre=drill",
    spotlightColor:
      "rgba(241, 208, 16, 0.3)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  {
    id: "emotional",
    title: "Sad & Emotional",
    description: "Piano melodies and deep lyrics",
    icon: CloudRain,
    href: "/beats?genre=emotional",
    spotlightColor:
      "rgba(120, 150, 255, 0.3)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
];

export function CollectionsGrid() {
  return (
    <section className="py-12  flex flex-col w-full items-center justify-center h-screen px-4 container m-auto">
      <section className="container">
        <div className="flex items-center justify-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl lg:text-7xl font-medium opacity-95 text-center font-satoshi"
          >
            browse by vibe
          </motion.h2>
          {/* <Link href="/beats" className="text-sm text-muted-foreground hover:text-white transition-colors">
          View all categories →
        </Link> */}
        </div>

        <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative overflow-hidden border border-zinc-80 h-[400px] transition-all duration-300"
            >
              <SpotlightCard
                className="custom-spotlight-card rounded-none h-full border-0"
                spotlightColor={item.spotlightColor}
              >
                <div
                  className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity`}
                />

                <div className="relative p-6 h-full flex flex-col justify-between min-h-[160px]">
                  <div className="flex justify-between items-start">
                    {/* Ikona */}
                    <div
                      className={`p-3 rounded-lg bg-gradient-to-br bg-opacity-20`}
                    >
                      <item.icon
                        className="w-28 h-28 text-white"
                        strokeWidth={0.3}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 mt-4">
                    <h3 className="font-medium font-satoshi text-lg leading-none tracking-tight text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm font-satoshi text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
