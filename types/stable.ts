import type { Gigling } from "./gigling";

export type StableAlert = {
  id: string;
  type: "opportunity" | "risk" | "meta" | "performance";
  title: string;
  description: string;
  giglingId?: string;
  raceId?: string;
};

export type StableSummary = {
  ownerAddress: string;
  ownerName?: string;
  giglings: Gigling[];
  totalRaces: number;
  totalWins: number;
  averageWinRate: number;
  bestGiglingId?: string;
  recommendedRaceIds: string[];
  alerts: StableAlert[];
};
