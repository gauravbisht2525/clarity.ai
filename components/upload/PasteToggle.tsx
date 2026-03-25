"use client";

import { Clipboard } from "lucide-react";

export default function PasteToggle() {
  function handleClick() {
    // TODO: open paste text panel
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 font-ui text-[14px] text-secondary hover:text-primary transition-colors duration-150"
    >
      <Clipboard className="w-4 h-4" strokeWidth={1.5} />
      Paste your text instead
    </button>
  );
}
