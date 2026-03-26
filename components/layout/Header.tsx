"use client";

import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  return (
    <header className="w-full border-b border-line shrink-0">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 md:px-[60px] h-16 md:h-24 flex items-center justify-between">

        {/* Logo — clickable, goes to home */}
        <button
          onClick={() => router.push("/")}
          className="font-display text-2xl font-light text-white tracking-tight hover:opacity-80 transition-opacity duration-150"
        >
          Clarity.ai
        </button>

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
