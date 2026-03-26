import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--loaded-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clarity — Understand any document in seconds",
  description:
    "Upload a contract, agreement, or policy. We'll break it down into plain language and tell you what to do.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#1E1E1E",
          colorInputBackground: "#2A2A2A",
          colorInputText: "#ECECEC",
          colorText: "#ECECEC",
          colorTextSecondary: "#A3A3A3",
          colorPrimary: "#DA5B0A",
          colorDanger: "#f87171",
          colorSuccess: "#4ADE80",
          colorNeutral: "#3A3A3A",
          borderRadius: "12px",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: "14px",
        },
        elements: {
          card: {
            backgroundColor: "#1E1E1E",
            border: "1px solid #3A3A3A",
            boxShadow: "none",
          },
          rootBox: { fontFamily: "Inter, system-ui, sans-serif" },
          headerTitle: {
            color: "#ECECEC",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "400",
          },
          headerSubtitle: { color: "#A3A3A3" },
          socialButtonsBlockButton: {
            backgroundColor: "#2A2A2A",
            border: "1px solid #3A3A3A",
            color: "#ECECEC",
          },
          socialButtonsBlockButtonText: { color: "#ECECEC" },
          dividerLine: { backgroundColor: "#3A3A3A" },
          dividerText: { color: "#737373" },
          formFieldLabel: { color: "#A3A3A3" },
          formFieldInput: {
            backgroundColor: "#2A2A2A",
            border: "1px solid #3A3A3A",
            color: "#ECECEC",
          },
          formButtonPrimary: {
            backgroundColor: "#DA5B0A",
            color: "#FFFFFF",
            fontWeight: "500",
          },
          footerActionLink: { color: "#DA5B0A" },
          identityPreviewText: { color: "#ECECEC" },
          identityPreviewEditButton: { color: "#DA5B0A" },
          formResendCodeLink: { color: "#DA5B0A" },
          otpCodeFieldInput: {
            backgroundColor: "#2A2A2A",
            border: "1px solid #3A3A3A",
            color: "#ECECEC",
          },
          navbar: { backgroundColor: "#1E1E1E", borderColor: "#3A3A3A" },
          navbarButton: { color: "#A3A3A3" },
          navbarButtonActive: { color: "#ECECEC" },
          profileSectionTitle: { color: "#A3A3A3" },
          profileSectionContent: { color: "#ECECEC" },
          badge: { backgroundColor: "#2A2A2A", color: "#A3A3A3" },
          userPreviewMainIdentifier: { color: "#ECECEC" },
          userPreviewSecondaryIdentifier: { color: "#A3A3A3" },
          menuList: { backgroundColor: "#1E1E1E", border: "1px solid #3A3A3A" },
          menuItem: { color: "#A3A3A3" },
          menuItemButton: { color: "#A3A3A3" },
        },
      }}
    >
      <html lang="en" className={inter.variable}>
        <body className="flex flex-col min-h-screen antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
