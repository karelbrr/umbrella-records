"use client";

import { Flame, Zap } from "lucide-react";
import SpotlightCard from "../ui/SpotlightCard";
import { motion } from "framer-motion";

const collections = [
  {
    id: "trap",
    title: "Trap",
    description: "Aggressive 808s and fast hi-hats",
    icon: Flame,
    href: "/beats?genre=trap",
    spotlightColor:
      "rgba(255, 255, 255, 0.20)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
  // {
  //   id: "lofi",
  //   title: "Late Night",
  //   description: "Chill, RnB and Lofi vibes",
  //   icon: Moon,
  //   href: "/beats?genre=lofi",
  //   spotlightColor:
  //     "rgba(0, 229, 255, 0.2)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  // },
  // {
  //   id: "drill",
  //   title: "UK / NY Drill",
  //   description: "Dark melodies and sliding basses",
  //   icon: Zap,
  //   href: "/beats?genre=drill",
  //   spotlightColor:
  //     "rgba(241, 208, 16, 0.3)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  // },
  {
    id: "edm",
    title: "EDM & Dance",
    description: "High energy synths and festival drops",
    icon: Zap,
    href: "/beats?genre=edm",
    spotlightColor:
      "rgba(236, 72, 153, 0.3)" as `rgba(${number}, ${number}, ${number}, ${number})`,
  },
];

export function CollectionsGrid() {
  return (
    <section className="py-12  flex flex-col w-full items-center justify-center lg:h-screen px-4 container m-auto">
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
      </div>

      <div className="grid grid-cols-1 lg:mt-6 sm:grid-cols-2 lg:grid-cols-2 w-full gap-4">
        {collections.map((item, index) => (
          <motion.a
            key={item.id}
            href={item.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1, ease: "easeOut", delay: index * 0.2 }}
            className="group relative overflow-hidden border border-zinc-800 h-[300px] lg:h-[500px] "
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
                    className={`lg:p-3 rounded-lg bg-gradient-to-br lg:w-28 lg:h-28 h-20 w-48 bg-opacity-20`}
                  >
                    <item.icon
                      className="size-[100px] lg:size-[150px]"
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
          </motion.a>
        ))}
      </div>
      <motion.a
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        href="/beats"
        className="text-sm text-muted-foreground mt-5 hover:text-white transition-colors"
      >
        View all categories →
      </motion.a>
    </section>
  );
}
