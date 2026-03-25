export default function AnalyzingState() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Spinner */}
      <div
        className="w-12 h-12 rounded-full border-4 border-surface-elevated animate-spin"
        style={{ borderTopColor: "var(--color-accent)" }}
      />

      {/* Copy */}
      <div className="text-center space-y-2">
        <p className="font-display text-[20px] font-normal leading-[1.5] text-primary">
          Analyzing your document...
        </p>
        <p className="font-ui text-[14px] text-muted leading-[1.43]">
          This will just take a moment
        </p>
      </div>
    </div>
  );
}
