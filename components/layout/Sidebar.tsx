"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { LogIn, Upload, X } from "lucide-react";
import HistoryItem from "@/components/sidebar/HistoryItem";
import type { HistoryEntry } from "@/types/history";
import type { DocumentAnalysis } from "@/types/analysis";

interface SidebarProps {
  activeHistoryId?: string;
  refreshKey?: number;
  onSelectAnalysis?: (analysis: DocumentAnalysis, id?: string) => void;
  onUploadNew?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({
  activeHistoryId,
  refreshKey = 0,
  onSelectAnalysis,
  onUploadNew,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const { isSignedIn, isLoaded } = useUser();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { setHistory([]); return; }
    setLoading(true);
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [isSignedIn, refreshKey]);

  function handleDelete(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }

  function handleSelect(analysis: DocumentAnalysis, id?: string) {
    onSelectAnalysis?.(analysis, id);
    onMobileClose?.(); // auto-close drawer on mobile after selection
  }

  function handleUploadNew() {
    onUploadNew?.();
    onMobileClose?.();
  }

  // Shared inner content
  const content = (
    <>
      {/* Upload New button */}
      <div className="px-3 py-4 border-b border-line shrink-0">
        <button
          onClick={handleUploadNew}
          className="w-full flex items-center gap-2 font-ui text-[13px] font-medium text-secondary border border-border rounded-xl px-3 py-2.5 hover:text-primary hover:border-secondary bg-surface transition-colors duration-150"
        >
          <Upload className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          Upload New
        </button>
      </div>

      {/* History label */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <span className="font-ui text-[11px] font-medium text-muted uppercase tracking-widest">
          History
        </span>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto pb-2">

        {(!isLoaded || loading) && (
          <div className="flex justify-center py-8">
            <div
              className="w-4 h-4 rounded-full border-2 border-border animate-spin"
              style={{ borderTopColor: "var(--color-muted)" }}
            />
          </div>
        )}

        {isLoaded && !loading && !isSignedIn && (
          <div className="flex flex-col items-center gap-3 px-4 py-6 text-center">
            <p className="font-ui text-[12px] text-muted leading-[1.5]">
              Sign in to save and view your history
            </p>
            <SignInButton mode="modal">
              <button className="flex items-center gap-1.5 font-ui text-[12px] text-secondary border border-border rounded-[10px] px-3 py-2 hover:text-primary hover:border-secondary transition-colors duration-150">
                <LogIn className="w-3.5 h-3.5" strokeWidth={1.5} />
                Sign in
              </button>
            </SignInButton>
          </div>
        )}

        {isLoaded && !loading && isSignedIn && history.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="font-ui text-[12px] text-muted leading-[1.5]">
              Your analyses will appear here
            </p>
          </div>
        )}

        {isLoaded && !loading && isSignedIn && history.length > 0 &&
          history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              isActive={item.id === activeHistoryId}
              onClick={() =>
                handleSelect({
                  summary: item.summary,
                  keyPoints: item.key_points,
                  risks: item.risks,
                  actions: item.actions,
                  documentText: "",
                  fileName: item.file_name,
                }, item.id)
              }
              onDelete={handleDelete}
            />
          ))
        }
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop sidebar (in-flow) ── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-background">
        {content}
      </aside>

      {/* ── Mobile drawer (fixed overlay) ── */}
      <div className="md:hidden">
        {/* Backdrop */}
        <div
          className={[
            "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200",
            mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
          ].join(" ")}
          onClick={onMobileClose}
          aria-hidden="true"
        />

        {/* Drawer panel */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-line bg-background transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {/* Drawer header with close button */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-line shrink-0">
            <span className="font-display text-xl font-light text-white tracking-tight">
              Clarity.ai
            </span>
            <button
              onClick={onMobileClose}
              aria-label="Close menu"
              className="text-muted hover:text-secondary transition-colors duration-150"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          {content}
        </aside>
      </div>
    </>
  );
}
