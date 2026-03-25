"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, AlertTriangle, CheckCircle, Lightbulb, Send } from "lucide-react";
import Header from "@/components/layout/Header";
import SectionCard from "@/components/results/SectionCard";
import KeyPointItem from "@/components/results/KeyPointItem";
import RiskItem from "@/components/results/RiskItem";
import ActionItem from "@/components/results/ActionItem";
import PointDetailPanel from "@/components/results/PointDetailPanel";
import type { DocumentAnalysis, KeyPoint, Risk, ChatMessage } from "@/types/analysis";

type SelectedPoint = KeyPoint | Risk | null;

const QUICK_CHIPS = [
  "Explain this simply",
  "Is this safe to proceed?",
  "What should I negotiate?",
  "What are my obligations?",
];

export default function ResultsPage() {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>(null);

  // Chat state — lifted here so messages render inside the scroll area
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("clarity_analysis");
    if (!raw) { router.replace("/"); return; }
    try {
      setAnalysis(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Scroll to bottom whenever messages or loading changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  async function sendMessage(text: string) {
    if (!text.trim() || chatLoading || !analysis) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, documentText: analysis.documentText, history: messages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Sorry, I couldn't get a response. Please try again." }]);
    } finally {
      setChatLoading(false);
    }
  }

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
    lines.push("", "═".repeat(60), "");
    lines.push("SUMMARY", "─".repeat(40));
    lines.push(analysis.summary, "");
    lines.push("KEY POINTS", "─".repeat(40));
    analysis.keyPoints.forEach((kp, i) => { lines.push(`${i + 1}. ${kp.title}`, `   ${kp.detail}`, ""); });
    lines.push("RISKS & RED FLAGS", "─".repeat(40));
    analysis.risks.forEach((r, i) => { lines.push(`${i + 1}. [${r.severity.toUpperCase()}] ${r.title}`, `   ${r.body}`, ""); });
    lines.push("WHAT YOU SHOULD DO", "─".repeat(40));
    analysis.actions.forEach((a, i) => { lines.push(`${i + 1}. ${a.text}`); });
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
          <div className="w-10 h-10 rounded-full border-4 border-surface-elevated animate-spin"
            style={{ borderTopColor: "var(--color-accent)" }} />
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        <Header fileName={analysis.fileName} onUploadNew={handleUploadNew} onExport={handleExport} />

        {/* ── Single scrollable area: section cards + chat messages ── */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-[60px] py-4 md:py-8">
          <div className="w-full max-w-[877px] mx-auto flex flex-col gap-4">

            {/* Summary */}
            <SectionCard icon={<FileText className="w-5 h-5 text-secondary" strokeWidth={1.5} />} title="Summary">
              <p className="font-ui text-[15px] text-secondary leading-[1.6]">{analysis.summary}</p>
            </SectionCard>

            {/* Key Points */}
            <SectionCard icon={<Lightbulb className="w-5 h-5 text-secondary" strokeWidth={1.5} />} title="Key Points">
              <div className="flex flex-col divide-y divide-divider">
                {analysis.keyPoints.map((kp) => (
                  <KeyPointItem key={kp.id} item={kp} onClick={setSelectedPoint} />
                ))}
              </div>
            </SectionCard>

            {/* Risks & Red Flags */}
            <SectionCard icon={<AlertTriangle className="w-5 h-5 text-secondary" strokeWidth={1.5} />} title="Risks & Red Flags">
              <div className="flex flex-col divide-y divide-divider">
                {analysis.risks.map((risk) => (
                  <RiskItem key={risk.id} item={risk} onClick={setSelectedPoint} />
                ))}
              </div>
            </SectionCard>

            {/* What You Should Do */}
            <SectionCard icon={<CheckCircle className="w-5 h-5 text-secondary" strokeWidth={1.5} />} title="What You Should Do">
              <div className="flex flex-col gap-1">
                {analysis.actions.map((action, i) => (
                  <ActionItem key={action.id} item={action} index={i} />
                ))}
              </div>
            </SectionCard>

            {/* ── Chat divider ── */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1 h-px bg-divider" />
              <span className="font-ui text-[13px] text-muted">Ask a question</span>
              <div className="flex-1 h-px bg-divider" />
            </div>

            {/* ── Quick chips — shown before first message ── */}
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {QUICK_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => sendMessage(chip)}
                    className="font-ui text-[14px] text-secondary border border-border rounded-[10px] px-3 py-2 hover:text-primary hover:border-secondary bg-surface transition-colors duration-150"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* ── Chat messages — flow naturally in scroll area ── */}
            {messages.length > 0 && (
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={[
                      "max-w-[80%] rounded-2xl px-4 py-3",
                      "font-ui text-[15px] leading-[1.6]",
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-surface border border-border text-secondary rounded-bl-sm",
                    ].join(" ")}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1 items-center h-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scroll anchor — always at the bottom of content */}
            <div ref={bottomRef} className="pb-2" />

          </div>
        </div>

        {/* ── Fixed input bar — always visible at the bottom ── */}
        <div className="shrink-0 bg-background border-t border-line px-4 sm:px-6 md:px-[60px] py-3 md:py-4">
          <div className="w-full max-w-[877px] mx-auto">
            <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-accent transition-colors duration-150">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(chatInput)}
                placeholder="Ask anything about this document..."
                className="flex-1 bg-transparent font-ui text-[15px] text-primary placeholder:text-muted outline-none leading-[1.21]"
              />
              <button
                onClick={() => sendMessage(chatInput)}
                disabled={!chatInput.trim() || chatLoading}
                aria-label="Send message"
                className={[
                  "shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150",
                  chatInput.trim() && !chatLoading
                    ? "bg-accent text-white hover:bg-accent-dark"
                    : "bg-surface-elevated text-muted cursor-not-allowed",
                ].join(" ")}
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Point detail panel */}
      <PointDetailPanel item={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </>
  );
}
