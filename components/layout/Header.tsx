"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="w-full border-b border-line shrink-0">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-[60px] h-16 md:h-24 flex items-center justify-between">

        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuToggle}
            aria-label="Open menu"
            className="md:hidden text-secondary hover:text-primary transition-colors duration-150"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="font-display text-2xl font-light text-white tracking-tight hover:opacity-80 transition-opacity duration-150"
          >
            Clarity.ai
          </button>
        </div>

        {/* Auth control */}
        {isLoaded && (
          isSignedIn ? (
            <UserButton
              userProfileUrl="/user-profile"
              userProfileMode="navigation"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: {
                    backgroundColor: "#1E1E1E",
                    border: "1px solid #3A3A3A",
                    boxShadow: "none",
                  },
                  userButtonPopoverActionButton: { color: "#A3A3A3" },
                  userButtonPopoverActionButtonText: { color: "#A3A3A3" },
                  userButtonPopoverFooter: { display: "none" },
                },
              }}
            />
          ) : (
            <SignInButton mode="modal">
              <button className="font-ui text-[14px] text-secondary hover:text-primary transition-colors duration-150">
                Sign in
              </button>
            </SignInButton>
          )
        )}
      </div>
    </header>
  );
}
