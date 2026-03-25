"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import Header from "@/components/layout/Header";
import SectionCard from "@/components/results/SectionCard";
import KeyPointItem from "@/components/results/KeyPointItem";
import RiskItem from "@/components/results/RiskItem";
import ActionItem from "@/components/results/ActionItem";
import PointDetailPanel from "@/components/results/PointDetailPanel";
import ChatArea from "@/components/results/ChatArea";
import type { DocumentAnalysis, KeyPoint, Risk } from "@/types/analysis";

type SelectedPoint = KeyPoint | Risk | null;

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("clarity_analysis");
    if (!raw) {
      router.replace("/");
      return;
    }
    try {
      setAnalysis(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  function handleUploadNew() {
    sessionStorage.removeItem("clarity_analysis");
    router.push("/");
  }

  function handleExport() {
    if (!analysis) return;

    const lines: string[] = [];

    lines.push(`CLARITY.AI — DOCUMENT ANALYSIS`);
    lines.push(`Document: ${analysis.fileName ?? "Untitled"}`);
    lines.push(`Exported: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
    lines.push("");
    lines.push("═".repeat(60));
    lines.push("");

    lines.push("SUMMARY");
    lines.push("─".repeat(40));
    lines.push(analysis.summary);
    lines.push("");

    lines.push("KEY POINTS");
    lines.push("─".repeat(40));
    analysis.keyPoints.forEach((kp, i) => {
      lines.push(`${i + 1}. ${kp.title}`);
      lines.push(`   ${kp.detail}`);
      lines.push("");
    });

    lines.push("RISKS & RED FLAGS");
    lines.push("─".repeat(40));
    analysis.risks.forEach((r, i) => {
      lines.push(`${i + 1}. [${r.severity.toUpperCase()}] ${r.title}`);
      lines.push(`   ${r.body}`);
      lines.push("");
    });

    lines.push("WHAT YOU SHOULD DO");
    lines.push("─".repeat(40));
    analysis.actions.forEach((a, i) => {
      lines.push(`${i + 1}. ${a.text}`);
    });
    lines.push("");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(analysis.fileName ?? "analysis").replace(/\.[^.]+$/, "")}-clarity.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  if (!analysis) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-4 border-surface-elevated animate-spin"
            style={{ borderTopColor: "var(--color-accent)" }}
          />
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <Header fileName={analysis.fileName} onUploadNew={handleUploadNew} onExport={handleExport} />

        {/* Scrollable section cards */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-[60px] py-4 md:py-8">
          <div className="w-full max-w-[877px] mx-auto flex flex-col gap-4">

            {/* Summary */}
            <SectionCard
              icon={<FileText className="w-5 h-5 text-secondary" strokeWidth={1.5} />}
              title="Summary"
            >
              <p className="font-ui text-[15px] text-secondary leading-[1.6]">
                {analysis.summary}
              </p>
            </SectionCard>

            {/* Key Points */}
            <SectionCard
              icon={<Lightbulb className="w-5 h-5 text-secondary" strokeWidth={1.5} />}
              title="Key Points"
            >
              <div className="flex flex-col divide-y divide-divider">
                {analysis.keyPoints.map((kp) => (
                  <KeyPointItem
                    key={kp.id}
                    item={kp}
                    onClick={setSelectedPoint}
                  />
                ))}
              </div>
            </SectionCard>

            {/* Risks & Red Flags */}
            <SectionCard
              icon={<AlertTriangle className="w-5 h-5 text-secondary" strokeWidth={1.5} />}
              title="Risks & Red Flags"
            >
              <div className="flex flex-col divide-y divide-divider">
                {analysis.risks.map((risk) => (
                  <RiskItem
                    key={risk.id}
                    item={risk}
                    onClick={setSelectedPoint}
                  />
                ))}
              </div>
            </SectionCard>

            {/* What You Should Do */}
            <SectionCard
              icon={<CheckCircle className="w-5 h-5 text-secondary" strokeWidth={1.5} />}
              title="What You Should Do"
            >
              <div className="flex flex-col gap-1">
                {analysis.actions.map((action, i) => (
                  <ActionItem key={action.id} item={action} index={i} />
                ))}
              </div>
            </SectionCard>

          </div>
        </div>

        {/* Fixed chat bar at bottom */}
        <div className="shrink-0 bg-background border-t border-line px-4 sm:px-6 md:px-[60px] py-3 md:py-4">
          <div className="w-full max-w-[877px] mx-auto">
            <ChatArea documentText={analysis.documentText} />
          </div>
        </div>

      </div>

      {/* Point detail panel (slide-in overlay) */}
      <PointDetailPanel
        item={selectedPoint}
        onClose={() => setSelectedPoint(null)}
      />
    </>
  );
}
