"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export function WalletConnectButton() {
  return (
    <ConnectButton
      accountStatus={{ smallScreen: "avatar", largeScreen: "avatar" }}
      chainStatus="icon"
      label="Connect Wallet"
      showBalance={{ smallScreen: false, largeScreen: true }}
    />
  );
}
