"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  fetchActiveRaces,
  fetchRaceById,
  fetchRaces,
  fetchRaceState
} from "@/lib/gigaverse/api-client";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";
import { watchRaceContractEvents } from "@/lib/gigaverse/contract-client";

export type RaceRealtimeStatus = "connecting" | "live" | "unavailable" | "error";

export function useRaceRealtime() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RaceRealtimeStatus>("connecting");
  const [lastEventAt, setLastEventAt] = useState<string>();

  useEffect(() => {
    setStatus("connecting");
    const unwatch = watchRaceContractEvents({
      onEvent: () => {
        setStatus("live");
        setLastEventAt(new Date().toISOString());
        void queryClient.invalidateQueries({ queryKey: gigaverseQueryKeys.races() });
      },
      onError: () => {
        setStatus("error");
      }
    });

    if (!unwatch) {
      setStatus("unavailable");
      return;
    }

    setStatus("live");
    return unwatch;
  }, [queryClient]);

  return { lastEventAt, status };
}

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

export function useActiveRaces() {
  return useQuery({
    queryKey: gigaverseQueryKeys.activeRaces(),
    queryFn: fetchActiveRaces
  });
}

export function useRaceState(id: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.raceState(id),
    queryFn: () => fetchRaceState(id),
    enabled: Boolean(id)
  });
}
