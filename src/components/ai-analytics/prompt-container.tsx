import Waves from "@/components/backgrounds/Waves";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BarChart3, TrendingUp, Users } from "lucide-react";

export function PromptContainer({ setIsGenerating }: { setIsGenerating: any }) {
  const suggestions = [
    { label: "Top listened beat", icon: <TrendingUp className="w-3 h-3" /> },
    { label: "Audience from Instagram", icon: <Users className="w-3 h-3" /> },
    { label: "Monthly revenue stats", icon: <BarChart3 className="w-3 h-3" /> },
  ];
  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full rounded-xl border border-zinc-800 bg-black px-4 overflow-hidden">
      <Waves
        className="opacity-15 absolute inset-0"
        lineColor="#ffffff"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        waveSpeedX={0.01}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="z-10 w-full max-w-2xl flex flex-col items-center gap-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center justify-center gap-2">
            Ai Analytics
          </h2>
          <p className="text-zinc-500 text-center text-sm">
            Type your query and I'll generate{" "}
            <span className="font-bold">dynamic charts, graphs,</span> and
            <span className="font-bold"> visual reports</span> from your music
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-full hover:bg-zinc-800 hover:text-zinc-200 "
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-xl blur opacity-0 " />
          <div className="relative flex items-center bg-black border border-zinc-800 rounded-xl px-4 py-2 shadow-2xl">
            <Input
              placeholder="Ask a question about your beats..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200 placeholder:text-zinc-600 h-12"
            />
            <Button
              size="icon"
              onClick={() => setIsGenerating(true)}
              className=" hover:opacity-70 hover:cursor-pointer rounded-lg transition-all"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 bg-black rounded-md p-3 ">
          <div className="opacity-60 flex items-center gap-2">
            <span className="text-[12px] text-zinc-500 font-medium">
              Powered by
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-gradient-to-tr from-blue-400 to-red-400 rounded-full animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                Gemini
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
