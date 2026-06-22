import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/layout/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gigling Racing Intel",
    template: "%s | Gigling Racing Intel"
  },
  description:
    "The intelligence layer for Gigaverse Gigling Racing: race analysis, meta reads, predictor, stable management, rivalries, and shareable reports.",
  applicationName: "Gigling Racing Intel",
  keywords: [
    "Gigaverse",
    "Gigling Racing",
    "Gigling",
    "Race Intelligence",
    "Web3 Gaming",
    "Hackathon"
  ]
};

export const viewport: Viewport = {
  themeColor: "#05070d",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className="dark" lang="en">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
