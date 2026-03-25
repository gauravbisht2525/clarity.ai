import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen antialiased">{children}</body>
    </html>
  );
}
