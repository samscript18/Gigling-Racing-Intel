"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchStable } from "@/lib/gigaverse/api-client";
import { GIGAVERSE_OWNER_ADDRESS } from "@/lib/gigaverse/mock-data";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useStable(ownerAddress = GIGAVERSE_OWNER_ADDRESS) {
  return useQuery({
    queryKey: gigaverseQueryKeys.stable(ownerAddress),
    queryFn: () => fetchStable(ownerAddress),
    enabled: Boolean(ownerAddress)
  });
}
