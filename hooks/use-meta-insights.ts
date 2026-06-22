"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchMetaData } from "@/lib/gigaverse/api-client";
import { gigaverseQueryKeys } from "@/lib/gigaverse/query-keys";

export function useMetaInsights() {
  return useQuery({
    queryKey: gigaverseQueryKeys.metaInsights(),
    queryFn: fetchMetaData
  });
}
