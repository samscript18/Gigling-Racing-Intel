"use client";

import dynamic from "next/dynamic";

const RainbowConnectButton = dynamic(
  () =>
    import("@/components/shared/rainbow-connect-button").then(
      (module) => module.RainbowConnectButton
    ),
  {
    loading: () => (
      <div
        aria-label="Loading wallet connection"
        className="h-10 w-36 animate-pulse rounded-lg border border-white/10 bg-white/[0.04]"
      />
    ),
    ssr: false
  }
);

export function WalletConnectButton() {
  return <RainbowConnectButton />;
}
