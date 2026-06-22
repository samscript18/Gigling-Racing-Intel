export const gigaverseQueryKeys = {
  all: ["gigaverse"] as const,
  giglings: () => [...gigaverseQueryKeys.all, "giglings"] as const,
  gigling: (id: string) => [...gigaverseQueryKeys.giglings(), id] as const,
  races: () => [...gigaverseQueryKeys.all, "races"] as const,
  race: (id: string) => [...gigaverseQueryKeys.races(), id] as const,
  stable: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "stable", ownerAddress] as const,
  metaInsights: () => [...gigaverseQueryKeys.all, "meta-insights"] as const,
  players: () => [...gigaverseQueryKeys.all, "players"] as const,
  rivalries: (ownerAddress: string) =>
    [...gigaverseQueryKeys.all, "rivalries", ownerAddress] as const
};
