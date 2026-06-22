export const gigaverseQueryKeys = {
  all: ["gigaverse"] as const,
  giglings: () => [...gigaverseQueryKeys.all, "giglings"] as const,
  gigling: (id: string) => [...gigaverseQueryKeys.giglings(), id] as const,
  giglingStats: (id: string) =>
    [...gigaverseQueryKeys.gigling(id), "stats"] as const,
  races: () => [...gigaverseQueryKeys.all, "races"] as const,
  activeRaces: () => [...gigaverseQueryKeys.races(), "active"] as const,
  race: (id: string) => [...gigaverseQueryKeys.races(), id] as const,
  raceState: (id: string) => [...gigaverseQueryKeys.race(id), "state"] as const,
  raceResults: (id: string) => [...gigaverseQueryKeys.race(id), "results"] as const,
  stable: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "stable", ownerAddress] as const,
  playerRaceHistory: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "player-race-history", ownerAddress] as const,
  payouts: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "payouts", ownerAddress] as const,
  hostEligibility: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "host-eligibility", ownerAddress] as const,
  giglingEligibility: (giglingId: string, ownerAddress: string) =>
    [...gigaverseQueryKeys.gigling(giglingId), "eligibility", ownerAddress] as const,
  metaInsights: () => [...gigaverseQueryKeys.all, "meta-insights"] as const,
  players: () => [...gigaverseQueryKeys.all, "players"] as const,
  leaderboardPlayers: () => [...gigaverseQueryKeys.players(), "leaderboard"] as const,
  rivalries: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "rivalries", ownerAddress] as const
};
