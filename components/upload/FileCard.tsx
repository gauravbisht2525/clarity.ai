"use client";

import { FileText, X } from "lucide-react";

interface FileCardProps {
  file: File;
  onRemove: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileCard({ file, onRemove }: FileCardProps) {
  return (
    <div className="w-full rounded-2xl border border-border bg-surface px-6 py-5">
      <div className="flex items-center gap-4">

        {/* File icon container */}
        <div className="shrink-0 w-10 h-10 rounded-[10px] bg-surface-elevated flex items-center justify-center">
          <FileText className="w-5 h-5 text-secondary" strokeWidth={1.5} />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="font-ui text-base font-medium text-primary leading-[1.5] truncate">
            {file.name}
          </p>
          <p className="font-ui text-[14px] text-muted leading-[1.5]">
            {formatBytes(file.size)}
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove file"
          className="shrink-0 w-8 h-8 rounded-[10px] bg-surface-elevated flex items-center justify-center text-secondary hover:text-primary transition-colors duration-150"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

      </div>
    </div>
  );
}
