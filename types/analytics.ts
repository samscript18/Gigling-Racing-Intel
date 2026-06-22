import type { GiglingFaction, GiglingRarity } from "./gigling";
import type { RaceDistance, RaceWeather, TrackCondition } from "./race";

export type MetaInsight = {
  id: string;
  title: string;
  description: string;
  severity: "info" | "positive" | "warning" | "critical";
  metricLabel: string;
  metricValue: string;
  trendDirection: "up" | "down" | "flat";
  createdAt: string;
};

export type FactionPerformance = {
  faction: GiglingFaction;
  races: number;
  wins: number;
  winRate: number;
  podiumRate: number;
  averagePlacement: number;
};

export type RarityPerformance = {
  rarity: GiglingRarity;
  races: number;
  wins: number;
  winRate: number;
  averageEarnings: number;
};

export type ConditionPerformance = {
  label: RaceWeather | RaceDistance | TrackCondition;
  races: number;
  averagePerformanceScore: number;
  upsetRate: number;
};
