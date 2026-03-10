"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function IsGeneratingState() {
  // Skeletons pro bar charts mockup (různé výšky)
  const barSkeletons = [80, 50, 90, 60, 45, 75, 55, 85, 70, 65, 80];

  return (
    <div className="relative w-full mx-auto space-y-8 p-6 md:p-8 rounded-2xl border border-zinc-800 h-full bg-black overflow-hidden group">
      <div className="animate-shimmer-left-right" />

      {/* Main Area Skeleton: Large Bar Chart Mockup */}
      <Card className="bg-zinc-950 border-zinc-800 h-full animate-pulse delay-300">
        <CardHeader className="p-6 space-y-1.5 pb-2 border-b border-zinc-800">
          <div className="h-6 w-72 bg-zinc-900 rounded" />
          <div className="h-4 w-[500px] bg-zinc-900/70 rounded" />
        </CardHeader>
        <CardContent className="p-6 pt-6 flex flex-col justify-end min-h-[420px]">
          {/* Mock Bar Chart Area */}
          <div className="flex items-end gap-3 h-[300px] border-l border-b border-zinc-800 pl-4 pb-2">
            {barSkeletons.map((heightPercent, i) => (
              <div
                key={i}
                className="flex-1 bg-violet-950/40 rounded-t-md transition-all duration-1000 ease-out"
                style={{
                  height: `${heightPercent}%`,
                  animationDelay: `${i * 50}ms`, // Sekvenční pulse barů
                }}
              />
            ))}
          </div>
          {/* Mock X-Axis Labels */}
          <div className="flex gap-3 pl-4 pt-4">
            {barSkeletons.map((_, i) => (
              <div key={i} className="flex-1 h-3 bg-zinc-900 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
