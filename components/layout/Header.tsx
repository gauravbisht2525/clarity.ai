import { Upload, Download } from "lucide-react";

interface HeaderProps {
  fileName?: string
  onUploadNew?: () => void
  onExport?: () => void
}

export default function Header({ fileName, onUploadNew, onExport }: HeaderProps) {
  return (
    <header className="w-full border-b border-line shrink-0">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-[60px] h-16 md:h-24 flex items-center justify-between">

        {/* Logo */}
        <span className="font-display text-2xl font-light text-white tracking-tight">
          Clarity.ai
        </span>

        {/* Right side — only shown on results page */}
        {fileName && (
          <div className="flex items-center gap-2 md:gap-4">
            {/* File name + badge — filename hidden on mobile */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:block font-ui text-sm text-secondary truncate max-w-[160px] md:max-w-[240px]">
                {fileName}
              </span>
              <span className="font-ui text-[12px] text-success bg-success-bg rounded px-2 py-0.5">
                Analyzed
              </span>
            </div>

            {/* Action buttons — icon-only on mobile, labeled on md+ */}
            <div className="flex items-center gap-2">
              <button
                onClick={onUploadNew}
                title="Upload New"
                className="flex items-center gap-2 font-ui text-sm font-medium text-secondary border border-border rounded-xl px-3 md:px-4 py-2 hover:text-primary hover:border-secondary transition-colors duration-150"
              >
                <Upload className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden md:inline">Upload New</span>
              </button>
              <button
                onClick={onExport}
                title="Export"
                className="flex items-center gap-2 font-ui text-sm font-medium text-secondary border border-border rounded-xl px-3 md:px-4 py-2 hover:text-primary hover:border-secondary transition-colors duration-150"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden md:inline">Export</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
