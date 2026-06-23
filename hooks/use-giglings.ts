"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  fetchGiglingById,
  fetchGiglings,
  fetchGiglingsPage
} from "@/lib/gigaverse/api-client";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useGiglings() {
  return useQuery({
    queryKey: gigaverseQueryKeys.giglings(),
    queryFn: fetchGiglings
  });
}

export function useGiglingsPage(limit: number, offset: number) {
  return useQuery({
    queryKey: gigaverseQueryKeys.giglingsPage(limit, offset),
    queryFn: () => fetchGiglingsPage({ limit, offset }),
    placeholderData: keepPreviousData
  });
}

export function useGigling(id: string) {
  return useQuery({
    queryKey: gigaverseQueryKeys.gigling(id),
    queryFn: () => fetchGiglingById(id),
    enabled: Boolean(id)
  });
}
