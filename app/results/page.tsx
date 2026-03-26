"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FileText, AlertTriangle, CheckCircle, Lightbulb, Send } from "lucide-react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
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
  const { isSignedIn } = useUser();
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [contentKey, setContentKey] = useState("fresh");
  const [activeHistoryId, setActiveHistoryId] = useState<string | undefined>(undefined);
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint>(null);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const hasSaved = useRef(false);

  // Load from sessionStorage on first render
  useEffect(() => {
    const raw = sessionStorage.getItem("clarity_analysis");
    if (!raw) { router.replace("/"); return; }
    try {
      setAnalysis(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Auto-save to history for fresh uploads (only when documentText is present)
  useEffect(() => {
    if (!analysis || !isSignedIn || hasSaved.current || !analysis.documentText) return;
    hasSaved.current = true;

    fetch("/api/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: analysis.fileName ?? "Document",
        summary: analysis.summary,
        keyPoints: analysis.keyPoints,
        risks: analysis.risks,
        actions: analysis.actions,
      }),
    })
      .then((r) => { if (r.ok) setSidebarRefresh((k) => k + 1); })
      .catch(() => {});
  }, [analysis, isSignedIn]);

  // Scroll chat to bottom only when there are messages
  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // Switch to a history item — force full content re-render via contentKey
  function handleSelectFromHistory(historical: DocumentAnalysis, id?: string) {
    setAnalysis(historical);
    setActiveHistoryId(id);
    setContentKey(id ?? historical.fileName ?? "history");
    setMessages([]);
    setChatInput("");
    setSelectedPoint(null);
    hasSaved.current = true;
  }

  function handleUploadNew() {
    sessionStorage.removeItem("clarity_analysis");
    router.push("/");
  }

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
        body: JSON.stringify({
          message: text,
          documentText: analysis.documentText ?? "",
          analysis: {
            summary: analysis.summary,
            keyPoints: analysis.keyPoints,
            risks: analysis.risks,
            actions: analysis.actions,
          },
          history: messages,
        }),
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

  if (!analysis) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-border animate-spin"
            style={{ borderTopColor: "var(--color-primary)" }} />
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen flex bg-background">

        {/* Sidebar */}
        <Sidebar
          activeHistoryId={activeHistoryId}
          refreshKey={sidebarRefresh}
          onSelectAnalysis={handleSelectFromHistory}
          onUploadNew={handleUploadNew}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onMenuToggle={() => setMobileMenuOpen(true)} />

          {/* Scrollable results — key forces full remount when document switches */}
          <div key={contentKey} className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-[60px] py-4 md:py-8">
            <div className="w-full max-w-[877px] mx-auto flex flex-col gap-4">

              {/* Document name shown here instead of header */}
              {analysis.fileName && (
                <div className="flex items-center gap-3 pb-2">
                  <span className="font-ui text-[15px] text-secondary truncate">{analysis.fileName}</span>
                  <span className="font-ui text-[12px] text-success bg-success-bg rounded px-2 py-0.5 shrink-0">
                    Analyzed
                  </span>
                </div>
              )}

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

              {/* Chat divider */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex-1 h-px bg-divider" />
                <span className="font-ui text-[13px] text-muted">Ask a question</span>
                <div className="flex-1 h-px bg-divider" />
              </div>

              {/* Quick chips — before first message */}
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

              {/* Chat messages */}
              {messages.length > 0 && (
                <div className="flex flex-col gap-3">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={[
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        "font-ui text-[15px] leading-[1.6]",
                        msg.role === "user"
                          ? "bg-surface-elevated border border-line text-primary rounded-br-sm"
                          : "bg-surface border border-border text-secondary rounded-bl-sm",
                      ].join(" ")}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

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

              <div ref={bottomRef} className="pb-2" />
            </div>
          </div>

          {/* Chat input bar */}
          <div className="shrink-0 bg-background border-t border-line px-4 sm:px-6 md:px-[60px] py-3 md:py-4">
            <div className="w-full max-w-[877px] mx-auto">
              <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-muted transition-colors duration-150">
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
                      ? "bg-surface-elevated text-primary hover:bg-line"
                      : "bg-surface-elevated text-muted cursor-not-allowed",
                  ].join(" ")}
                >
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Point detail panel */}
      <PointDetailPanel item={selectedPoint} onClose={() => setSelectedPoint(null)} />
    </>
  );
}
