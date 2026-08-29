import Waves from "@/components/backgrounds/Waves";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BarChart3, TrendingUp, Users } from "lucide-react";
import { BarChartComponent } from "./charts/bar-chart";
import { vi } from "date-fns/locale";
import { AreaChartComponent } from "./charts/area-chart";
import { Sparkles, Download, Maximize2 } from "lucide-react";

interface GeneratedChartsProps {
  data: any;
  visualHint: "area-chart" | "bar-chart";
}

export default function GeneratedChartsContainer({ data, visualHint }: GeneratedChartsProps) {
  return (
    <div className="group relative flex flex-col w-full h-full min-h-[400px] rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden transition-all duration-500 hover:border-zinc-700">
      
      {/* 1. Dotted Background Pattern - dodá hloubku */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3f3f46 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* 2. Top Bar - Kontext pro uživatele */}
      <div className="z-10 flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/20 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-violet-500/10 border border-violet-500/20">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          </div>
          <span className="text-xs font-medium text-zinc-400 tracking-wide uppercase">
            AI Generated Insight
          </span>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-200">
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-zinc-200">
            <Maximize2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="z-10 relative flex-1 flex flex-col items-center justify-center p-6 w-full h-full">
        {/* Subtle radial glow za grafem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-500/5 blur-[100px] pointer-events-none" />
        
        <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
          {visualHint === "area-chart" && <AreaChartComponent data={data} />}
          {visualHint === "bar-chart" && <BarChartComponent data={data} />}
        </div>
      </div>

      {/* 4. Bottom Info / Meta (volitelné) */}
      <div className="z-10 px-5 py-2 border-t border-zinc-800/30 bg-black/20">
        <p className="text-[10px] text-zinc-600 italic">
          Data source: Live Analytics Pipeline • Real-time update
        </p>
      </div>
    </div>
  );
}
