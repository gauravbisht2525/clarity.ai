"use client";

import { useEffect } from "react";
import { X, ArrowUpRight } from "lucide-react";
import type { KeyPoint, Risk } from "@/types/analysis";

type PointItem = KeyPoint | Risk;

function isRisk(item: PointItem): item is Risk {
  return "severity" in item;
}

const severityLabel: Record<Risk["severity"], string> = {
  high: "High Risk",
  medium: "Medium Risk",
  low: "Low Risk",
};

const severityColor: Record<Risk["severity"], string> = {
  high: "#f87171",
  medium: "#fb923c",
  low: "#facc15",
};

interface PointDetailPanelProps {
  item: PointItem | null;
  onClose: () => void;
}

export default function PointDetailPanel({ item, onClose }: PointDetailPanelProps) {
  // Close on Escape — only active while panel is open
  useEffect(() => {
    if (!item) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={[
          "fixed inset-0 bg-black/60 z-40 transition-opacity duration-200",
          item ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      {/* Panel — slides in from right */}
      <div
        className={[
          "fixed top-0 right-0 h-full w-full max-w-[480px] z-50",
          "bg-surface border-l border-border",
          "flex flex-col",
          "transition-transform duration-300 ease-out",
          item ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        {item && (
          <>
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ArrowUpRight className="w-5 h-5 text-accent" strokeWidth={1.5} />
                <span className="font-ui text-[13px] font-medium text-muted uppercase tracking-wide">
                  {isRisk(item) ? "Risk Detail" : "Key Point Detail"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-[10px] bg-surface-elevated flex items-center justify-center text-secondary hover:text-primary transition-colors duration-150"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">

              {/* Severity badge — risks only */}
              {isRisk(item) && (
                <span
                  className="self-start font-ui text-[12px] font-medium rounded px-2 py-0.5"
                  style={{
                    color: severityColor[item.severity],
                    backgroundColor: `${severityColor[item.severity]}18`,
                  }}
                >
                  {severityLabel[item.severity]}
                </span>
              )}

              {/* Title */}
              <h3 className="font-display text-[22px] font-normal leading-[1.4] text-primary">
                {item.title}
              </h3>

              {/* Divider */}
              <div className="h-px bg-divider" />

              {/* Detail text */}
              <p className="font-ui text-[15px] text-secondary leading-[1.6]">
                {isRisk(item) ? item.body : item.detail}
              </p>

              {/* What this means for you */}
              <div className="rounded-xl bg-surface-elevated p-4">
                <p className="font-ui text-[12px] font-medium text-muted uppercase tracking-wide mb-2">
                  What this means for you
                </p>
                <p className="font-ui text-[14px] text-secondary leading-[1.5]">
                  {isRisk(item)
                    ? `This is a ${item.severity} severity risk. Review this carefully before proceeding and consider seeking clarification from the other party.`
                    : "This is an important clause that directly affects your rights or obligations under this document."}
                </p>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
}
