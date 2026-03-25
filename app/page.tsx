import Header from "@/components/layout/Header";
import DropZone from "@/components/upload/DropZone";
import PasteToggle from "@/components/upload/PasteToggle";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-[60px] py-16 gap-10">

        {/* Hero */}
        <div className="text-center flex flex-col items-center gap-6">
          <h1 className="font-display text-[60px] font-normal leading-none tracking-[-0.025em] text-primary">
            Understand any document in seconds
          </h1>
          <p className="font-display text-base font-light leading-[1.625] text-secondary max-w-[500px]">
            Upload a contract, agreement, or policy — we'll break it down into
            plain language and tell you what to do.
          </p>
        </div>

        {/* Upload section */}
        <div className="w-full max-w-[877px] flex flex-col items-center gap-6">

          <DropZone />

          {/* Divider */}
          <div className="w-full flex items-center gap-4">
            <div className="flex-1 h-px bg-divider" />
            <span className="font-ui text-[14px] font-medium text-muted">or</span>
            <div className="flex-1 h-px bg-divider" />
          </div>

          <PasteToggle />

        </div>

        {/* Trust signal */}
        <p className="font-display text-base font-light leading-[1.625] text-secondary">
          Your document is never stored
        </p>

      </main>
    </div>
  );
}
