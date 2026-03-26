"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { X } from "lucide-react";

interface SignupModalProps {
  onDismiss: () => void;
}

export default function SignupModal({ onDismiss }: SignupModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative bg-surface border border-border rounded-2xl p-8 w-full max-w-[400px] flex flex-col gap-6">

        {/* Close button */}
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute top-4 right-4 text-muted hover:text-secondary transition-colors"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>

        {/* Copy */}
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-[22px] font-normal text-primary leading-snug">
            You&apos;ve used your free analyses
          </h2>
          <p className="font-ui text-[14px] text-secondary leading-[1.6]">
            Create a free account to get unlimited analyses and save your history across sessions.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <SignUpButton mode="modal">
            <button className="w-full bg-accent text-white font-ui text-[15px] font-medium rounded-xl py-3 hover:bg-[#c45209] transition-colors duration-150">
              Create free account
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="w-full bg-surface-elevated text-secondary font-ui text-[15px] font-medium rounded-xl py-3 border border-border hover:text-primary hover:border-secondary transition-colors duration-150">
              Sign in
            </button>
          </SignInButton>
        </div>

        {/* Soft dismiss */}
        <button
          onClick={onDismiss}
          className="font-ui text-[13px] text-muted hover:text-secondary transition-colors text-center"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
