import type { RaceDistance, TrackCondition } from "./race";

export type GiglingRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "relic"
  | "giga"
  | "unknown";

export type GiglingFaction =
  | "crusader"
  | "overseer"
  | "athena"
  | "archon"
  | "foxglove"
  | "summoner"
  | "chobo"
  | "gigus"
  | "unknown";

export type GiglingTrait = {
  id: string;
  name: string;
  category: "start" | "speed" | "stamina" | "finish" | "temperament" | "special";
  revealed: boolean;
  value?: number;
  description: string;
};

export type GiglingStats = {
  start: number;
  speed: number;
  stamina: number;
  finish: number;
};

export type Gigling = {
  id: string;
  tokenId: string;
  name: string;
  imageUrl: string;
  ownerAddress: string;
  ownerName?: string;
  faction: GiglingFaction;
  rarity: GiglingRarity;
  level?: number;
  elo?: number;
  traits: GiglingTrait[];
  stats: GiglingStats;
  totalRaces: number;
  wins: number;
  podiums: number;
  winRate: number;
  podiumRate: number;
  earnings: number;
  currentStreak: number;
  bestDistance: RaceDistance;
  bestTrackCondition: TrackCondition;
  lastRaceAt?: string;
};
