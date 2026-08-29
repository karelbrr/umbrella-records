import Waves from "@/components/backgrounds/Waves";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BarChart3, TrendingUp, Users } from "lucide-react";
import { useForm } from "react-hook-form";

export function PromptContainer({
  setIsGenerating,
  setIsGenerated,
  setAnalysisResult,
}: {
  setIsGenerating: any;
  setIsGenerated: any;
  setAnalysisResult: any;
}) {
  const { register, handleSubmit, setValue } = useForm();

  const handleSearch = async (query: string) => {
    setIsGenerating(true);
    setIsGenerated(false);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: query }] }),
      });

      const data = await response.json();

      if (data.toolResults && data.toolResults.length > 0) {
        const output = data.toolResults[0].output;

        console.log("Surový výstup z AI:", output);

        if (Array.isArray(output)) {
          setAnalysisResult({
            data: output,
            visualHint: query.toLowerCase().includes("traffic")
              ? "area-chart"
              : "leaderboard-list",
          });
        } else {
          setAnalysisResult(output);
        }

        setIsGenerated(true);
      } else {
        console.log("AI odpovědělo jen textem.");
      }
    } catch (error) {
      console.error("Chyba:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  const onSubmit = (data: any) => {
    handleSearch(data.query);
  };

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
              onClick={() => setValue("query", item.label)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-full hover:bg-zinc-800 hover:text-zinc-200 "
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <div className="relative w-full max-w-2xl mx-auto group">
          <form
            className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-1.5 pl-4 shadow-[0_20px_50px_rgba(0,0,0,1)] focus-within:border-zinc-600 transition-all duration-300"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              placeholder="Analyze your music data..."
              className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-100 placeholder:text-zinc-600 h-11 text-sm font-light"
              {...register("query", { required: true })}
            />

            <Button
              type="submit"
              className="group/btn relative overflow-hidden bg-white hover:bg-zinc-200 text-black rounded-xl px-5 h-11 flex items-center gap-2 transition-all duration-300 active:scale-95"
            >
              {/* <span className="text-[13px] font-medium tracking-tight">
                Generate
              </span> */}
              <div className="relative w-4 h-4 overflow-hidden">
                <Send className="w-full h-full" />
              </div>
            </Button>
          </form>

          {/* Subtilní spodní linka pro "tech" pocit */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent opacity-50" />
        </div>

        {/* <div className="flex items-center gap-2 mt-1 bg-black rounded-md p-3 ">
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
        </div> */}
      </div>
    </div>
  );
}
