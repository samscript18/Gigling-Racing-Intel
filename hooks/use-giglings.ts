"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchGiglingById, fetchGiglings } from "@/lib/gigaverse/api-client";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useGiglings() {
  return useQuery({
    queryKey: gigaverseQueryKeys.giglings(),
    queryFn: fetchGiglings
  });
}

export function useGigling(id: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.gigling(id),
    queryFn: () => fetchGiglingById(id),
    enabled: Boolean(id)
  });
}
