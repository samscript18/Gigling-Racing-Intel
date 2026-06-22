import type {
  Gigling,
  GiglingFaction,
  GiglingRarity,
  GiglingStats,
  GiglingTrait,
  Player,
  Race,
  RaceDistance,
  RaceItemUsage,
  RaceParticipant,
  RaceStatus,
  RaceWeather,
  StableSummary,
  TrackCondition
} from "@/types";

type UnknownRecord = Record<string, unknown>;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const factionValues: GiglingFaction[] = [
  "ember",
  "aqua",
  "terra",
  "volt",
  "shadow",
  "neutral"
];
const rarityValues: GiglingRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary"
];
const weatherValues: RaceWeather[] = ["sunny", "rainy", "stormy", "foggy", "windy"];
const distanceValues: RaceDistance[] = ["sprint", "medium", "long", "marathon"];
const trackValues: TrackCondition[] = ["dry", "wet", "muddy", "icy", "chaotic"];

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstValue(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    if (key in record) {
      return record[key];
    }
  }

  return undefined;
}

function nestedRecord(record: UnknownRecord, keys: string[]) {
  const value = firstValue(record, keys);
  return isRecord(value) ? value : undefined;
}

function normalizeText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  return fallback;
}

export function normalizeAddress(value: unknown, fallback = ZERO_ADDRESS) {
  const text = normalizeText(value, fallback);
  return text.toLowerCase();
}

export function normalizeDate(value: unknown) {
  if (!value) {
    return undefined;
  }

  const numericValue =
    typeof value === "bigint"
      ? Number(value)
      : typeof value === "number"
        ? value
        : undefined;
  const date =
    typeof numericValue === "number"
      ? new Date(numericValue < 10_000_000_000 ? numericValue * 1000 : numericValue)
      : new Date(normalizeText(value));

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizePercent(value: unknown, fallback = 0) {
  const parsed = normalizeNumber(value, fallback);
  return parsed > 0 && parsed <= 1 ? Number((parsed * 100).toFixed(1)) : parsed;
}

function normalizeId(prefix: "gigling" | "race" | "player", value: unknown, fallback: string) {
  const raw = normalizeText(value, fallback).replace(/^#/, "");

  if (raw.startsWith(`${prefix}-`)) {
    return raw;
  }

  return `${prefix}-${raw}`;
}

function normalizeTokenId(value: unknown, fallback: string) {
  const raw = normalizeText(value, fallback).replace(/^#/, "");
  return `#${raw}`;
}

function normalizeFaction(value: unknown): GiglingFaction {
  const raw = normalizeText(value, "neutral").toLowerCase();

  if (factionValues.includes(raw as GiglingFaction)) {
    return raw as GiglingFaction;
  }

  const mapped: Record<string, GiglingFaction> = {
    archon: "shadow",
    athena: "aqua",
    chobo: "volt",
    crusader: "ember",
    earth: "terra",
    fire: "ember",
    foxglove: "terra",
    gigus: "neutral",
    lightning: "volt",
    none: "neutral",
    overseer: "shadow",
    summoner: "neutral",
    water: "aqua"
  };

  return mapped[raw] ?? "neutral";
}

function normalizeRarity(value: unknown): GiglingRarity {
  const raw = normalizeText(value, "common").toLowerCase();
  return rarityValues.includes(raw as GiglingRarity) ? (raw as GiglingRarity) : "common";
}

function normalizeWeather(value: unknown): RaceWeather {
  const raw = normalizeText(value, "sunny").toLowerCase();

  if (weatherValues.includes(raw as RaceWeather)) {
    return raw as RaceWeather;
  }

  const mapped: Record<string, RaceWeather> = {
    cold: "foggy",
    hot: "sunny",
    snow: "stormy",
    snowing: "stormy",
    wet: "rainy"
  };

  return mapped[raw] ?? "sunny";
}

function normalizeDistance(value: unknown, trackLength?: unknown): RaceDistance {
  const raw = normalizeText(value).toLowerCase();

  if (distanceValues.includes(raw as RaceDistance)) {
    return raw as RaceDistance;
  }

  const meters = normalizeNumber(trackLength, 0);

  if (meters > 0 && meters <= 800) {
    return "sprint";
  }

  if (meters > 0 && meters <= 1500) {
    return "medium";
  }

  if (meters > 0 && meters <= 2500) {
    return "long";
  }

  if (meters > 2500) {
    return "marathon";
  }

  return "medium";
}

function normalizeTrack(value: unknown, weather: RaceWeather): TrackCondition {
  const raw = normalizeText(value).toLowerCase();

  if (trackValues.includes(raw as TrackCondition)) {
    return raw as TrackCondition;
  }

  if (weather === "rainy") {
    return "wet";
  }

  if (weather === "stormy") {
    return "chaotic";
  }

  if (weather === "foggy") {
    return "icy";
  }

  return "dry";
}

function normalizeStatus(value: unknown): RaceStatus {
  const raw = normalizeText(value, "completed").toLowerCase();

  if (["scheduled", "live", "completed", "cancelled"].includes(raw)) {
    return raw as RaceStatus;
  }

  if (["idle", "open"].includes(raw) || raw === "1") {
    return "scheduled";
  }

  if (["resolving", "running"].includes(raw) || raw === "2") {
    return "live";
  }

  if (["resolved", "finished"].includes(raw) || raw === "3") {
    return "completed";
  }

  if (["canceled", "cancelled"].includes(raw) || raw === "4") {
    return "cancelled";
  }

  return "completed";
}

function normalizeStats(record?: UnknownRecord): GiglingStats {
  return {
    speed: normalizeNumber(firstValue(record ?? {}, ["speed", "spd"]), 70),
    stamina: normalizeNumber(firstValue(record ?? {}, ["stamina", "sta"]), 70),
    handling: normalizeNumber(firstValue(record ?? {}, ["handling", "control"]), 70),
    acceleration: normalizeNumber(
      firstValue(record ?? {}, ["acceleration", "accel", "launch"]),
      70
    ),
    luck: normalizeNumber(firstValue(record ?? {}, ["luck", "rng"]), 70),
    consistency: normalizeNumber(firstValue(record ?? {}, ["consistency", "elo"]), 70)
  };
}

function adaptTrait(input: unknown, index: number): GiglingTrait {
  const record = isRecord(input) ? input : {};
  const category = normalizeText(firstValue(record, ["category", "type"]), "special");
  const safeCategory = [
    "speed",
    "stamina",
    "luck",
    "handling",
    "temperament",
    "special"
  ].includes(category)
    ? (category as GiglingTrait["category"])
    : "special";

  return {
    id: normalizeText(firstValue(record, ["id", "traitId"]), `trait-${index + 1}`),
    name: normalizeText(firstValue(record, ["name", "traitName"]), `Trait ${index + 1}`),
    category: safeCategory,
    revealed: Boolean(firstValue(record, ["revealed", "isRevealed"]) ?? true),
    value: normalizeNumber(firstValue(record, ["value", "score"]), undefined),
    description: normalizeText(
      firstValue(record, ["description", "summary"]),
      "Trait details will be enriched as Gigaverse trait metadata is connected."
    )
  };
}

function adaptTraits(value: unknown, stats: GiglingStats): GiglingTrait[] {
  if (Array.isArray(value) && value.length > 0) {
    return value.map(adaptTrait);
  }

  return [
    {
      id: "generated-speed",
      name: "Racing Profile",
      category: stats.speed >= stats.stamina ? "speed" : "stamina",
      revealed: true,
      value: Math.max(stats.speed, stats.stamina),
      description: "Generated from racing stats until official trait metadata is attached."
    }
  ];
}

function weatherFromParams(record: UnknownRecord) {
  const ids = firstValue(record, ["extraParamIds", "paramIds"]);
  const values = firstValue(record, ["extraParamVals", "paramVals"]);

  if (!Array.isArray(ids) || !Array.isArray(values)) {
    return undefined;
  }

  const weatherIndex = ids.findIndex((id) => normalizeNumber(id, -1) === 200);

  if (weatherIndex < 0) {
    return undefined;
  }

  const mapped: Record<number, RaceWeather> = {
    0: "sunny",
    1: "foggy",
    2: "rainy",
    3: "stormy"
  };

  return mapped[normalizeNumber(values[weatherIndex], -1)];
}

function isAppGigling(input: UnknownRecord): input is Gigling {
  return (
    typeof input.id === "string" &&
    typeof input.name === "string" &&
    isRecord(input.stats) &&
    Array.isArray(input.traits) &&
    "totalRaces" in input
  );
}

function isAppRace(input: UnknownRecord): input is Race {
  return (
    typeof input.id === "string" &&
    typeof input.raceNumber === "number" &&
    Array.isArray(input.participants)
  );
}

function isAppPlayer(input: UnknownRecord): input is Player {
  return (
    typeof input.id === "string" &&
    typeof input.walletAddress === "string" &&
    typeof input.totalRaces === "number"
  );
}

export function adaptApiGigling(input: Gigling): Gigling;
export function adaptApiGigling(input: unknown): Gigling | undefined;
export function adaptApiGigling(input: unknown): Gigling | undefined {
  if (!isRecord(input)) {
    return undefined;
  }

  if (isAppGigling(input)) {
    return {
      ...input,
      ownerAddress: normalizeAddress(input.ownerAddress),
      lastRaceAt: normalizeDate(input.lastRaceAt)
    };
  }

  const statsRecord = nestedRecord(input, ["stats", "racingStats", "attributes"]) ?? input;
  const stats = normalizeStats(statsRecord);
  const idSource = firstValue(input, ["id", "petId", "giglingId", "tokenId", "pet_id"]);
  const id = normalizeId("gigling", idSource, "unknown");
  const wins = normalizeNumber(firstValue(input, ["wins", "winCount"]), 0);
  const totalRaces = normalizeNumber(
    firstValue(input, ["totalRaces", "races", "racesRun", "raceCount"]),
    0
  );
  const podiums = normalizeNumber(firstValue(input, ["podiums", "podiumCount"]), wins);
  const winRate = normalizePercent(
    firstValue(input, ["winRate", "win_rate"]),
    totalRaces > 0 ? Number(((wins / totalRaces) * 100).toFixed(1)) : 0
  );

  return {
    id,
    tokenId: normalizeTokenId(
      firstValue(input, ["tokenId", "petId", "id"]),
      normalizeText(idSource, id)
    ),
    name: normalizeText(firstValue(input, ["name", "displayName", "petName"]), `Gigling ${id}`),
    imageUrl: normalizeText(firstValue(input, ["imageUrl", "image", "avatarUrl"]), ""),
    ownerAddress: normalizeAddress(firstValue(input, ["ownerAddress", "owner", "wallet"])),
    ownerName: normalizeText(firstValue(input, ["ownerName", "ownerDisplayName"]), undefined),
    faction: normalizeFaction(firstValue(input, ["faction", "factionName"])),
    rarity: normalizeRarity(firstValue(input, ["rarity", "tier"])),
    level: normalizeNumber(firstValue(input, ["level", "rank"]), 1),
    traits: adaptTraits(firstValue(input, ["traits", "attributes"]), stats),
    stats,
    totalRaces,
    wins,
    podiums,
    winRate,
    podiumRate: normalizePercent(
      firstValue(input, ["podiumRate", "podium_rate"]),
      totalRaces > 0 ? Number(((podiums / totalRaces) * 100).toFixed(1)) : 0
    ),
    earnings: normalizeNumber(firstValue(input, ["earnings", "totalEarnings", "prize"]), 0),
    currentStreak: normalizeNumber(firstValue(input, ["currentStreak", "streak"]), 0),
    bestDistance: normalizeDistance(firstValue(input, ["bestDistance", "distance"])),
    bestWeather: normalizeWeather(firstValue(input, ["bestWeather", "weather"])),
    lastRaceAt: normalizeDate(firstValue(input, ["lastRaceAt", "lastRace", "updatedAt"]))
  };
}

function adaptParticipant(input: unknown, index: number): RaceParticipant {
  const record = isRecord(input) ? input : {};
  const giglingId = normalizeId(
    "gigling",
    firstValue(record, ["giglingId", "petId", "id", "tokenId"]),
    String(index + 1)
  );
  const items = firstValue(record, ["itemsUsed", "items", "itemUsages"]);

  return {
    giglingId,
    giglingName: normalizeText(
      firstValue(record, ["giglingName", "petName", "name"]),
      `Gigling ${giglingId.replace("gigling-", "")}`
    ),
    ownerAddress: normalizeAddress(firstValue(record, ["ownerAddress", "owner", "entrant"])),
    ownerName: normalizeText(firstValue(record, ["ownerName", "entrantName"]), undefined),
    faction: normalizeFaction(firstValue(record, ["faction", "factionName"])),
    rarity: normalizeRarity(firstValue(record, ["rarity", "tier"])),
    startingLane: normalizeNumber(firstValue(record, ["startingLane", "lane"]), index + 1),
    finalPosition:
      firstValue(record, ["finalPosition", "placement", "rank"]) === undefined
        ? undefined
        : normalizeNumber(firstValue(record, ["finalPosition", "placement", "rank"])),
    itemsUsed: Array.isArray(items) ? items.map(adaptRaceItem) : [],
    performanceScore:
      firstValue(record, ["performanceScore", "score"]) === undefined
        ? undefined
        : normalizeNumber(firstValue(record, ["performanceScore", "score"]))
  };
}

function adaptRaceItem(input: unknown, index: number): RaceItemUsage {
  const record = isRecord(input) ? input : {};
  const type = normalizeText(firstValue(record, ["type", "itemType"]), "utility");
  const stage = normalizeText(firstValue(record, ["usedAtStage", "stage"]), "mid");

  return {
    id: normalizeText(firstValue(record, ["id", "itemId"]), `item-${index + 1}`),
    itemName: normalizeText(firstValue(record, ["itemName", "name"]), "Race item"),
    type: ["boost", "sabotage", "defense", "utility"].includes(type)
      ? (type as RaceItemUsage["type"])
      : "utility",
    targetGiglingId:
      firstValue(record, ["targetGiglingId", "targetPetId"]) === undefined
        ? undefined
        : normalizeId("gigling", firstValue(record, ["targetGiglingId", "targetPetId"]), ""),
    impact: normalizeNumber(firstValue(record, ["impact", "amount"]), 0),
    usedAtStage: ["start", "mid", "finish"].includes(stage)
      ? (stage as RaceItemUsage["usedAtStage"])
      : "mid"
  };
}

export function adaptApiRace(input: Race): Race;
export function adaptApiRace(input: unknown): Race | undefined;
export function adaptApiRace(input: unknown): Race | undefined {
  if (!isRecord(input)) {
    return undefined;
  }

  if (isAppRace(input)) {
    return {
      ...input,
      startedAt: normalizeDate(input.startedAt),
      endedAt: normalizeDate(input.endedAt),
      participants: input.participants.map((participant) => ({
        ...participant,
        ownerAddress: normalizeAddress(participant.ownerAddress)
      }))
    };
  }

  const raceRecord = nestedRecord(input, ["race", "state"]) ?? input;
  const raceIdSource = firstValue(raceRecord, ["raceId", "id"]);
  const weather =
    weatherFromParams(raceRecord) ??
    normalizeWeather(firstValue(raceRecord, ["weather", "weatherName"]));
  const participants =
    firstValue(raceRecord, ["participants", "entries", "pets"]) ??
    firstValue(input, ["participants", "entries", "pets"]);
  const finalRanking = firstValue(raceRecord, ["finalRanking", "ranking"]);
  const rankingWinner = Array.isArray(finalRanking) ? finalRanking[0] : undefined;

  return {
    id: normalizeId("race", raceIdSource, "unknown"),
    raceNumber: normalizeNumber(raceIdSource, normalizeNumber(firstValue(raceRecord, ["raceNumber"]), 0)),
    status: normalizeStatus(firstValue(raceRecord, ["status", "phase", "racePhase"])),
    distance: normalizeDistance(
      firstValue(raceRecord, ["distance", "distanceName"]),
      firstValue(raceRecord, ["trackLength", "length"])
    ),
    weather,
    trackCondition: normalizeTrack(
      firstValue(raceRecord, ["trackCondition", "condition"]),
      weather
    ),
    entryFee: normalizeNumber(firstValue(raceRecord, ["entryFee", "entryFeeWei"]), 0),
    prizePool: normalizeNumber(firstValue(raceRecord, ["prizePool", "pool"]), 0),
    startedAt: normalizeDate(firstValue(raceRecord, ["startedAt", "raceStart", "createdAt"])),
    endedAt: normalizeDate(firstValue(raceRecord, ["endedAt", "raceFinish", "resolvedAt"])),
    participants: Array.isArray(participants) ? participants.map(adaptParticipant) : [],
    winnerGiglingId:
      firstValue(raceRecord, ["winnerGiglingId", "winnerPetId"]) === undefined &&
      rankingWinner === undefined
        ? undefined
        : normalizeId(
            "gigling",
            firstValue(raceRecord, ["winnerGiglingId", "winnerPetId"]) ?? rankingWinner,
            ""
          ),
    payoutTxHash: normalizeText(
      firstValue(raceRecord, ["payoutTxHash", "txHash", "resolveTxHash"]),
      undefined
    )
  };
}

export function adaptApiPlayer(input: Player): Player;
export function adaptApiPlayer(input: unknown): Player | undefined;
export function adaptApiPlayer(input: unknown): Player | undefined {
  if (!isRecord(input)) {
    return undefined;
  }

  if (isAppPlayer(input)) {
    return {
      ...input,
      walletAddress: normalizeAddress(input.walletAddress)
    };
  }

  const wins = normalizeNumber(firstValue(input, ["wins", "winCount"]), 0);
  const totalRaces = normalizeNumber(firstValue(input, ["totalRaces", "raceCount", "races"]), 0);

  return {
    id: normalizeId("player", firstValue(input, ["id", "walletAddress", "address"]), "unknown"),
    walletAddress: normalizeAddress(firstValue(input, ["walletAddress", "address", "owner"])),
    displayName: normalizeText(firstValue(input, ["displayName", "name", "username"]), undefined),
    avatarUrl: normalizeText(firstValue(input, ["avatarUrl", "avatar", "image"]), undefined),
    totalRaces,
    wins,
    winRate: normalizePercent(
      firstValue(input, ["winRate", "win_rate"]),
      totalRaces > 0 ? Number(((wins / totalRaces) * 100).toFixed(1)) : 0
    ),
    totalEarnings: normalizeNumber(firstValue(input, ["totalEarnings", "earnings"]), 0),
    favoriteFaction: normalizeFaction(firstValue(input, ["favoriteFaction", "faction"])),
    stableSize: normalizeNumber(firstValue(input, ["stableSize", "pets", "giglings"]), 0)
  };
}

export function adaptApiStable(input: unknown): StableSummary | undefined {
  if (!isRecord(input)) {
    return undefined;
  }

  const giglings = adaptApiGiglings(firstValue(input, ["giglings", "pets", "stable"]));
  const totalWins = normalizeNumber(firstValue(input, ["totalWins", "wins"]), 0);

  return {
    ownerAddress: normalizeAddress(firstValue(input, ["ownerAddress", "walletAddress", "address"])),
    ownerName: normalizeText(firstValue(input, ["ownerName", "displayName", "name"]), undefined),
    giglings,
    totalRaces: normalizeNumber(firstValue(input, ["totalRaces", "races"]), 0),
    totalWins,
    averageWinRate: normalizePercent(firstValue(input, ["averageWinRate", "winRate"]), 0),
    bestGiglingId:
      firstValue(input, ["bestGiglingId", "bestPetId"]) === undefined
        ? undefined
        : normalizeId("gigling", firstValue(input, ["bestGiglingId", "bestPetId"]), ""),
    recommendedRaceIds: [],
    alerts: []
  };
}

export function adaptContractRace(input: Race): Race;
export function adaptContractRace(input: unknown): Race | undefined;
export function adaptContractRace(input: unknown): Race | undefined {
  return adaptApiRace(input);
}

export function extractRecordList(input: unknown, keys: string[]) {
  if (Array.isArray(input)) {
    return input.filter(isRecord);
  }

  if (!isRecord(input)) {
    return [];
  }

  for (const key of keys) {
    const value = input[key];

    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  const data = input.data;

  if (data && data !== input) {
    return extractRecordList(data, keys);
  }

  return [];
}

export function adaptApiGiglings(input: unknown) {
  return extractRecordList(input, ["giglings", "pets", "items", "results", "leaderboard"]).flatMap(
    (entry) => {
      const adapted = adaptApiGigling(entry);
      return adapted ? [adapted] : [];
    }
  );
}

export function adaptApiRaces(input: unknown) {
  return extractRecordList(input, ["races", "items", "results", "entries"]).flatMap((entry) => {
    const adapted = adaptApiRace(entry);
    return adapted ? [adapted] : [];
  });
}

export function adaptApiPlayers(input: unknown) {
  return extractRecordList(input, ["players", "owners", "items", "results", "leaderboard"]).flatMap(
    (entry) => {
      const adapted = adaptApiPlayer(entry);
      return adapted ? [adapted] : [];
    }
  );
}
