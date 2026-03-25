"use client";

import { ArrowRight } from "lucide-react";
import type { KeyPoint } from "@/types/analysis";

interface KeyPointItemProps {
  item: KeyPoint;
  onClick: (item: KeyPoint) => void;
}

export default function KeyPointItem({ item, onClick }: KeyPointItemProps) {
  return (
    <button
      onClick={() => onClick(item)}
      className="group w-full flex items-start gap-3 py-3 text-left rounded-xl px-3 -mx-3 hover:bg-surface-elevated transition-colors duration-150"
    >
      {/* Bullet */}
      <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-success" />

      {/* Text */}
      <p className="flex-1 font-ui text-[15px] text-secondary leading-[1.6]">
        {item.title}
      </p>

      {/* Arrow — appears on hover */}
      <ArrowRight
        className="mt-[2px] shrink-0 w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-150"
        strokeWidth={1.5}
      />
    </button>
  );
}
