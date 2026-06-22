"use client";

import { create } from "zustand";

import { GIGAVERSE_OWNER_ADDRESS } from "@/lib/gigaverse/mock-data";

type AppStore = {
  sidebarCollapsed: boolean;
  mockWalletConnected: boolean;
  selectedOwnerAddress: string;
  toggleSidebar: () => void;
  setMockWalletConnected: (connected: boolean) => void;
  setSelectedOwnerAddress: (address: string) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  sidebarCollapsed: false,
  mockWalletConnected: true,
  selectedOwnerAddress: GIGAVERSE_OWNER_ADDRESS,
  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed
    })),
  setMockWalletConnected: (connected) =>
    set({
      mockWalletConnected: connected
    }),
  setSelectedOwnerAddress: (address) =>
    set({
      selectedOwnerAddress: address
    })
}));
