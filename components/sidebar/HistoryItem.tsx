"use client";

import { useState } from "react";
import { FileText, Trash2 } from "lucide-react";
import type { HistoryEntry } from "@/types/history";

interface HistoryItemProps {
  item: HistoryEntry;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export default function HistoryItem({ item, isActive, onClick, onDelete }: HistoryItemProps) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const date = new Date(item.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleting(true);
    try {
      await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
      onDelete(item.id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "group flex items-start gap-2 px-3 py-3 transition-colors duration-150 cursor-pointer",
        isActive ? "bg-surface" : "hover:bg-surface",
      ].join(" ")}
      onClick={onClick}
    >
      <FileText className="w-4 h-4 text-muted shrink-0 mt-0.5" strokeWidth={1.5} />

      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
        <span className="font-ui text-[13px] text-secondary truncate leading-snug">
          {item.file_name}
        </span>
        <span className="font-ui text-[11px] text-muted">{date}</span>
      </div>

      {/* Delete button — visible on hover */}
      {hovered && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Delete"
          className="shrink-0 text-muted hover:text-primary transition-colors duration-150 mt-0.5"
        >
          {deleting
            ? <span className="w-3.5 h-3.5 block rounded-full border border-muted animate-spin" />
            : <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          }
        </button>
      )}
    </div>
  );
}
