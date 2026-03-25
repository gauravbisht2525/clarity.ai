"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clipboard, Upload } from "lucide-react";
import Header from "@/components/layout/Header";
import DropZone from "@/components/upload/DropZone";
import FileCard from "@/components/upload/FileCard";
import PasteArea from "@/components/upload/PasteArea";
import AnalyzingState from "@/components/states/AnalyzingState";
import AnalyzeButton from "@/components/upload/AnalyzeButton";
import type { DocumentAnalysis } from "@/types/analysis";

type View = "upload" | "file-selected" | "paste" | "analyzing";

export default function HomePage() {
  const router = useRouter();
  const [view, setView] = useState<View>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(file: File) {
    setSelectedFile(file);
    setView("file-selected");
    setError(null);
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setView("upload");
  }

  async function handleAnalyze() {
    const hasContent =
      (view === "file-selected" && selectedFile) ||
      (view === "paste" && pasteText.trim().length > 0);

    if (!hasContent) return;

    setView("analyzing");
    setError(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
        formData.append("fileName", selectedFile.name);
      } else {
        formData.append("text", pasteText);
        formData.append("fileName", "Pasted document");
      }

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const { error: msg } = await res.json();
        throw new Error(msg || "Analysis failed");
      }

      const analysis: DocumentAnalysis = await res.json();
      sessionStorage.setItem("clarity_analysis", JSON.stringify(analysis));
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setView(selectedFile ? "file-selected" : "paste");
    }
  }

  // ── Analyzing fullscreen ──────────────────────────────
  if (view === "analyzing") {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <AnalyzingState />
        </main>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-[60px] py-8 md:py-16 gap-6 md:gap-10">

        {/* Hero */}
        <div className="text-center flex flex-col items-center gap-4 md:gap-6">
          <h1 className="font-display text-[32px] sm:text-[44px] md:text-[60px] font-normal leading-none tracking-[-0.025em] text-primary">
            Understand any document in seconds
          </h1>
          <p className="font-display text-base font-light leading-[1.625] text-secondary max-w-[500px]">
            Upload a contract, agreement, or policy — we'll break it down into
            plain language and tell you what to do.
          </p>
        </div>

        {/* Upload section */}
        <div className="w-full max-w-[877px] flex flex-col gap-4">

          {/* View: default upload dropzone */}
          {view === "upload" && (
            <DropZone onFileSelect={handleFileSelect} onError={setError} />
          )}

          {/* View: file selected */}
          {view === "file-selected" && selectedFile && (
            <>
              <FileCard file={selectedFile} onRemove={handleRemoveFile} />
              <AnalyzeButton onClick={handleAnalyze} />
            </>
          )}

          {/* View: paste text */}
          {view === "paste" && (
            <>
              <PasteArea value={pasteText} onChange={setPasteText} />
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={pasteText.trim().length === 0}
              />
            </>
          )}

          {/* Error message */}
          {error && (
            <p className="font-ui text-[14px] text-center" style={{ color: "#f87171" }}>
              {error}
            </p>
          )}

          {/* Divider */}
          {(view === "upload" || view === "file-selected" || view === "paste") && (
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-divider" />
              <span className="font-ui text-[14px] font-medium text-muted">or</span>
              <div className="flex-1 h-px bg-divider" />
            </div>
          )}

          {/* Toggle between paste and upload */}
          {view === "upload" || view === "file-selected" ? (
            <div className="flex justify-center">
              <button
                onClick={() => { setView("paste"); setSelectedFile(null); }}
                className="flex items-center gap-2 font-ui text-[14px] text-secondary hover:text-primary transition-colors duration-150"
              >
                <Clipboard className="w-4 h-4" strokeWidth={1.5} />
                Paste your text instead
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => { setView("upload"); setPasteText(""); }}
                className="flex items-center gap-2 font-ui text-[14px] text-secondary hover:text-primary transition-colors duration-150"
              >
                <Upload className="w-4 h-4" strokeWidth={1.5} />
                Upload a file instead
              </button>
            </div>
          )}

        </div>

        {/* Trust signal */}
        <p className="font-display text-base font-light leading-[1.625] text-secondary">
          Your document is never stored
        </p>

      </main>
    </div>
  );
}

