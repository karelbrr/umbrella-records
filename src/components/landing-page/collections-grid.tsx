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

const collections = [
  {
    id: "trap",
    title: "Hard Trap",
    description: "Agresivní 808s a rychlé hi-hats",
    icon: Flame,
    href: "/beats?genre=trap",
  },
  {
    id: "lofi",
    title: "Late Night",
    description: "Chill, RnB a Lofi vibes",
    icon: Moon,
    href: "/beats?genre=lofi",
  },
  {
    id: "drill",
    title: "UK / NY Drill",
    description: "Temné melodie a klouzavé basy",
    icon: Zap,
    href: "/beats?genre=drill",
  },
  {
    id: "emotional",
    title: "Sad & Emotional",
    description: "Pianové melodie a hluboké texty",
    icon: CloudRain,
    href: "/beats?genre=emotional",
  },
];

export function CollectionsGrid() {
  return (
    <section className="py-12  flex flex-col w-full items-center justify-center h-screen ">
      <section className="container">
        <div className="flex items-center justify-center mb-8">
          <h2 className="text-4xl lg:text-7xl font-medium opacity-95 text-center font-satoshi">
            browse by vibe
          </h2>
          {/* <Link href="/beats" className="text-sm text-muted-foreground hover:text-white transition-colors">
          View all categories →
        </Link> */}
        </div>

        <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group relative overflow-hidden border border-zinc-80 h-[400px] hover:border-zinc-700 transition-all duration-300 hover:-translate-y-0.5"
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
                      className="w-20 h-20 text-white"
                      strokeWidth={0.2}
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
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
