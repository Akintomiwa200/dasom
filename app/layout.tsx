import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DASOM — Davidic School of Ministry",
  description: "Raising Mighty Men and Women for Kingdom Influence. An 8-month transformational programme by The Mighty Men of David.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
