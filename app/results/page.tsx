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
      <div className="flex flex-col min-h-screen bg-background">
        <Header fileName={analysis.fileName} onUploadNew={handleUploadNew} />

        <main className="flex-1 flex flex-col items-center px-[60px] py-8 gap-4">
          <div className="w-full max-w-[877px] flex flex-col gap-4">

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

            {/* Divider */}
            <div className="h-px bg-divider" />

            {/* Chat area */}
            <ChatArea documentText={analysis.documentText} />

            {/* Bottom padding */}
            <div className="h-8" />

          </div>
        </main>
      </div>

      {/* Point detail panel (slide-in overlay) */}
      <PointDetailPanel
        item={selectedPoint}
        onClose={() => setSelectedPoint(null)}
      />
    </>
  );
}
