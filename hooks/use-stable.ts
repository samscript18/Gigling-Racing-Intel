"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchHostEligibility,
  fetchPayouts,
  fetchPlayerRaceHistory,
  fetchStable
} from "@/lib/gigaverse/api-client";
import { GIGAVERSE_OWNER_ADDRESS } from "@/lib/gigaverse/mock-data";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useStable(ownerAddress = GIGAVERSE_OWNER_ADDRESS) {
  return useQuery({
    queryKey: gigaverseQueryKeys.stable(ownerAddress),
    queryFn: () => fetchStable(ownerAddress),
    enabled: Boolean(ownerAddress)
  });
}

export function usePlayerRaceHistory(ownerAddress = GIGAVERSE_OWNER_ADDRESS) {
  return useQuery({
    queryKey: gigaverseQueryKeys.playerRaceHistory(ownerAddress),
    queryFn: () => fetchPlayerRaceHistory(ownerAddress),
    enabled: Boolean(ownerAddress)
  });
}

export function usePayouts(ownerAddress = GIGAVERSE_OWNER_ADDRESS) {
  return useQuery({
    queryKey: gigaverseQueryKeys.payouts(ownerAddress),
    queryFn: () => fetchPayouts(ownerAddress),
    enabled: Boolean(ownerAddress)
  });
}

export function useHostEligibility(ownerAddress = GIGAVERSE_OWNER_ADDRESS) {
  return useQuery({
    queryKey: gigaverseQueryKeys.hostEligibility(ownerAddress),
    queryFn: () => fetchHostEligibility(ownerAddress),
    enabled: Boolean(ownerAddress)
  });
}
