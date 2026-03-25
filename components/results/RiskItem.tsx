"use client";

import { ArrowRight } from "lucide-react";
import type { Risk } from "@/types/analysis";

interface RiskItemProps {
  item: Risk;
  onClick: (item: Risk) => void;
}

const severityDot: Record<Risk["severity"], string> = {
  high: "#f87171",
  medium: "#fb923c",
  low: "#facc15",
};

export default function RiskItem({ item, onClick }: RiskItemProps) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group w-full flex items-start gap-3 py-3 text-left rounded-xl px-3 -mx-3 hover:bg-surface-elevated transition-colors duration-150"
    >
      {/* Severity dot */}
      <span
        className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: severityDot[item.severity] }}
      />

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-ui text-[15px] font-medium text-primary leading-[1.5]">
          {item.title}
        </p>
        <p className="font-ui text-[14px] text-muted leading-[1.43] mt-0.5 line-clamp-2">
          {item.body}
        </p>
      </div>

      {/* Arrow */}
      <ArrowRight
        className="mt-[2px] shrink-0 w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-150"
        strokeWidth={1.5}
      />
    </button>
  );
}
