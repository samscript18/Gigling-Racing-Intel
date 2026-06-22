"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchRaceById, fetchRaces } from "@/lib/gigaverse/api-client";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useRaces() {
  return useQuery({
    queryKey: gigaverseQueryKeys.races(),
    queryFn: fetchRaces
  });
}

export function useRace(id: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.race(id),
    queryFn: () => fetchRaceById(id),
    enabled: Boolean(id)
  });
}
