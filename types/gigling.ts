import type { RaceDistance, RaceWeather } from "./race";

export type GiglingRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type GiglingFaction =
  | "crusader"
  | "overseer"
  | "athena"
  | "archon"
  | "foxglove"
  | "summoner"
  | "chobo"
  | "gigus";

export type GiglingTrait = {
  id: string;
  name: string;
  category: "speed" | "stamina" | "luck" | "handling" | "temperament" | "special";
  revealed: boolean;
  value?: number;
  description: string;
};

export type GiglingStats = {
  speed: number;
  stamina: number;
  handling: number;
  acceleration: number;
  luck: number;
  consistency: number;
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
  level: number;
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
  bestWeather: RaceWeather;
  lastRaceAt?: string;
};
