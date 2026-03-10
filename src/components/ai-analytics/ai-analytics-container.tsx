"use client";
IsGeneratingSkeleton;
import { useState } from "react";
import { PromptContainer } from "./prompt-container";
import IsGeneratingSkeleton from "./is-generating-skeleton";
import { GeneratedChartsContaier } from "./generated-charts-container";

export default function AiAnalyticsContainer() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(true);

  return (
    <section className="h-[72vh]">
      {!isGenerating && !isGenerated && (
        <PromptContainer setIsGenerating={setIsGenerating} />
      )}

      {isGenerating && <IsGeneratingSkeleton />}

      {isGenerated && <GeneratedChartsContaier />}
    </section>
  );
}
