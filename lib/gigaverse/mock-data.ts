import type {
  FactionPerformance,
  Gigling,
  GiglingFaction,
  GiglingRarity,
  GiglingStats,
  GiglingTrait,
  MetaInsight,
  Player,
  PredictionResult,
  Race,
  RaceDistance,
  RaceItemUsage,
  RaceParticipant,
  RaceWeather,
  RivalryRecord,
  StableSummary,
  TrackCondition
} from "@/types";

export const GIGAVERSE_OWNER_ADDRESS =
  "0x9f3a1b8c2d4e5f60718293abcd0ef123456789ab";

export const factions: GiglingFaction[] = [
  "crusader",
  "overseer",
  "athena",
  "archon",
  "foxglove",
  "summoner",
  "chobo",
  "gigus"
];

export const rarities: GiglingRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary"
];

export const raceWeatherOptions: RaceWeather[] = [
  "sunny",
  "rainy",
  "stormy",
  "foggy",
  "windy"
];

export const raceDistanceOptions: RaceDistance[] = [
  "sprint",
  "medium",
  "long",
  "marathon"
];

export const trackConditionOptions: TrackCondition[] = [
  "dry",
  "wet",
  "muddy",
  "icy",
  "chaotic"
];

export const mockPlayers: Player[] = [
  {
    id: "player-01",
    walletAddress: GIGAVERSE_OWNER_ADDRESS,
    displayName: "ByteBender",
    avatarUrl: "/avatars/bytebender.png",
    totalRaces: 78,
    wins: 21,
    winRate: 26.9,
    totalEarnings: 8420,
    favoriteFaction: "chobo",
    stableSize: 5
  },
  {
    id: "player-02",
    walletAddress: "0xa74c91d22bbf80613d7a8b4080c2797d05c8e716",
    displayName: "Lane Witch",
    avatarUrl: "/avatars/lane-witch.png",
    totalRaces: 69,
    wins: 18,
    winRate: 26.1,
    totalEarnings: 7110,
    favoriteFaction: "archon",
    stableSize: 4
  },
  {
    id: "player-03",
    walletAddress: "0x5efad91b75a922486bb19cc4e8aa1cf8f0216d34",
    displayName: "Circuit Sage",
    avatarUrl: "/avatars/circuit-sage.png",
    totalRaces: 64,
    wins: 17,
    winRate: 26.6,
    totalEarnings: 6935,
    favoriteFaction: "foxglove",
    stableSize: 3
  },
  {
    id: "player-04",
    walletAddress: "0x3a1086259f7c828f4dd6e8ab4e7ff38be8f7cb09",
    displayName: "Boost Monk",
    avatarUrl: "/avatars/boost-monk.png",
    totalRaces: 58,
    wins: 14,
    winRate: 24.1,
    totalEarnings: 6120,
    favoriteFaction: "crusader",
    stableSize: 3
  },
  {
    id: "player-05",
    walletAddress: "0x61c4ab049afdb46c47d797ee5b090661d3b7da0c",
    displayName: "Rainline",
    avatarUrl: "/avatars/rainline.png",
    totalRaces: 47,
    wins: 11,
    winRate: 23.4,
    totalEarnings: 4385,
    favoriteFaction: "athena",
    stableSize: 2
  },
  {
    id: "player-06",
    walletAddress: "0xde521613f0a64f247450a2cd571a89177f32bd15",
    displayName: "Mudpulse",
    avatarUrl: "/avatars/mudpulse.png",
    totalRaces: 51,
    wins: 10,
    winRate: 19.6,
    totalEarnings: 3970,
    favoriteFaction: "foxglove",
    stableSize: 2
  },
  {
    id: "player-07",
    walletAddress: "0x4d8b06a8c6bbf836589d6c4fb8da6d90cc242721",
    displayName: "Orange Apex",
    avatarUrl: "/avatars/orange-apex.png",
    totalRaces: 42,
    wins: 9,
    winRate: 21.4,
    totalEarnings: 3620,
    favoriteFaction: "crusader",
    stableSize: 2
  },
  {
    id: "player-08",
    walletAddress: "0xb316173972f592fb9b426d913d317c8562a7f682",
    displayName: "Static Bloom",
    avatarUrl: "/avatars/static-bloom.png",
    totalRaces: 39,
    wins: 8,
    winRate: 20.5,
    totalEarnings: 3290,
    favoriteFaction: "chobo",
    stableSize: 2
  },
  {
    id: "player-09",
    walletAddress: "0x807d832eb2f6f269162794c0b98f84ac7869d9ab",
    displayName: "Fog Forge",
    avatarUrl: "/avatars/fog-forge.png",
    totalRaces: 36,
    wins: 7,
    winRate: 19.4,
    totalEarnings: 3015,
    favoriteFaction: "summoner",
    stableSize: 1
  },
  {
    id: "player-10",
    walletAddress: "0xcda8cdbcb1685d5c7c108974e9ebb319b4f8ce91",
    displayName: "Prize Vector",
    avatarUrl: "/avatars/prize-vector.png",
    totalRaces: 31,
    wins: 6,
    winRate: 19.4,
    totalEarnings: 2680,
    favoriteFaction: "athena",
    stableSize: 1
  },
  {
    id: "player-11",
    walletAddress: "0xf11482db38d62164e06c12cf62a11c7d184507e2",
    displayName: "Night Torque",
    avatarUrl: "/avatars/night-torque.png",
    totalRaces: 29,
    wins: 5,
    winRate: 17.2,
    totalEarnings: 2325,
    favoriteFaction: "overseer",
    stableSize: 1
  },
  {
    id: "player-12",
    walletAddress: "0x73d39c73af5b537a3868f65e623d84ee39a8a612",
    displayName: "Starter Bell",
    avatarUrl: "/avatars/starter-bell.png",
    totalRaces: 24,
    wins: 4,
    winRate: 16.7,
    totalEarnings: 1895,
    favoriteFaction: "gigus",
    stableSize: 1
  }
];

const traitTemplates: Record<GiglingFaction, string[]> = {
  crusader: ["Flare Launch", "Heat-Hardened Paws", "Apex Temper"],
  overseer: ["Pressure Read", "Command Line", "Calculated Finish"],
  athena: ["Rainline Read", "Slipstream Gill", "Deep Focus"],
  archon: ["Night Draft", "Corner Vanish", "Pressure Mask"],
  foxglove: ["Mud Grip", "Stone Calm", "Rooted Stride"],
  summoner: ["Arcane Gait", "Tempo Charm", "Field Sense"],
  chobo: ["Spark Reflex", "Turbo Whisker", "Static Surge"],
  gigus: ["Balanced Gait", "Lucky Charm", "Clean Split"]
};

function player(index: number) {
  return mockPlayers[index % mockPlayers.length];
}

function makeTraits(
  id: string,
  faction: GiglingFaction,
  stats: GiglingStats
): GiglingTrait[] {
  const [first, second, third] = traitTemplates[faction];

  return [
    {
      id: `${id}-trait-1`,
      name: first,
      category: stats.speed >= stats.stamina ? "speed" : "stamina",
      revealed: true,
      value: Math.max(stats.speed, stats.stamina),
      description: `${first} gives this Gigling a clear identity in its favored race segment.`
    },
    {
      id: `${id}-trait-2`,
      name: second,
      category: stats.handling >= 78 ? "handling" : "temperament",
      revealed: true,
      value: Math.max(stats.handling, stats.consistency),
      description: `${second} improves how reliably the Gigling handles pressure and lane contact.`
    },
    {
      id: `${id}-trait-3`,
      name: third,
      category: stats.luck >= 74 ? "luck" : "special",
      revealed: id.endsWith("4") || id.endsWith("8") ? false : true,
      value: stats.luck,
      description: `${third} appears most valuable when item timing and track volatility spike.`
    }
  ];
}

function gigling(
  index: number,
  name: string,
  faction: GiglingFaction,
  rarity: GiglingRarity,
  stats: GiglingStats,
  totalRaces: number,
  wins: number,
  podiums: number,
  earnings: number,
  currentStreak: number,
  bestDistance: RaceDistance,
  bestWeather: RaceWeather,
  ownerIndex: number
): Gigling {
  const owner = player(ownerIndex);
  const id = `gigling-${String(index).padStart(2, "0")}`;

  return {
    id,
    tokenId: `#${String(4100 + index).padStart(4, "0")}`,
    name,
    imageUrl: `/giglings/${id}.png`,
    ownerAddress: owner.walletAddress,
    ownerName: owner.displayName,
    faction,
    rarity,
    level: Math.min(99, 10 + Math.round((stats.speed + stats.stamina + stats.handling) / 4)),
    traits: makeTraits(id, faction, stats),
    stats,
    totalRaces,
    wins,
    podiums,
    winRate: Number(((wins / totalRaces) * 100).toFixed(1)),
    podiumRate: Number(((podiums / totalRaces) * 100).toFixed(1)),
    earnings,
    currentStreak,
    bestDistance,
    bestWeather,
    lastRaceAt: `2026-06-${String(1 + (index % 18)).padStart(2, "0")}T${String(10 + (index % 9)).padStart(2, "0")}:30:00.000Z`
  };
}

export const mockGiglings: Gigling[] = [
  gigling(1, "Volt Vandal", "chobo", "legendary", { speed: 94, stamina: 80, handling: 86, acceleration: 96, luck: 72, consistency: 84 }, 28, 9, 17, 2480, 4, "sprint", "windy", 0),
  gigling(2, "Mossline Prime", "foxglove", "epic", { speed: 76, stamina: 93, handling: 88, acceleration: 68, luck: 63, consistency: 91 }, 25, 7, 16, 2115, 2, "marathon", "rainy", 2),
  gigling(3, "Ember Echo", "crusader", "rare", { speed: 88, stamina: 75, handling: 72, acceleration: 90, luck: 68, consistency: 76 }, 23, 6, 13, 1710, 1, "sprint", "sunny", 3),
  gigling(4, "Aqua Comet", "athena", "epic", { speed: 82, stamina: 86, handling: 92, acceleration: 77, luck: 71, consistency: 88 }, 24, 7, 15, 2050, 3, "long", "rainy", 4),
  gigling(5, "Shadow Spindle", "archon", "legendary", { speed: 90, stamina: 78, handling: 87, acceleration: 89, luck: 84, consistency: 79 }, 27, 8, 16, 2325, -1, "medium", "foggy", 1),
  gigling(6, "Neutral Nova", "summoner", "rare", { speed: 80, stamina: 82, handling: 81, acceleration: 78, luck: 78, consistency: 85 }, 22, 5, 12, 1495, 1, "medium", "sunny", 8),
  gigling(7, "Cinder Dash", "crusader", "uncommon", { speed: 84, stamina: 70, handling: 66, acceleration: 88, luck: 60, consistency: 70 }, 18, 4, 9, 1030, -2, "sprint", "sunny", 6),
  gigling(8, "Tidewise", "athena", "rare", { speed: 74, stamina: 85, handling: 90, acceleration: 72, luck: 74, consistency: 86 }, 20, 5, 11, 1285, 2, "long", "stormy", 9),
  gigling(9, "Quartz Rover", "foxglove", "uncommon", { speed: 68, stamina: 88, handling: 84, acceleration: 64, luck: 66, consistency: 89 }, 19, 4, 10, 1120, 1, "marathon", "rainy", 5),
  gigling(10, "Static Peach", "chobo", "rare", { speed: 86, stamina: 77, handling: 79, acceleration: 91, luck: 82, consistency: 75 }, 21, 5, 12, 1375, 0, "sprint", "windy", 7),
  gigling(11, "Nocturne Nib", "archon", "epic", { speed: 85, stamina: 83, handling: 84, acceleration: 83, luck: 86, consistency: 82 }, 22, 6, 14, 1785, 2, "medium", "foggy", 10),
  gigling(12, "Pace Biscuit", "overseer", "common", { speed: 72, stamina: 76, handling: 74, acceleration: 70, luck: 77, consistency: 78 }, 16, 2, 7, 620, -1, "medium", "sunny", 11),
  gigling(13, "Flame Ferry", "crusader", "epic", { speed: 89, stamina: 79, handling: 75, acceleration: 87, luck: 69, consistency: 80 }, 20, 5, 12, 1525, 1, "medium", "sunny", 0),
  gigling(14, "Brine Button", "athena", "uncommon", { speed: 70, stamina: 82, handling: 85, acceleration: 67, luck: 75, consistency: 82 }, 17, 3, 8, 845, -2, "long", "rainy", 4),
  gigling(15, "Canyon Byte", "foxglove", "rare", { speed: 78, stamina: 89, handling: 82, acceleration: 73, luck: 62, consistency: 87 }, 18, 4, 10, 1160, 0, "long", "windy", 2),
  gigling(16, "Voltage Velvet", "chobo", "epic", { speed: 91, stamina: 74, handling: 80, acceleration: 94, luck: 80, consistency: 77 }, 19, 5, 11, 1435, 3, "sprint", "stormy", 0),
  gigling(17, "Umbra Uplink", "archon", "rare", { speed: 83, stamina: 80, handling: 89, acceleration: 81, luck: 88, consistency: 78 }, 18, 4, 10, 1275, -1, "medium", "foggy", 1),
  gigling(18, "Lucky Lattice", "gigus", "uncommon", { speed: 73, stamina: 80, handling: 76, acceleration: 72, luck: 91, consistency: 74 }, 15, 3, 7, 790, 2, "medium", "chaotic" as RaceWeather, 8),
  gigling(19, "Ashen Orbit", "crusader", "rare", { speed: 86, stamina: 81, handling: 71, acceleration: 85, luck: 65, consistency: 83 }, 18, 4, 9, 1125, 1, "long", "sunny", 3),
  gigling(20, "Pearl Pivot", "athena", "legendary", { speed: 84, stamina: 88, handling: 95, acceleration: 78, luck: 79, consistency: 90 }, 23, 8, 17, 2390, 5, "long", "rainy", 9),
  gigling(21, "Root Rocket", "foxglove", "common", { speed: 66, stamina: 84, handling: 79, acceleration: 63, luck: 70, consistency: 80 }, 14, 2, 6, 540, -3, "marathon", "rainy", 5),
  gigling(22, "Arc Lantern", "chobo", "uncommon", { speed: 82, stamina: 73, handling: 77, acceleration: 86, luck: 81, consistency: 72 }, 16, 3, 8, 870, 1, "sprint", "stormy", 7),
  gigling(23, "Midnight Mote", "overseer", "common", { speed: 76, stamina: 75, handling: 83, acceleration: 74, luck: 85, consistency: 73 }, 15, 2, 6, 610, -1, "medium", "foggy", 10),
  gigling(24, "Clean Corner", "summoner", "rare", { speed: 79, stamina: 81, handling: 82, acceleration: 77, luck: 76, consistency: 88 }, 17, 4, 10, 1090, 2, "medium", "windy", 11)
].map((entry) =>
  entry.id === "gigling-18"
    ? {
        ...entry,
        bestWeather: "windy"
      }
    : entry
);

function giglingById(id: string) {
  const found = mockGiglings.find((giglingEntry) => giglingEntry.id === id);

  if (!found) {
    throw new Error(`Missing mock Gigling ${id}`);
  }

  return found;
}

function item(
  id: string,
  itemName: string,
  type: RaceItemUsage["type"],
  impact: number,
  usedAtStage: RaceItemUsage["usedAtStage"],
  targetGiglingId?: string
): RaceItemUsage {
  return {
    id,
    itemName,
    type,
    impact,
    usedAtStage,
    targetGiglingId
  };
}

function participant(
  giglingId: string,
  startingLane: number,
  finalPosition?: number,
  itemsUsed: RaceItemUsage[] = [],
  performanceScore?: number
): RaceParticipant {
  const giglingEntry = giglingById(giglingId);

  return {
    giglingId,
    giglingName: giglingEntry.name,
    ownerAddress: giglingEntry.ownerAddress,
    ownerName: giglingEntry.ownerName,
    faction: giglingEntry.faction,
    rarity: giglingEntry.rarity,
    startingLane,
    finalPosition,
    itemsUsed,
    performanceScore
  };
}

function race(
  index: number,
  status: Race["status"],
  distance: RaceDistance,
  weather: RaceWeather,
  trackCondition: TrackCondition,
  entryFee: number,
  prizePool: number,
  participants: RaceParticipant[],
  date: string
): Race {
  const winner = participants.find((raceParticipant) => raceParticipant.finalPosition === 1);

  return {
    id: `race-${String(index).padStart(3, "0")}`,
    raceNumber: 9000 + index,
    status,
    distance,
    weather,
    trackCondition,
    entryFee,
    prizePool,
    startedAt: status === "scheduled" ? undefined : date,
    endedAt: status === "completed" ? new Date(new Date(date).getTime() + 7 * 60 * 1000).toISOString() : undefined,
    participants,
    winnerGiglingId: winner?.giglingId,
    payoutTxHash:
      status === "completed"
        ? `0x${String(index).repeat(4)}${"ab91c4d7e08f52a6b3c9d0e1f2473865".slice(0, 40 - String(index).repeat(4).length)}`
        : undefined
  };
}

export const mockRaces: Race[] = [
  race(1, "completed", "sprint", "windy", "dry", 25, 360, [
    participant("gigling-01", 3, 1, [item("item-001", "Overclock Carrot", "boost", 8, "finish")], 96),
    participant("gigling-10", 5, 2, [], 91),
    participant("gigling-16", 1, 3, [item("item-002", "Static Shield", "defense", 4, "mid")], 88),
    participant("gigling-03", 2, 4, [], 80),
    participant("gigling-07", 4, 5, [], 74),
    participant("gigling-22", 6, 6, [], 71)
  ], "2026-06-20T20:00:00.000Z"),
  race(2, "completed", "long", "rainy", "wet", 30, 420, [
    participant("gigling-20", 2, 1, [item("item-003", "Hydro Bloom", "boost", 7, "mid")], 97),
    participant("gigling-04", 4, 2, [], 92),
    participant("gigling-08", 5, 3, [], 89),
    participant("gigling-14", 1, 4, [], 76),
    participant("gigling-02", 3, 5, [item("item-004", "Mud Guard", "defense", 5, "start")], 75),
    participant("gigling-15", 6, 6, [], 69)
  ], "2026-06-20T18:00:00.000Z"),
  race(3, "completed", "medium", "foggy", "chaotic", 22, 310, [
    participant("gigling-05", 6, 1, [item("item-005", "Mirror Smoke", "utility", 6, "mid")], 94),
    participant("gigling-11", 1, 2, [], 90),
    participant("gigling-17", 2, 3, [item("item-006", "Corner Jammer", "sabotage", 5, "finish", "gigling-06")], 88),
    participant("gigling-06", 3, 4, [], 79),
    participant("gigling-23", 4, 5, [], 73),
    participant("gigling-12", 5, 6, [], 67)
  ], "2026-06-19T22:15:00.000Z"),
  race(4, "completed", "marathon", "rainy", "muddy", 28, 380, [
    participant("gigling-02", 4, 1, [], 95),
    participant("gigling-09", 1, 2, [item("item-007", "Root Anchor", "defense", 6, "mid")], 90),
    participant("gigling-15", 3, 3, [], 84),
    participant("gigling-21", 5, 4, [], 74),
    participant("gigling-04", 2, 5, [], 72),
    participant("gigling-20", 6, 6, [], 70)
  ], "2026-06-19T16:10:00.000Z"),
  race(5, "completed", "medium", "sunny", "dry", 18, 260, [
    participant("gigling-13", 2, 1, [item("item-008", "Solar Pepper", "boost", 5, "start")], 91),
    participant("gigling-06", 5, 2, [], 88),
    participant("gigling-24", 1, 3, [], 85),
    participant("gigling-19", 3, 4, [], 79),
    participant("gigling-03", 4, 5, [], 73),
    participant("gigling-12", 6, 6, [], 68)
  ], "2026-06-18T21:40:00.000Z"),
  race(6, "completed", "sprint", "stormy", "chaotic", 32, 500, [
    participant("gigling-16", 4, 1, [item("item-009", "Lightning Gel", "boost", 9, "finish")], 98),
    participant("gigling-01", 1, 2, [], 92),
    participant("gigling-10", 2, 3, [item("item-010", "Lane Static", "sabotage", 4, "mid", "gigling-03")], 86),
    participant("gigling-22", 6, 4, [], 80),
    participant("gigling-03", 3, 5, [], 72),
    participant("gigling-07", 5, 6, [], 66)
  ], "2026-06-18T19:25:00.000Z"),
  race(7, "completed", "long", "windy", "dry", 24, 330, [
    participant("gigling-15", 2, 1, [], 92),
    participant("gigling-24", 5, 2, [], 89),
    participant("gigling-02", 3, 3, [], 87),
    participant("gigling-19", 1, 4, [], 82),
    participant("gigling-08", 4, 5, [], 75),
    participant("gigling-14", 6, 6, [], 69)
  ], "2026-06-17T18:30:00.000Z"),
  race(8, "completed", "medium", "rainy", "wet", 20, 290, [
    participant("gigling-04", 1, 1, [item("item-011", "Rain Sync", "utility", 6, "mid")], 94),
    participant("gigling-20", 3, 2, [], 91),
    participant("gigling-08", 4, 3, [], 86),
    participant("gigling-11", 2, 4, [], 79),
    participant("gigling-06", 5, 5, [], 72),
    participant("gigling-18", 6, 6, [], 65)
  ], "2026-06-17T15:00:00.000Z"),
  race(9, "completed", "sprint", "sunny", "dry", 16, 210, [
    participant("gigling-03", 2, 1, [], 90),
    participant("gigling-13", 5, 2, [], 87),
    participant("gigling-07", 4, 3, [item("item-012", "Starter Snap", "boost", 4, "start")], 82),
    participant("gigling-01", 1, 4, [], 80),
    participant("gigling-16", 3, 5, [], 77),
    participant("gigling-22", 6, 6, [], 69)
  ], "2026-06-16T21:00:00.000Z"),
  race(10, "completed", "marathon", "foggy", "icy", 26, 360, [
    participant("gigling-11", 6, 1, [item("item-013", "Black Ice Read", "utility", 7, "mid")], 93),
    participant("gigling-02", 3, 2, [], 90),
    participant("gigling-09", 2, 3, [], 84),
    participant("gigling-21", 1, 4, [], 73),
    participant("gigling-17", 5, 5, [], 71),
    participant("gigling-23", 4, 6, [], 64)
  ], "2026-06-16T17:45:00.000Z"),
  race(11, "completed", "medium", "windy", "chaotic", 18, 275, [
    participant("gigling-24", 1, 1, [item("item-014", "Clean Draft", "defense", 5, "finish")], 91),
    participant("gigling-18", 6, 2, [], 86),
    participant("gigling-10", 2, 3, [], 84),
    participant("gigling-05", 5, 4, [], 78),
    participant("gigling-06", 3, 5, [], 72),
    participant("gigling-12", 4, 6, [], 67)
  ], "2026-06-15T20:05:00.000Z"),
  race(12, "completed", "long", "stormy", "wet", 30, 430, [
    participant("gigling-08", 4, 1, [item("item-015", "Storm Fin", "boost", 6, "mid")], 92),
    participant("gigling-20", 1, 2, [], 89),
    participant("gigling-04", 5, 3, [], 86),
    participant("gigling-14", 2, 4, [], 76),
    participant("gigling-15", 6, 5, [], 72),
    participant("gigling-09", 3, 6, [], 69)
  ], "2026-06-14T23:10:00.000Z"),
  race(13, "completed", "medium", "foggy", "muddy", 21, 310, [
    participant("gigling-17", 3, 1, [], 91),
    participant("gigling-05", 1, 2, [item("item-016", "Fog Hook", "sabotage", 4, "mid", "gigling-11")], 87),
    participant("gigling-11", 2, 3, [], 84),
    participant("gigling-23", 4, 4, [], 74),
    participant("gigling-06", 6, 5, [], 70),
    participant("gigling-18", 5, 6, [], 66)
  ], "2026-06-14T18:20:00.000Z"),
  race(14, "completed", "sprint", "windy", "dry", 19, 280, [
    participant("gigling-01", 4, 1, [], 95),
    participant("gigling-16", 2, 2, [], 91),
    participant("gigling-03", 1, 3, [], 86),
    participant("gigling-10", 5, 4, [], 80),
    participant("gigling-22", 6, 5, [], 72),
    participant("gigling-07", 3, 6, [], 68)
  ], "2026-06-13T22:00:00.000Z"),
  race(15, "completed", "long", "sunny", "dry", 27, 390, [
    participant("gigling-19", 3, 1, [item("item-017", "Cinder Draft", "boost", 5, "finish")], 90),
    participant("gigling-13", 2, 2, [], 86),
    participant("gigling-15", 1, 3, [], 83),
    participant("gigling-02", 5, 4, [], 80),
    participant("gigling-24", 4, 5, [], 76),
    participant("gigling-12", 6, 6, [], 63)
  ], "2026-06-12T17:00:00.000Z"),
  race(16, "completed", "marathon", "rainy", "muddy", 25, 350, [
    participant("gigling-09", 1, 1, [], 89),
    participant("gigling-02", 3, 2, [], 88),
    participant("gigling-21", 2, 3, [item("item-018", "Mud Snack", "boost", 5, "mid")], 80),
    participant("gigling-20", 4, 4, [], 78),
    participant("gigling-04", 5, 5, [], 73),
    participant("gigling-14", 6, 6, [], 68)
  ], "2026-06-11T21:30:00.000Z"),
  race(17, "live", "medium", "stormy", "chaotic", 35, 520, [
    participant("gigling-05", 2, undefined, [item("item-019", "Shadow Brake", "defense", 4, "start")], 82),
    participant("gigling-16", 6, undefined, [], 84),
    participant("gigling-20", 1, undefined, [], 86),
    participant("gigling-11", 5, undefined, [], 80),
    participant("gigling-01", 3, undefined, [], 87),
    participant("gigling-24", 4, undefined, [], 79)
  ], "2026-06-22T19:00:00.000Z"),
  race(18, "live", "sprint", "sunny", "dry", 18, 250, [
    participant("gigling-03", 1, undefined, [], 78),
    participant("gigling-07", 2, undefined, [], 74),
    participant("gigling-13", 3, undefined, [], 82),
    participant("gigling-22", 4, undefined, [], 75),
    participant("gigling-10", 5, undefined, [], 80),
    participant("gigling-18", 6, undefined, [], 72)
  ], "2026-06-22T20:30:00.000Z"),
  race(19, "scheduled", "long", "rainy", "wet", 28, 410, [
    participant("gigling-04", 1),
    participant("gigling-08", 2),
    participant("gigling-14", 3),
    participant("gigling-20", 4),
    participant("gigling-02", 5),
    participant("gigling-15", 6)
  ], "2026-06-23T18:00:00.000Z"),
  race(20, "scheduled", "marathon", "foggy", "icy", 34, 540, [
    participant("gigling-02", 1),
    participant("gigling-09", 2),
    participant("gigling-11", 3),
    participant("gigling-17", 4),
    participant("gigling-21", 5),
    participant("gigling-23", 6)
  ], "2026-06-23T21:15:00.000Z")
];

export const mockMetaInsights: MetaInsight[] = [
  {
    id: "meta-01",
    title: "Chobo sprint pressure is rising",
    description:
      "Chobo Giglings are converting windy sprint starts into early lane control, especially when acceleration clears 90.",
    severity: "positive",
    metricLabel: "7-day sprint win rate",
    metricValue: "38.4%",
    trendDirection: "up",
    createdAt: "2026-06-22T10:30:00.000Z"
  },
  {
    id: "meta-02",
    title: "Rainy long tracks favor Athena again",
    description:
      "Athena handlers regained wet-track dominance after a run of Hydro Bloom and Storm Fin item timings.",
    severity: "info",
    metricLabel: "Athena wet podium rate",
    metricValue: "71.8%",
    trendDirection: "up",
    createdAt: "2026-06-21T22:15:00.000Z"
  },
  {
    id: "meta-03",
    title: "Chaotic tracks are punishing low luck",
    description:
      "Giglings with luck below 70 are slipping two or more placements when sabotage lands after the mid split.",
    severity: "warning",
    metricLabel: "Low-luck drop rate",
    metricValue: "44.0%",
    trendDirection: "up",
    createdAt: "2026-06-21T09:00:00.000Z"
  },
  {
    id: "meta-04",
    title: "Foxglove marathon floor remains elite",
    description:
      "Foxglove Giglings keep outperforming projections in muddy marathons because stamina and consistency stay stable late.",
    severity: "positive",
    metricLabel: "Foxglove average placement",
    metricValue: "2.8",
    trendDirection: "flat",
    createdAt: "2026-06-20T14:40:00.000Z"
  },
  {
    id: "meta-05",
    title: "Archon fog setups are volatile",
    description:
      "Archon Giglings still create upsets in fog, but recent item defense counters lowered their conversion rate.",
    severity: "warning",
    metricLabel: "Fog upset delta",
    metricValue: "-8.7%",
    trendDirection: "down",
    createdAt: "2026-06-19T23:05:00.000Z"
  },
  {
    id: "meta-06",
    title: "Summoner consistency is underrated",
    description:
      "Balanced Summoner Giglings are quietly gaining podium equity in medium-distance races with dry or windy tracks.",
    severity: "info",
    metricLabel: "Summoner medium podiums",
    metricValue: "52.9%",
    trendDirection: "up",
    createdAt: "2026-06-19T10:20:00.000Z"
  }
];

export const mockFactionPerformance: FactionPerformance[] = factions.map((faction) => {
  const factionParticipants = mockRaces.flatMap((raceEntry) =>
    raceEntry.participants.filter(
      (raceParticipant) =>
        raceParticipant.faction === faction &&
        typeof raceParticipant.finalPosition === "number"
    )
  );
  const wins = factionParticipants.filter(
    (raceParticipant) => raceParticipant.finalPosition === 1
  ).length;
  const podiums = factionParticipants.filter(
    (raceParticipant) =>
      typeof raceParticipant.finalPosition === "number" &&
      raceParticipant.finalPosition <= 3
  ).length;
  const placementTotal = factionParticipants.reduce(
    (total, raceParticipant) => total + (raceParticipant.finalPosition ?? 0),
    0
  );

  return {
    faction,
    races: factionParticipants.length,
    wins,
    winRate: Number(((wins / Math.max(factionParticipants.length, 1)) * 100).toFixed(1)),
    podiumRate: Number(((podiums / Math.max(factionParticipants.length, 1)) * 100).toFixed(1)),
    averagePlacement: Number(
      (placementTotal / Math.max(factionParticipants.length, 1)).toFixed(2)
    )
  };
});

export const mockStableSummaries: StableSummary[] = [
  {
    ownerAddress: GIGAVERSE_OWNER_ADDRESS,
    ownerName: "ByteBender",
    giglings: mockGiglings.filter((giglingEntry) =>
      ["gigling-01", "gigling-13", "gigling-16", "gigling-18", "gigling-24"].includes(
        giglingEntry.id
      )
    ),
    totalRaces: 98,
    totalWins: 24,
    averageWinRate: 24.5,
    bestGiglingId: "gigling-01",
    recommendedRaceIds: ["race-017", "race-018", "race-019"],
    alerts: [
      {
        id: "stable-alert-01",
        type: "opportunity",
        title: "Enter Volt Vandal into windy sprints",
        description:
          "The next sprint lane is dry and windy, matching Volt Vandal's strongest acceleration profile.",
        giglingId: "gigling-01",
        raceId: "race-018"
      },
      {
        id: "stable-alert-02",
        type: "risk",
        title: "Lucky Lattice needs safer tracks",
        description:
          "Chaotic tracks look tempting, but recent sabotage density makes its current form harder to trust.",
        giglingId: "gigling-18",
        raceId: "race-017"
      },
      {
        id: "stable-alert-03",
        type: "meta",
        title: "Chobo acceleration meta is live",
        description:
          "High-acceleration Chobo Giglings are outpacing the field in the first split this week."
      }
    ]
  }
];

export const mockRivalryRecords: RivalryRecord[] = [
  {
    id: "rivalry-01",
    playerAddress: GIGAVERSE_OWNER_ADDRESS,
    rivalAddress: mockPlayers[1].walletAddress,
    rivalName: "Lane Witch",
    totalEncounters: 14,
    winsAgainstRival: 6,
    lossesAgainstRival: 8,
    winRateAgainstRival: 42.9,
    mostRecentRaceId: "race-017",
    relationshipType: "nemesis",
    notes: [
      "Lane Witch often saves defensive items for the finish split.",
      "Archon racer Shadow Spindle has beaten Volt Vandal twice in fog-heavy medium races."
    ]
  },
  {
    id: "rivalry-02",
    playerAddress: GIGAVERSE_OWNER_ADDRESS,
    rivalAddress: mockPlayers[2].walletAddress,
    rivalName: "Circuit Sage",
    totalEncounters: 11,
    winsAgainstRival: 7,
    lossesAgainstRival: 4,
    winRateAgainstRival: 63.6,
    mostRecentRaceId: "race-004",
    relationshipType: "rival",
    notes: [
      "Circuit Sage is strongest in muddy marathons.",
      "ByteBender wins more often when forcing sprint or medium distance."
    ]
  },
  {
    id: "rivalry-03",
    playerAddress: GIGAVERSE_OWNER_ADDRESS,
    rivalAddress: mockPlayers[4].walletAddress,
    rivalName: "Rainline",
    totalEncounters: 8,
    winsAgainstRival: 5,
    lossesAgainstRival: 3,
    winRateAgainstRival: 62.5,
    mostRecentRaceId: "race-019",
    relationshipType: "ally",
    notes: [
      "Rainline shares Athena-heavy race reads and rarely targets ByteBender with sabotage.",
      "Both stables benefit when wet-track fields are loaded with low-handling entrants."
    ]
  },
  {
    id: "rivalry-04",
    playerAddress: GIGAVERSE_OWNER_ADDRESS,
    rivalAddress: mockPlayers[7].walletAddress,
    rivalName: "Static Bloom",
    totalEncounters: 7,
    winsAgainstRival: 4,
    lossesAgainstRival: 3,
    winRateAgainstRival: 57.1,
    mostRecentRaceId: "race-014",
    relationshipType: "rival",
    notes: [
      "Static Bloom leans into risky storm sprints.",
      "Best response is a high-consistency Gigling with defensive item coverage."
    ]
  }
];

export const mockPredictionExamples: PredictionResult[] = [
  {
    input: {
      raceId: "race-017",
      distance: "medium",
      weather: "stormy",
      trackCondition: "chaotic",
      participantGiglingIds: [
        "gigling-05",
        "gigling-16",
        "gigling-20",
        "gigling-11",
        "gigling-01",
        "gigling-24"
      ]
    },
    participants: [
      {
        giglingId: "gigling-01",
        giglingName: "Volt Vandal",
        estimatedWinProbability: 24.8,
        estimatedPodiumProbability: 61.2,
        riskLevel: "medium",
        confidence: 72,
        reasons: [
          "Elite acceleration keeps it live even outside pure sprint distance.",
          "Wind preference is not active, but storm chaos gives luck a little more room."
        ]
      },
      {
        giglingId: "gigling-20",
        giglingName: "Pearl Pivot",
        estimatedWinProbability: 22.9,
        estimatedPodiumProbability: 58.5,
        riskLevel: "low",
        confidence: 75,
        reasons: [
          "High handling and consistency are strong safeguards on chaotic wet-leaning tracks.",
          "Recent streak suggests stable form."
        ]
      },
      {
        giglingId: "gigling-16",
        giglingName: "Voltage Velvet",
        estimatedWinProbability: 20.6,
        estimatedPodiumProbability: 54.1,
        riskLevel: "medium",
        confidence: 69,
        reasons: [
          "Storm history and acceleration both fit the race profile.",
          "Lower stamina adds late-race exposure."
        ]
      }
    ],
    topPickGiglingId: "gigling-01",
    confidence: 72,
    summary:
      "Volt Vandal is the narrow top pick, but this field is volatile because stormy chaotic conditions lift luck and item timing.",
    warnings: [
      "Prediction is an explainable estimate, not guaranteed accuracy.",
      "Mid-race sabotage can swing the top three."
    ]
  }
];

export const leaderboardGiglings = [...mockGiglings].sort(
  (first, second) => second.winRate - first.winRate
);

export const leaderboardPlayers = [...mockPlayers].sort(
  (first, second) => second.totalEarnings - first.totalEarnings
);

export const recentCompletedRaces = [...mockRaces]
  .filter((raceEntry) => raceEntry.status === "completed")
  .sort(
    (first, second) =>
      new Date(second.endedAt ?? 0).getTime() - new Date(first.endedAt ?? 0).getTime()
  );

export const activeRaces = mockRaces.filter(
  (raceEntry) => raceEntry.status === "live" || raceEntry.status === "scheduled"
);
