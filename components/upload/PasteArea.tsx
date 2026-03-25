"use client";

interface PasteAreaProps {
  value: string;
  onChange: (val: string) => void;
}

export default function PasteArea({ value, onChange }: PasteAreaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste your document text here..."
      className={[
        "w-full min-h-[240px] rounded-2xl border bg-surface",
        "px-6 py-5 resize-none",
        "font-ui text-[15px] text-primary leading-[1.6] placeholder:text-muted",
        "border-border focus:border-accent focus:outline-none",
        "transition-colors duration-150",
      ].join(" ")}
    />
  );
}
