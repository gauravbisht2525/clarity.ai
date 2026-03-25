import type { ReactNode } from "react";

interface SectionCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

export default function SectionCard({ icon, title, children }: SectionCardProps) {
  return (
    <div className="w-full rounded-2xl border border-border bg-surface p-6 flex flex-col gap-5">
      {/* Header row */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[10px] bg-surface-elevated flex items-center justify-center shrink-0">
          {icon}
        </div>
        <h2 className="font-display text-[20px] font-normal leading-[1.5] text-primary">
          {title}
        </h2>
      </div>

      {/* Content */}
      <div>{children}</div>
    </div>
  );
}
