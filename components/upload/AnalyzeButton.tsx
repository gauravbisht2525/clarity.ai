interface AnalyzeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export default function AnalyzeButton({ onClick, disabled = false }: AnalyzeButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          "rounded-xl py-3 px-10",
          "font-ui text-base font-medium text-white leading-[1.5]",
          "transition-colors duration-150",
          disabled
            ? "bg-surface-elevated text-muted cursor-not-allowed"
            : "bg-accent hover:bg-accent-dark cursor-pointer",
        ].join(" ")}
      >
        Analyze Document
      </button>
    </div>
  );
}
