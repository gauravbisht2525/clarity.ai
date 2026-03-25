"use client";

import { useEffect, useState } from "react";

const STAGES = [
  { label: "Reading document", duration: 1200 },
  { label: "Extracting key content", duration: 1800 },
  { label: "Analyzing risks & actions", duration: 2200 },
  { label: "Preparing your results", duration: 1000 },
];

export default function AnalyzingState() {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Advance through stages
  useEffect(() => {
    let elapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    STAGES.forEach((stage, i) => {
      const t = setTimeout(() => {
        setStageIndex(i);
      }, elapsed);
      timers.push(t);
      elapsed += stage.duration;
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Animate progress bar
  useEffect(() => {
    const target = Math.min(((stageIndex + 1) / STAGES.length) * 92, 92);
    const step = (target - progress) / 20;
    if (Math.abs(target - progress) < 0.5) return;

    const raf = requestAnimationFrame(() => {
      setProgress((p) => p + step);
    });
    return () => cancelAnimationFrame(raf);
  });

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[420px] mb-[12vh]">
      {/* Spinner */}
      <div
        className="w-12 h-12 rounded-full border-4 border-border animate-spin"
        style={{ borderTopColor: "var(--color-primary)" }}
      />

      {/* Copy */}
      <div className="text-center space-y-1.5 w-full">
        <p className="font-display text-[20px] font-normal leading-[1.5] text-primary">
          Analyzing your document...
        </p>
        <p className="font-ui text-[14px] text-muted leading-[1.43]">
          {STAGES[stageIndex].label}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full flex flex-col gap-2">
        <div className="w-full h-1.5 rounded-full bg-surface-elevated overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              backgroundColor: "var(--color-secondary)",
            }}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-ui text-[12px] text-muted">
            {STAGES[stageIndex].label}
          </span>
          <span className="font-ui text-[12px] text-muted">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
