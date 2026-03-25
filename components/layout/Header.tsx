import { Upload, Download } from "lucide-react";

interface HeaderProps {
  fileName?: string
  onUploadNew?: () => void
}

export default function Header({ fileName, onUploadNew }: HeaderProps) {
  return (
    <header className="w-full border-b border-line shrink-0">
      <div className="max-w-[1320px] mx-auto px-[60px] h-24 flex items-center justify-between">

        {/* Logo */}
        <span className="font-display text-2xl font-light text-white tracking-tight">
          Clarity.ai
        </span>

        {/* Right side — only shown on results page */}
        {fileName && (
          <div className="flex items-center gap-4">
            {/* File name + badge */}
            <div className="flex items-center gap-2">
              <span className="font-ui text-sm text-secondary truncate max-w-[240px]">
                {fileName}
              </span>
              <span className="font-ui text-[12px] text-success bg-success-bg rounded px-2 py-0.5">
                Analyzed
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={onUploadNew}
                className="flex items-center gap-2 font-ui text-sm font-medium text-secondary border border-border rounded-xl px-4 py-2 hover:text-primary hover:border-secondary transition-colors duration-150"
              >
                <Upload className="w-4 h-4" strokeWidth={1.5} />
                Upload New
              </button>
              <button className="flex items-center gap-2 font-ui text-sm font-medium text-secondary border border-border rounded-xl px-4 py-2 hover:text-primary hover:border-secondary transition-colors duration-150">
                <Download className="w-4 h-4" strokeWidth={1.5} />
                Export
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
