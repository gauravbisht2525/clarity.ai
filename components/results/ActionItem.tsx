import type { Action } from "@/types/analysis";

interface ActionItemProps {
  item: Action;
  index: number;
}

export default function ActionItem({ item, index }: ActionItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      {/* Step number */}
      <span className="shrink-0 w-5 h-5 rounded-full bg-surface-elevated flex items-center justify-center font-ui text-[11px] font-medium text-muted mt-[1px]">
        {index + 1}
      </span>
      <p className="font-ui text-[15px] text-secondary leading-[1.6]">
        {item.text}
      </p>
    </div>
  );
}
