"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function RainbowConnectButton() {
  return (
    <ConnectButton
      accountStatus={{ smallScreen: "avatar", largeScreen: "avatar" }}
      chainStatus="icon"
      label="Connect Wallet"
      showBalance={{ smallScreen: false, largeScreen: true }}
    />
  );
}
