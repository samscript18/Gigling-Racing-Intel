import type { GiglingFaction } from "./gigling";

export type Player = {
  id: string;
  walletAddress: string;
  displayName?: string;
  avatarUrl?: string;
  totalRaces: number;
  wins: number;
  winRate: number;
  totalEarnings: number;
  favoriteFaction?: GiglingFaction;
  stableSize: number;
};
