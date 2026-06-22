import axios from "axios";

import { appEnv, hasGigaverseApiConfig } from "@/lib/config/env";
import type {
  Gigling,
  MetaInsight,
  Race,
  RivalryRecord,
  StableSummary
} from "@/types";

import {
  adaptApiGigling,
  adaptApiGiglings,
  adaptApiPlayers,
  adaptApiRace,
  adaptApiRaces,
  adaptApiStable,
  extractRecordList,
  isRecord,
  normalizeAddress
} from "./adapters";
import { getFactionPerformanceFromRaces } from "./analytics";
import { readRaceContract } from "./contract-client";

const REQUEST_TIMEOUT_MS = 8_000;
const gigaverseHttp = axios.create({
  baseURL: appEnv.gigaverseApiBaseUrl,
  headers: {
    Accept: "application/json"
  },
  timeout: REQUEST_TIMEOUT_MS
});

type RequestOptions = {
  allowNotFound?: boolean;
  authToken?: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

export class GigaverseDataError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GigaverseDataError";
    this.status = status;
  }
}

function toRemotePetId(id: string) {
  return id.replace(/^gigling-/, "").replace(/^#/, "");
}

function toRemoteRaceId(id: string) {
  return id.replace(/^race-/, "");
}

async function requestGigaverseJson(path: string, options: RequestOptions = {}) {
  if (!hasGigaverseApiConfig()) {
    throw new GigaverseDataError(
      "The Gigaverse Racing API is not configured. Add NEXT_PUBLIC_GIGAVERSE_API_BASE_URL and try again."
    );
  }

  try {
    const response = await gigaverseHttp.get(path, {
      headers: {
        ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {})
      },
      params: options.searchParams
    });

    if (
      response.data === null ||
      (typeof response.data !== "object" && !Array.isArray(response.data))
    ) {
      throw new GigaverseDataError(
        "Gigaverse returned a response that could not be read as racing data."
      );
    }

    return response.data as unknown;
  } catch (error) {
    if (error instanceof GigaverseDataError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 404 && options.allowNotFound) {
        return undefined;
      }

      if (status === 401 || status === 403) {
        throw new GigaverseDataError(
          "This live Gigaverse endpoint requires an authenticated Gigaverse session.",
          status
        );
      }

      if (status) {
        throw new GigaverseDataError(
          `Gigaverse returned HTTP ${status} for this live request.`,
          status
        );
      }

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new GigaverseDataError(
          "The live Gigaverse request timed out. The service may be busy; please retry shortly."
        );
      }
    }

    if (error instanceof Error && error.name === "CanceledError") {
      throw new GigaverseDataError(
        "The live Gigaverse request was cancelled before it completed."
      );
    }

    throw new GigaverseDataError(
      "Live Gigaverse racing data is currently unreachable. Check your connection and try again."
    );
  }
}

function mergeRecordPayloads(primary: unknown, secondary: unknown) {
  const primaryRecord = isRecord(primary) ? primary : {};
  const secondaryRecord = isRecord(secondary) ? secondary : {};

  return {
    ...primaryRecord,
    ...secondaryRecord,
    stats: isRecord(secondaryRecord.stats) ? secondaryRecord.stats : secondaryRecord
  };
}

function pickStatsRecord(statsPayload: unknown, petId: string) {
  const statsList = extractRecordList(statsPayload, ["stats"]);
  const matchingStats = statsList.find((entry) => {
    const entryPetId = String(entry.petId ?? entry.id ?? "");
    return entryPetId === petId;
  });

  if (matchingStats) {
    return matchingStats;
  }

  if (isRecord(statsPayload) && isRecord(statsPayload.stats)) {
    return statsPayload.stats;
  }

  return statsPayload;
}

function extractOwnedGiglingIds(ownerAddress: string, races: Race[]) {
  const normalizedOwner = normalizeAddress(ownerAddress);
  const ids = races.flatMap((race) =>
    race.participants
      .filter((participant) => normalizeAddress(participant.ownerAddress) === normalizedOwner)
      .map((participant) => participant.giglingId)
  );

  return Array.from(new Set(ids));
}

function getRaceGiglingIds(races: Race[]) {
  return Array.from(
    new Set(races.flatMap((race) => race.participants.map((participant) => participant.giglingId)))
  );
}

async function enrichRacesWithGiglings(races: Race[]) {
  const giglingIds = getRaceGiglingIds(races);

  if (giglingIds.length === 0) {
    return races;
  }

  let giglings: Gigling[] = [];

  try {
    giglings = await fetchGiglingsByIds(giglingIds);
  } catch {
    return races;
  }

  return races.map((race) => ({
    ...race,
    participants: race.participants.map((participant) => {
      const gigling = giglings.find((entry) => entry.id === participant.giglingId);

      return {
        ...participant,
        giglingName: gigling?.name ?? participant.giglingName,
        ownerName: gigling?.ownerName ?? participant.ownerName,
        faction: gigling?.faction ?? participant.faction,
        rarity: gigling?.rarity ?? participant.rarity,
        performanceScore:
          participant.performanceScore ??
          (gigling
            ? Math.round(
                (gigling.stats.speed +
                  gigling.stats.stamina +
                  gigling.stats.handling +
                  gigling.stats.consistency) /
                  4
              )
            : undefined)
      };
    })
  }));
}

function buildGlobalStatsInsight(payload: unknown): MetaInsight | undefined {
  const data = isRecord(payload) && isRecord(payload.data) ? payload.data : undefined;

  if (!data) {
    return undefined;
  }

  const totalRacesCreated = Number(data.totalRacesCreated ?? 0);
  const totalEntries = Number(data.totalEntries ?? 0);
  const uniqueRacers = Number(data.uniqueRacers ?? 0);

  if (!Number.isFinite(totalRacesCreated) || totalRacesCreated <= 0) {
    return undefined;
  }

  return {
    id: "live-global-racing-stats",
    title: "Live Gigling Racing volume",
    description: `${Intl.NumberFormat("en").format(totalEntries)} entries from ${Intl.NumberFormat("en").format(uniqueRacers)} unique racers are indexed by Gigaverse.`,
    severity: "info",
    metricLabel: "Total races created",
    metricValue: Intl.NumberFormat("en").format(totalRacesCreated),
    trendDirection: "flat",
    createdAt: new Date().toISOString()
  };
}

function buildFactionInsight(races: Race[]): MetaInsight | undefined {
  const topFaction = getFactionPerformanceFromRaces(races)
    .filter((entry) => entry.races > 0)
    .sort((first, second) => second.winRate - first.winRate)[0];

  if (!topFaction) {
    return undefined;
  }

  return {
    id: "live-faction-performance",
    title: `${topFaction.faction} leads the indexed faction field`,
    description: `${topFaction.faction} has a ${topFaction.winRate}% win rate across ${topFaction.races} live-indexed entries with final placements.`,
    severity: "positive",
    metricLabel: "Faction win rate",
    metricValue: `${topFaction.winRate}%`,
    trendDirection: "flat",
    createdAt: new Date().toISOString()
  };
}

function buildStableFromGiglings(
  ownerAddress: string,
  giglings: Gigling[],
  races: Race[]
): StableSummary {
  const normalizedOwner = normalizeAddress(ownerAddress);
  const ownerGiglings = giglings.filter(
    (gigling) => normalizeAddress(gigling.ownerAddress) === normalizedOwner
  );
  const totalRaces = ownerGiglings.reduce((total, gigling) => total + gigling.totalRaces, 0);
  const totalWins = ownerGiglings.reduce((total, gigling) => total + gigling.wins, 0);
  const bestGigling = [...ownerGiglings].sort(
    (first, second) => second.winRate - first.winRate
  )[0];

  return {
    ownerAddress: normalizedOwner,
    ownerName: bestGigling?.ownerName,
    giglings: ownerGiglings,
    totalRaces,
    totalWins,
    averageWinRate:
      ownerGiglings.length > 0
        ? Number(
            (
              ownerGiglings.reduce((total, gigling) => total + gigling.winRate, 0) /
              ownerGiglings.length
            ).toFixed(1)
          )
        : 0,
    bestGiglingId: bestGigling?.id,
    recommendedRaceIds: races
      .filter((race) => race.status === "live" || race.status === "scheduled")
      .slice(0, 3)
      .map((race) => race.id),
    alerts: []
  };
}

function buildRivalries(ownerAddress: string, races: Race[]): RivalryRecord[] {
  const owner = normalizeAddress(ownerAddress);
  const opponents = new Map<
    string,
    {
      encounters: number;
      losses: number;
      mostRecentRaceId: string;
      name?: string;
      sharedPodiums: number;
      wins: number;
    }
  >();

  for (const race of races) {
    const ownerPositions = race.participants
      .filter((participant) => normalizeAddress(participant.ownerAddress) === owner)
      .map((participant) => participant.finalPosition)
      .filter((position): position is number => typeof position === "number");

    if (ownerPositions.length === 0) {
      continue;
    }

    const ownerBest = Math.min(...ownerPositions);
    const raceOpponents = new Map<string, { name?: string; position: number }>();

    for (const participant of race.participants) {
      const rivalAddress = normalizeAddress(participant.ownerAddress);

      if (
        rivalAddress === owner ||
        rivalAddress === "0x0000000000000000000000000000000000000000" ||
        typeof participant.finalPosition !== "number"
      ) {
        continue;
      }

      const existing = raceOpponents.get(rivalAddress);
      if (!existing || participant.finalPosition < existing.position) {
        raceOpponents.set(rivalAddress, {
          name: participant.ownerName,
          position: participant.finalPosition
        });
      }
    }

    for (const [rivalAddress, rival] of raceOpponents) {
      const current = opponents.get(rivalAddress) ?? {
        encounters: 0,
        losses: 0,
        mostRecentRaceId: race.id,
        name: rival.name,
        sharedPodiums: 0,
        wins: 0
      };
      current.encounters += 1;
      current.name = current.name ?? rival.name;
      current.mostRecentRaceId = race.id;

      if (ownerBest <= 3 && rival.position <= 3) {
        current.sharedPodiums += 1;
      }

      if (ownerBest < rival.position) {
        current.wins += 1;
      } else if (ownerBest > rival.position) {
        current.losses += 1;
      }

      opponents.set(rivalAddress, current);
    }
  }

  return [...opponents.entries()]
    .filter(([, record]) => record.encounters >= 2)
    .map(([rivalAddress, record]) => {
      const decided = record.wins + record.losses;
      const winRate = decided > 0 ? Number(((record.wins / decided) * 100).toFixed(1)) : 0;
      const coPodiumRate = record.sharedPodiums / record.encounters;
      const isBalanced = Math.abs(record.wins - record.losses) <= 1;
      const relationshipType =
        winRate <= 35 && record.losses >= 2
          ? "nemesis"
          : record.sharedPodiums >= 2 && coPodiumRate >= 0.5 && isBalanced
            ? "ally"
            : "rival";

      return {
        id: `rivalry-${owner}-${rivalAddress}`,
        playerAddress: owner,
        rivalAddress,
        rivalName: record.name,
        totalEncounters: record.encounters,
        winsAgainstRival: record.wins,
        lossesAgainstRival: record.losses,
        winRateAgainstRival: winRate,
        mostRecentRaceId: record.mostRecentRaceId,
        relationshipType,
        notes: [
          `${record.encounters} shared races found in the live player history.`,
          `${record.wins} head-to-head wins and ${record.losses} losses were calculated from final placements.`,
          `${record.sharedPodiums} co-podium finish${record.sharedPodiums === 1 ? "" : "es"} shape the ${relationshipType} classification.`
        ]
      } satisfies RivalryRecord;
    })
    .sort(
      (first, second) =>
        second.totalEncounters - first.totalEncounters ||
        first.winRateAgainstRival - second.winRateAgainstRival
    );
}

export async function fetchGiglings() {
  const payload = await requestGigaverseJson("/leaderboard/elo", {
    searchParams: { limit: 50, offset: 0 }
  });
  return adaptApiGiglings(payload);
}

export async function fetchGiglingById(id: string) {
  const remoteId = toRemotePetId(id);
  const [petResult, statsResult] = await Promise.allSettled([
    requestGigaverseJson("/pets", {
      allowNotFound: true,
      searchParams: { ids: remoteId }
    }),
    requestGigaverseJson(`/pets/${remoteId}/stats`, { allowNotFound: true })
  ]);
  const petPayload = petResult.status === "fulfilled" ? petResult.value : undefined;
  const statsPayload = statsResult.status === "fulfilled" ? statsResult.value : undefined;

  if (petPayload === undefined && statsPayload === undefined) {
    const error = petResult.status === "rejected" ? petResult.reason : statsResult.status === "rejected" ? statsResult.reason : undefined;
    if (error) {
      throw error;
    }
    return undefined;
  }

  const rawPet = extractRecordList(petPayload, ["pets", "giglings", "entries"])[0] ?? petPayload;
  return adaptApiGigling(mergeRecordPayloads(rawPet, pickStatsRecord(statsPayload, remoteId)));
}

export async function fetchRaces() {
  const payload = await requestGigaverseJson("/races", {
    searchParams: { limit: 50 }
  });
  return enrichRacesWithGiglings(adaptApiRaces(payload));
}

export async function fetchRaceById(id: string) {
  const remoteId = toRemoteRaceId(id);
  let apiError: unknown;

  try {
    const payload = await requestGigaverseJson(`/race/${remoteId}`, {
      allowNotFound: true
    });
    const remoteRace = adaptApiRace(payload);

    if (remoteRace) {
      return (await enrichRacesWithGiglings([remoteRace]))[0] ?? remoteRace;
    }
  } catch (error) {
    apiError = error;
  }

  const contractRace = await readRaceContract(id);

  if (contractRace.status === "ok" && contractRace.data) {
    return contractRace.data;
  }

  if (apiError) {
    throw apiError;
  }

  return undefined;
}

export async function fetchGiglingsByIds(ids: string[]) {
  const remoteIds = ids.map(toRemotePetId).filter(Boolean);

  if (remoteIds.length === 0) {
    return [];
  }

  const [petsResult, statsResult] = await Promise.allSettled([
    requestGigaverseJson("/pets", { searchParams: { ids: remoteIds.join(",") } }),
    requestGigaverseJson("/pets/stats", { searchParams: { ids: remoteIds.join(",") } })
  ]);

  if (petsResult.status === "rejected") {
    throw petsResult.reason;
  }

  const statsPayload = statsResult.status === "fulfilled" ? statsResult.value : undefined;
  const rawPets = extractRecordList(petsResult.value, ["pets", "giglings", "entries"]);

  return rawPets.flatMap((rawPet) => {
    const petId = String(rawPet.id ?? rawPet.petId ?? "");
    const adapted = adaptApiGigling(
      mergeRecordPayloads(rawPet, pickStatsRecord(statsPayload, petId))
    );
    return adapted ? [adapted] : [];
  });
}

export async function fetchRaceState(id: string) {
  return requestGigaverseJson("/race-state", {
    searchParams: { raceId: toRemoteRaceId(id) }
  });
}

export async function fetchPlayers() {
  const payload = await requestGigaverseJson("/leaderboard/elo", {
    searchParams: { limit: 50, offset: 0 }
  });
  return adaptApiPlayers(payload);
}

export const fetchLeaderboardPlayers = fetchPlayers;

export async function fetchStable(ownerAddress: string) {
  const normalizedOwner = normalizeAddress(ownerAddress);
  const [petsResult, historyResult, racesResult] = await Promise.allSettled([
    requestGigaverseJson("/pets", { searchParams: { owner: normalizedOwner } }),
    requestGigaverseJson(`/races/${normalizedOwner}`, { searchParams: { limit: 50 } }),
    fetchRaces()
  ]);

  if (petsResult.status === "rejected" && historyResult.status === "rejected") {
    throw petsResult.reason;
  }

  const petsPayload = petsResult.status === "fulfilled" ? petsResult.value : undefined;
  const adaptedStable = adaptApiStable(petsPayload);
  const directGiglings = adaptApiGiglings(petsPayload);
  const playerRaces =
    historyResult.status === "fulfilled" ? adaptApiRaces(historyResult.value) : [];
  const indexedRaces = racesResult.status === "fulfilled" ? racesResult.value : playerRaces;

  if (adaptedStable?.giglings.length) {
    return buildStableFromGiglings(normalizedOwner, adaptedStable.giglings, indexedRaces);
  }

  if (directGiglings.length > 0) {
    return buildStableFromGiglings(normalizedOwner, directGiglings, indexedRaces);
  }

  const ownedGiglingIds = extractOwnedGiglingIds(normalizedOwner, playerRaces);
  const ownedGiglings =
    ownedGiglingIds.length > 0 ? await fetchGiglingsByIds(ownedGiglingIds) : [];

  return buildStableFromGiglings(normalizedOwner, ownedGiglings, indexedRaces);
}

export async function fetchPlayerRaceHistory(ownerAddress: string) {
  const payload = await requestGigaverseJson(`/races/${normalizeAddress(ownerAddress)}`, {
    searchParams: { limit: 50 }
  });
  return enrichRacesWithGiglings(adaptApiRaces(payload));
}

export async function fetchPayouts(ownerAddress: string) {
  return requestGigaverseJson(`/payouts/${normalizeAddress(ownerAddress)}`);
}

export async function fetchHostEligibility(ownerAddress: string) {
  return requestGigaverseJson(`/host-eligibility/${normalizeAddress(ownerAddress)}`);
}

export async function fetchMetaData() {
  const [statsResult, racesResult] = await Promise.allSettled([
    requestGigaverseJson("/stats"),
    fetchRaces()
  ]);

  if (statsResult.status === "rejected" && racesResult.status === "rejected") {
    throw racesResult.reason;
  }

  const races = racesResult.status === "fulfilled" ? racesResult.value : [];
  const insights = [
    statsResult.status === "fulfilled" ? buildGlobalStatsInsight(statsResult.value) : undefined,
    buildFactionInsight(races)
  ].filter((insight): insight is MetaInsight => Boolean(insight));

  return {
    insights,
    factionPerformance: getFactionPerformanceFromRaces(races).filter(
      (entry) => entry.races > 0
    )
  };
}

export async function fetchRivalries(ownerAddress: string) {
  return buildRivalries(ownerAddress, await fetchPlayerRaceHistory(ownerAddress));
}

export async function fetchActiveRaces() {
  const races = await fetchRaces();
  return races.filter((race) => race.status === "live" || race.status === "scheduled");
}
