"use client";
import { DesignInput } from "./design-input";
import IsGeneratingState from "./is-generating-state";
import { useState } from "react";

export default function AiAnalyticsContainer() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  return (
    <section className="h-[72vh]">
      {!isGenerating && <DesignInput setIsGenerating={setIsGenerating} />}

      {isGenerating && <IsGeneratingState />}
    </section>
  );
}
