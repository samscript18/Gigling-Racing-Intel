import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { Providers } from "@/components/layout/providers";
import { appEnv } from "@/lib/config/env";

import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(appEnv.siteUrl),
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
  ],
  openGraph: {
    title: appEnv.appName,
    description:
      "A premium analytics and decision-making layer for Gigaverse Gigling Racing players.",
    siteName: appEnv.appName,
    type: "website",
    url: appEnv.siteUrl
  },
  twitter: {
    card: "summary_large_image",
    title: appEnv.appName,
    description:
      "Inspect Giglings, analyze races, predict outcomes, manage stables, track rivals, and share racing intel."
  },
  robots: {
    index: true,
    follow: true
  }
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
