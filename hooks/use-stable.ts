"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchHostEligibility,
  fetchPayouts,
  fetchPlayerRaceHistory,
  fetchRivalries,
  fetchStable
} from "@/lib/gigaverse/api-client";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useStable(ownerAddress?: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.stable(ownerAddress ?? "disconnected"),
    queryFn: () => fetchStable(ownerAddress ?? ""),
    enabled: Boolean(ownerAddress)
  });
}

export function usePlayerRaceHistory(ownerAddress?: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.playerRaceHistory(ownerAddress ?? "disconnected"),
    queryFn: () => fetchPlayerRaceHistory(ownerAddress ?? ""),
    enabled: Boolean(ownerAddress)
  });
}

export function usePayouts(ownerAddress?: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.payouts(ownerAddress ?? "disconnected"),
    queryFn: () => fetchPayouts(ownerAddress ?? ""),
    enabled: Boolean(ownerAddress)
  });
}

export function useHostEligibility(ownerAddress?: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.hostEligibility(ownerAddress ?? "disconnected"),
    queryFn: () => fetchHostEligibility(ownerAddress ?? ""),
    enabled: Boolean(ownerAddress)
  });
}

export function useRivalries(ownerAddress?: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.rivalries(ownerAddress ?? "disconnected"),
    queryFn: () => fetchRivalries(ownerAddress ?? ""),
    enabled: Boolean(ownerAddress)
  });
}
