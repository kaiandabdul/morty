import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://morty.goshen.fyi"),
  title: {
    default: "Morty - Autonomous AI Coding Loop",
    template: "%s | Morty",
  },
  description:
    "Run AI agents on your tasks until done. Supports Claude Code, OpenCode, Codex, Cursor, Qwen-Code and Factory Droid.",
  keywords: [
    "AI coding",
    "autonomous coding",
    "Claude Code",
    "OpenCode",
    "Codex",
    "Cursor",
    "Qwen-Code",
    "Factory Droid",
    "AI agent",
    "code automation",
    "developer tools",
    "Morty",
    "vibecoding",
  ],
  authors: [{ name: "Morty Team" }],
  creator: "Morty",
  publisher: "Morty",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Morty - Autonomous AI Coding Loop",
    description:
      "Run AI agents on your tasks until done. Supports Claude Code, OpenCode, Codex, Cursor, Qwen-Code and Factory Droid.",
    type: "website",
    url: "https://morty.goshen.fyi",
    siteName: "Morty",
    images: [
      {
        url: "/morty.jpeg",
        width: 1200,
        height: 630,
        alt: "Morty - Autonomous AI Coding Loop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morty - Autonomous AI Coding Loop",
    description:
      "Run AI agents on your tasks until done. Supports Claude Code, OpenCode, Codex, Cursor, Qwen-Code and Factory Droid.",
    images: ["/morty.jpeg"],
    creator: "@rasmic",
  },
  alternates: {
    canonical: "https://morty.goshen.fyi",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-800 min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
