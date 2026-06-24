import type { GiglingFaction, GiglingRarity } from "./gigling";

export type RaceStatus = "scheduled" | "live" | "completed" | "cancelled" | "unknown";

export type RaceWeather =
  | "cold"
  | "average"
  | "hot"
  | "sunny"
  | "rainy"
  | "stormy"
  | "foggy"
  | "windy"
  | "unknown";

export type RaceDistance = "sprint" | "medium" | "long" | "marathon" | "unknown";

export type TrackCondition = "dry" | "wet" | "muddy" | "icy" | "chaotic" | "unknown";

export type RaceItemUsage = {
  id: string;
  itemName: string;
  type: "boost" | "sabotage" | "defense" | "utility";
  targetGiglingId?: string;
  impact: number;
  usedAtStage: "start" | "mid" | "finish";
};

export type RaceParticipant = {
  giglingId: string;
  giglingName: string;
  ownerAddress: string;
  ownerName?: string;
  faction: GiglingFaction;
  rarity: GiglingRarity;
  startingLane: number;
  finalPosition?: number;
  itemsUsed: RaceItemUsage[];
  performanceScore?: number;
};

export type Race = {
  id: string;
  raceNumber: number;
  status: RaceStatus;
  distance: RaceDistance;
  weather: RaceWeather;
  trackCondition: TrackCondition;
  entryFee: number;
  prizePool: number;
  startedAt?: string;
  endedAt?: string;
  participants: RaceParticipant[];
  winnerGiglingId?: string;
  payoutTxHash?: string;
};
