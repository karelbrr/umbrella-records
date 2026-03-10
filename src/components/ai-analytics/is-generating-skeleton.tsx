"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function IsGeneratingSkeleton() {
  // Skeletons pro bar charts mockup (různé výšky)
  const barSkeletons = [80, 50, 90, 60, 45, 75, 55, 85, 70, 65, 80];

  return (
    <div className="relative w-full mx-auto space-y-8 p-6 md:p-8 rounded-2xl border border-zinc-800 h-full bg-black overflow-hidden group">
      <div className="animate-shimmer-left-right" />

      <div className="grid grid-cols-2 gap-10 ">
        <Card className="bg-zinc-950 border-zinc-800 animate-pulse delay-300">
          <CardHeader className="p-6 space-y-1.5 pb-2 border-b border-zinc-800">
            <div className="h-6 w-72 bg-zinc-900 rounded" />
            <div className="h-4 w-[500px] bg-zinc-900/70 rounded" />
          </CardHeader>
          <CardContent className="p-6 pt-6 flex flex-col justify-end ">
            <div className="flex items-end gap-3 h-[300px] border-l border-b border-zinc-800 pl-4 pb-2">
              {barSkeletons.map((heightPercent, i) => (
                <div
                  key={i}
                  className="flex-1 bg-violet-950/40 rounded-t-md transition-all duration-1000 ease-out"
                  style={{
                    height: `${heightPercent}%`,
                    animationDelay: `${i * 50}ms`, 
                  }}
                />
              ))}
            </div>
            <div className="flex gap-3 pl-4 pt-4">
              {barSkeletons.map((_, i) => (
                <div key={i} className="flex-1 h-3 bg-zinc-900 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800  animate-pulse delay-300">
          <CardHeader className="p-6 space-y-1.5 pb-2 border-b border-zinc-800">
            <div className="h-6 w-72 bg-zinc-900 rounded" />
            <div className="h-4 w-[500px] bg-zinc-900/70 rounded" />
          </CardHeader>

          <CardContent className="p-6 pt-6 flex flex-col items-center justify-center gap-8">
            {/* Pie chart skeleton */}
            <div
              className="w-[200px] h-[200px] rounded-full"
              style={{
                background: `
          conic-gradient(
            rgba(124, 58, 237, 0.2) 0% 25%,
            rgba(124, 58, 237, 0.35) 25% 45%,
            rgba(124, 58, 237, 0.15) 45% 65%,
            rgba(124, 58, 237, 0.3) 65% 85%,
            rgba(124, 58, 237, 0.2) 85% 100%
          )
        `,
              }}
            />

            {/* legend skeleton */}
            <div className="w-full space-y-3 max-w-sm">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-violet-900/50 rounded-sm" />
                  <div className="flex-1 h-3 bg-zinc-900 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
