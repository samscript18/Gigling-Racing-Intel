import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/layout/providers";
import { appEnv } from "@/lib/config/env";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: appEnv.appName,
    template: `%s | ${appEnv.appName}`
  },
  description:
    "The intelligence layer for Gigaverse Gigling Racing: race analysis, meta reads, predictor, stable management, rivalries, and shareable reports.",
  applicationName: appEnv.appName,
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
