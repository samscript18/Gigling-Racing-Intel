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
  "crusader",
  "overseer",
  "athena",
  "archon",
  "foxglove",
  "summoner",
  "chobo",
  "gigus"
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

function normalizeText(value: unknown, defaultValue = "") {
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return String(value);
  }

  return defaultValue;
}

export function normalizeAddress(value: unknown, defaultValue = ZERO_ADDRESS) {
  const text = normalizeText(value, defaultValue);
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

export function normalizeNumber(value: unknown, defaultValue = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : defaultValue;
  }

  return defaultValue;
}

function normalizePercent(value: unknown, defaultValue = 0) {
  const parsed = normalizeNumber(value, defaultValue);
  return parsed > 0 && parsed <= 1 ? Number((parsed * 100).toFixed(1)) : parsed;
}

function clampStat(value: number) {
  return Math.max(0, Math.min(100, Number(value.toFixed(1))));
}

function normalizeTokenAmount(value: unknown, defaultValue = 0) {
  if (typeof value === "string" && /^\d+$/.test(value) && value.length > 12) {
    return Number((Number(value) / 1_000_000_000_000_000_000).toFixed(4));
  }

  return normalizeNumber(value, defaultValue);
}

function normalizeId(prefix: "gigling" | "race" | "player", value: unknown, defaultValue: string) {
  const raw = normalizeText(value, defaultValue).replace(/^#/, "");

  if (raw.startsWith(`${prefix}-`)) {
    return raw;
  }

  return `${prefix}-${raw}`;
}

function normalizeTokenId(value: unknown, defaultValue: string) {
  const raw = normalizeText(value, defaultValue).replace(/^#/, "");
  return `#${raw}`;
}

function normalizeFaction(value: unknown): GiglingFaction {
  const raw = normalizeText(value).toLowerCase();

  if (factionValues.includes(raw as GiglingFaction)) {
    return raw as GiglingFaction;
  }

  const mapped: Record<string, GiglingFaction> = {
    "1": "crusader",
    "2": "overseer",
    "3": "athena",
    "4": "archon",
    "5": "foxglove",
    "6": "summoner",
    "7": "chobo",
    "8": "gigus",
    aqua: "athena",
    earth: "foxglove",
    ember: "crusader",
    fire: "crusader",
    lightning: "chobo",
    neutral: "gigus",
    none: "gigus",
    shadow: "archon",
    terra: "foxglove",
    volt: "chobo",
    water: "athena"
  };

  return mapped[raw] ?? "unknown";
}

function normalizeRarity(value: unknown): GiglingRarity {
  const raw = normalizeText(value).toLowerCase();

  if (rarityValues.includes(raw as GiglingRarity)) {
    return raw as GiglingRarity;
  }

  const mapped: Record<string, GiglingRarity> = {
    "1": "common",
    "2": "uncommon",
    "3": "rare",
    "4": "epic",
    "5": "legendary",
    "6": "legendary",
    giga: "legendary"
  };

  return mapped[raw] ?? "unknown";
}

function normalizeWeather(value: unknown): RaceWeather {
  const raw = normalizeText(value).toLowerCase();

  if (weatherValues.includes(raw as RaceWeather)) {
    return raw as RaceWeather;
  }

  const mapped: Record<string, RaceWeather> = {
    average: "sunny",
    cold: "foggy",
    hot: "sunny",
    snow: "stormy",
    snowing: "stormy",
    wet: "rainy"
  };

  return mapped[raw] ?? "unknown";
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

  return "unknown";
}

function normalizeTrack(value: unknown): TrackCondition {
  const raw = normalizeText(value).toLowerCase();

  if (trackValues.includes(raw as TrackCondition)) {
    return raw as TrackCondition;
  }

  return "unknown";
}

function normalizeStatus(value: unknown): RaceStatus {
  const raw = normalizeText(value).toLowerCase();

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

  return "unknown";
}

function normalizeStats(record?: UnknownRecord): GiglingStats {
  const averageRange = (key: string) => {
    const range = nestedRecord(record ?? {}, [key]);

    if (!range) {
      return undefined;
    }

    return (
      (normalizeNumber(firstValue(range, ["min"]), 0) +
        normalizeNumber(firstValue(range, ["max"]), 0)) /
      2
    );
  };
  return {
    speed: clampStat(
      normalizeNumber(firstValue(record ?? {}, ["speed", "spd"]), averageRange("speedRange") ?? 0)
    ),
    stamina: clampStat(
      normalizeNumber(
        firstValue(record ?? {}, ["stamina", "sta"]),
        averageRange("staminaRange") ?? 0
      )
    ),
    handling: clampStat(
      normalizeNumber(
        firstValue(record ?? {}, ["handling", "control", "finish"]),
        averageRange("finishRange") ?? 0
      )
    ),
    acceleration: clampStat(
      normalizeNumber(
        firstValue(record ?? {}, ["acceleration", "accel", "launch", "start"]),
        averageRange("startRange") ?? 0
      )
    ),
    luck: clampStat(normalizeNumber(firstValue(record ?? {}, ["luck", "rng"]), 0)),
    consistency: clampStat(
      normalizeNumber(
        firstValue(record ?? {}, ["consistency"]),
        0
      )
    )
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
    value: normalizeNumber(firstValue(record, ["value", "score", "tier"]), undefined),
    description: normalizeText(
      firstValue(record, ["description", "summary"]),
      "No live description was provided for this trait."
    )
  };
}

function adaptTraits(value: unknown): GiglingTrait[] {
  if (Array.isArray(value) && value.length > 0) {
    return value.map(adaptTrait);
  }

  return [];
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

  const racePublic = nestedRecord(input, ["racePublic"]);
  const statsRecord = nestedRecord(input, ["stats", "racingStats", "attributes"]) ?? racePublic ?? input;
  const stats = normalizeStats(statsRecord);
  const idSource = firstValue(input, ["id", "petId", "giglingId", "tokenId", "pet_id"]);

  if (idSource === undefined) {
    return undefined;
  }

  const id = normalizeId("gigling", idSource, "unknown");
  const wins = normalizeNumber(
    firstValue(input, ["wins", "winCount"]) ?? firstValue(racePublic ?? {}, ["wins"]),
    0
  );
  const totalRaces = normalizeNumber(
    firstValue(input, ["totalRaces", "races", "racesRun", "raceCount"]) ??
      firstValue(racePublic ?? {}, ["racesRun", "eloRaceCount"]),
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
    name: normalizeText(
      firstValue(input, ["name", "displayName", "petName"]),
      `Gigling #${normalizeText(idSource, id).replace(/^#/, "")}`
    ),
    imageUrl: normalizeText(
      firstValue(input, ["imageUrl", "image", "imgUrl", "avatarUrl"]),
      ""
    ),
    ownerAddress: normalizeAddress(firstValue(input, ["ownerAddress", "owner", "wallet"])),
    ownerName: normalizeText(
      firstValue(input, ["ownerName", "ownerDisplayName"]) ??
        firstValue(nestedRecord(input, ["ownerSummary"]) ?? {}, ["username"]),
      undefined
    ),
    faction: normalizeFaction(firstValue(input, ["factionName", "faction"])),
    rarity: normalizeRarity(firstValue(input, ["rarityName", "rarity", "tier"])),
    level: normalizeNumber(firstValue(input, ["level", "rank"]), 1),
    traits: adaptTraits(
      firstValue(input, ["traits", "attributes"]) ??
        firstValue(racePublic ?? {}, ["traits", "attributes"])
    ),
    stats,
    totalRaces,
    wins,
    podiums,
    winRate,
    podiumRate: normalizePercent(
      firstValue(input, ["podiumRate", "podium_rate"]),
      totalRaces > 0 ? Number(((podiums / totalRaces) * 100).toFixed(1)) : 0
    ),
    earnings: normalizeTokenAmount(
      firstValue(input, ["earnings", "totalEarnings", "prize", "weiNet", "weiWon"]),
      0
    ),
    currentStreak: normalizeNumber(firstValue(input, ["currentStreak", "streak"]), 0),
    bestDistance: normalizeDistance(firstValue(input, ["bestDistance", "distance"])),
    bestWeather: normalizeWeather(firstValue(input, ["bestWeather", "weather"])),
    lastRaceAt: normalizeDate(firstValue(input, ["lastRaceAt", "lastRace", "updatedAt"]))
  };
}

function adaptParticipant(
  input: unknown,
  index: number,
  context: {
    finalRanking?: unknown[];
    finishTimes?: unknown[];
    petOwners?: UnknownRecord;
  } = {}
): RaceParticipant {
  const record = isRecord(input) ? input : {};
  const petIdSource = firstValue(record, ["giglingId", "petId", "id", "tokenId"]);
  const giglingId = normalizeId(
    "gigling",
    petIdSource,
    String(index + 1)
  );
  const items = firstValue(record, ["itemsUsed", "items", "itemUsages"]);
  const rankedIndex =
    context.finalRanking?.findIndex(
      (rankedPetId) => normalizeText(rankedPetId) === normalizeText(petIdSource)
    ) ?? -1;
  const finalPosition =
    firstValue(record, ["finalPosition", "placement", "rank"]) === undefined
      ? rankedIndex >= 0
        ? rankedIndex + 1
        : undefined
      : normalizeNumber(firstValue(record, ["finalPosition", "placement", "rank"]));
  const ownerFromMap =
    context.petOwners && petIdSource !== undefined
      ? context.petOwners[normalizeText(petIdSource)]
      : undefined;

  return {
    giglingId,
    giglingName: normalizeText(
      firstValue(record, ["giglingName", "petName", "name"]),
      `Gigling ${giglingId.replace("gigling-", "")}`
    ),
    ownerAddress: normalizeAddress(
      firstValue(record, ["ownerAddress", "owner", "entrant"]) ?? ownerFromMap
    ),
    ownerName: normalizeText(firstValue(record, ["ownerName", "entrantName"]), undefined),
    faction: normalizeFaction(firstValue(record, ["factionName", "faction"])),
    rarity: normalizeRarity(firstValue(record, ["rarityName", "rarity", "tier"])),
    startingLane: normalizeNumber(firstValue(record, ["startingLane", "lane", "slot"]), index) + 1,
    finalPosition,
    itemsUsed: Array.isArray(items) ? items.map(adaptRaceItem) : [],
    performanceScore:
      firstValue(record, ["performanceScore", "score"]) === undefined
        ? finalPosition
          ? Math.max(45, 100 - finalPosition * 5)
          : undefined
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

  if (raceIdSource === undefined) {
    return undefined;
  }

  const weather =
    weatherFromParams(raceRecord) ??
    normalizeWeather(firstValue(raceRecord, ["weather", "weatherName", "raceTemp"]));
  const participants =
    firstValue(raceRecord, ["participants", "entries", "pets"]) ??
    firstValue(input, ["participants", "entries", "pets"]);
  const finalRanking = firstValue(raceRecord, ["finalRanking", "ranking"]);
  const rankingWinner = Array.isArray(finalRanking) ? finalRanking[0] : undefined;
  const finishTimes = firstValue(raceRecord, ["finishTimes", "msFinishTimes"]);
  const petOwners = nestedRecord(raceRecord, ["petOwners"]);
  const generatedParticipants =
    !Array.isArray(participants) && Array.isArray(firstValue(raceRecord, ["racePets"]))
      ? (firstValue(raceRecord, ["racePets"]) as unknown[]).map((petId, index) => ({
          petId,
          slot: index
        }))
      : undefined;

  return {
    id: normalizeId("race", raceIdSource, "unknown"),
    raceNumber: normalizeNumber(raceIdSource, normalizeNumber(firstValue(raceRecord, ["raceNumber"]), 0)),
    status: normalizeStatus(firstValue(raceRecord, ["status", "phase", "racePhase"])),
    distance: normalizeDistance(
      firstValue(raceRecord, ["distance", "distanceName"]),
      firstValue(raceRecord, ["trackLength", "length"])
    ),
    weather,
    trackCondition: normalizeTrack(firstValue(raceRecord, ["trackCondition", "condition"])),
    entryFee: normalizeTokenAmount(firstValue(raceRecord, ["entryFee", "entryFeeWei"]), 0),
    prizePool: normalizeTokenAmount(firstValue(raceRecord, ["prizePool", "pool"]), 0),
    startedAt: normalizeDate(firstValue(raceRecord, ["startedAt", "raceStart", "createdAt"])),
    endedAt: normalizeDate(firstValue(raceRecord, ["endedAt", "raceFinish", "resolvedAt"])),
    participants: (Array.isArray(participants) ? participants : generatedParticipants ?? []).map(
      (participant, index) =>
        adaptParticipant(participant, index, {
          finalRanking: Array.isArray(finalRanking) ? finalRanking : undefined,
          finishTimes: Array.isArray(finishTimes) ? finishTimes : undefined,
          petOwners
        })
    ),
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
      firstValue(raceRecord, [
        "payoutTxHash",
        "txHash",
        "resolveTxHash",
        "broadcastTxHash",
        "createdTxHash"
      ]),
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

  const racePublic = nestedRecord(input, ["racePublic"]);
  const ownerSummary = nestedRecord(input, ["ownerSummary"]);
  const wins = normalizeNumber(
    firstValue(input, ["wins", "winCount"]) ?? firstValue(racePublic ?? {}, ["wins"]),
    0
  );
  const totalRaces = normalizeNumber(
    firstValue(input, ["totalRaces", "raceCount", "races", "racesRun"]) ??
      firstValue(racePublic ?? {}, ["racesRun", "eloRaceCount"]),
    0
  );

  return {
    id: normalizeId(
      "player",
      firstValue(input, ["id", "walletAddress", "ownerAddress", "address"]),
      "unknown"
    ),
    walletAddress: normalizeAddress(
      firstValue(input, ["walletAddress", "ownerAddress", "address", "owner"])
    ),
    displayName: normalizeText(
      firstValue(input, ["displayName", "name", "username"]) ??
        firstValue(ownerSummary ?? {}, ["username"]),
      undefined
    ),
    avatarUrl: normalizeText(
      firstValue(input, ["avatarUrl", "avatar", "image"]) ??
        firstValue(ownerSummary ?? {}, ["headSheetUrl", "bodySheetUrl"]),
      undefined
    ),
    totalRaces,
    wins,
    winRate: normalizePercent(
      firstValue(input, ["winRate", "win_rate"]),
      totalRaces > 0 ? Number(((wins / totalRaces) * 100).toFixed(1)) : 0
    ),
    totalEarnings: normalizeTokenAmount(firstValue(input, ["totalEarnings", "earnings", "weiNet"]), 0),
    favoriteFaction: normalizeFaction(
      firstValue(input, ["favoriteFaction", "factionName", "faction"])
    ),
    stableSize: normalizeNumber(
      firstValue(input, ["stableSize", "pets", "giglings"]) ??
        firstValue(ownerSummary ?? {}, ["petCount"]),
      0
    )
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
  return extractRecordList(input, [
    "giglings",
    "pets",
    "entries",
    "items",
    "results",
    "leaderboard"
  ]).flatMap((entry) => {
    const adapted = adaptApiGigling(entry);
    return adapted ? [adapted] : [];
  });
}

export function adaptApiRaces(input: unknown) {
  return extractRecordList(input, ["races", "items", "results", "entries"]).flatMap((entry) => {
    const adapted = adaptApiRace(entry);
    return adapted ? [adapted] : [];
  });
}

export function adaptApiPlayers(input: unknown) {
  return extractRecordList(input, [
    "players",
    "owners",
    "entries",
    "items",
    "results",
    "leaderboard"
  ]).flatMap((entry) => {
    const adapted = adaptApiPlayer(entry);
    return adapted ? [adapted] : [];
  });
}
