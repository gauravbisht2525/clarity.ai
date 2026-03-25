"use client";

import { useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { CloudUpload } from "lucide-react";

const ACCEPTED_TYPES = ["application/pdf", "text/plain"];
const ACCEPTED_EXTENSIONS = [".pdf", ".txt"];
const MAX_BYTES = 4.5 * 1024 * 1024; // 4.5MB — Vercel serverless body limit

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  onError?: (message: string) => void;
}

function isValidFile(file: File): string | null {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
    return "Only PDF and TXT files are supported.";
  }
  if (file.size > MAX_BYTES) {
    return "File exceeds 4.5MB. Try pasting the text instead.";
  }
  return null;
}

export default function DropZone({ onFileSelect, onError }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = isValidFile(file);
    if (err) { onError?.(err); return; }
    onFileSelect(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = isValidFile(file);
    if (err) { onError?.(err); e.target.value = ""; return; }
    onFileSelect(file);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload document"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "w-full rounded-2xl border border-dashed bg-surface",
        "px-8 py-10 flex flex-col items-center gap-3",
        "cursor-pointer select-none",
        "transition-colors duration-150",
        isDragging
          ? "border-accent"
          : "border-border hover:border-accent/50",
      ].join(" ")}
    >
      <CloudUpload
        className={`w-8 h-8 transition-colors duration-150 ${
          isDragging ? "text-accent" : "text-secondary"
        }`}
        strokeWidth={1.5}
      />

      <div className="text-center space-y-1">
        <p className="font-ui text-base text-secondary leading-[1.5]">
          Drag and drop your file here
        </p>
        <p className="font-ui text-[14px] text-accent leading-[1.43]">
          or click to browse
        </p>
      </div>

      <p className="font-ui text-[12px] text-muted leading-[1.333]">
        Supports PDF and TXT up to 4.5MB
      </p>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
