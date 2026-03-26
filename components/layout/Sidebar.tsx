"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { LogIn, Upload } from "lucide-react";
import HistoryItem from "@/components/sidebar/HistoryItem";
import type { HistoryEntry } from "@/types/history";
import type { DocumentAnalysis } from "@/types/analysis";

interface SidebarProps {
  activeHistoryId?: string;
  refreshKey?: number;
  onSelectAnalysis?: (analysis: DocumentAnalysis, id?: string) => void;
  onUploadNew?: () => void;
}

export default function Sidebar({ activeHistoryId, refreshKey = 0, onSelectAnalysis, onUploadNew }: SidebarProps) {
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

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-line bg-background">

      {/* Upload New button */}
      <div className="px-3 py-4 border-b border-line shrink-0">
        <button
          onClick={onUploadNew}
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

        {/* Loading */}
        {(!isLoaded || loading) && (
          <div className="flex justify-center py-8">
            <div
              className="w-4 h-4 rounded-full border-2 border-border animate-spin"
              style={{ borderTopColor: "var(--color-muted)" }}
            />
          </div>
        )}

        {/* Not signed in */}
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

        {/* Empty state */}
        {isLoaded && !loading && isSignedIn && history.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="font-ui text-[12px] text-muted leading-[1.5]">
              Your analyses will appear here
            </p>
          </div>
        )}

        {/* History items */}
        {isLoaded && !loading && isSignedIn && history.length > 0 &&
          history.map((item) => (
            <HistoryItem
              key={item.id}
              item={item}
              isActive={item.id === activeHistoryId}
              onClick={() =>
                onSelectAnalysis?.({
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
    </aside>
  );
}
