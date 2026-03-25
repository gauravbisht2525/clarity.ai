"use client";

import { useRef, useState } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { CloudUpload } from "lucide-react";

export default function DropZone() {
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
    if (file) handleFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleFile(file: File) {
    // TODO: wire up to document processing pipeline
    console.log("File selected:", file.name);
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
        <p className="font-ui text-base text-secondary">
          Drag and drop your file here
        </p>
        <p className="font-ui text-[14px] text-accent">
          or click to browse
        </p>
      </div>

      <p className="font-ui text-[12px] text-muted">
        Supports PDF and TXT up to 10MB
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
