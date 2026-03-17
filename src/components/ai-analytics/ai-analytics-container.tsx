"use client";
IsGeneratingSkeleton;
import { useState } from "react";
import { PromptContainer } from "./prompt-container";
import IsGeneratingSkeleton from "./is-generating-skeleton";
import GeneratedChartsContainer from "./generated-charts-container";

export default function AiAnalyticsContainer() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const rawData = analysisResult?.data?.data || analysisResult?.data || [];
  const hint =
    analysisResult?.data?.visualHint || analysisResult?.visualHint || "";

  return (
    <section className="h-[72vh]">
      {!isGenerating && !isGenerated && (
        <PromptContainer
          setIsGenerating={setIsGenerating}
          setIsGenerated={setIsGenerated}
          setAnalysisResult={setAnalysisResult}
        />
      )}

      {isGenerating && <IsGeneratingSkeleton />}

      {isGenerated && analysisResult && (
        <GeneratedChartsContainer
          data={Array.isArray(rawData) ? rawData : []}
          visualHint={hint}
        />
      )}
    </section>
  );
}
