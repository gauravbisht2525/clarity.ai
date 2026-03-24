import Header from "@/components/layout/Header";
import DropZone from "@/components/upload/DropZone";
import PasteToggle from "@/components/upload/PasteToggle";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-10">

        {/* Hero — full width, centered text */}
        <div className="text-center space-y-4">
          <h1 className="text-[56px] font-normal leading-[1.15] tracking-tight text-primary">
            Understand any document in seconds
          </h1>
          <p className="text-base text-secondary leading-relaxed max-w-lg mx-auto">
            Upload a contract, agreement, or policy — we'll break it down into
            plain language and tell you what to do.
          </p>
        </div>

        {/* Upload section — constrained width */}
        <div className="w-full max-w-[780px] flex flex-col items-center gap-6">

          {/* Upload card */}
          <DropZone />

          {/* Divider */}
          <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[13px] text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Paste option */}
          <PasteToggle />

        </div>

        {/* Trust signal */}
        <p className="text-[13px] text-muted italic">
          Your document is never stored
        </p>

      </main>
    </div>
  );
}
