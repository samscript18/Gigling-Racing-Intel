import { appEnv, hasGigaverseApiConfig } from "@/lib/config/env";
import type { Gigling, Race, StableSummary } from "@/types";

import {
  adaptApiGigling,
  adaptApiGiglings,
  adaptApiPlayer,
  adaptApiPlayers,
  adaptApiRace,
  adaptApiRaces,
  adaptApiStable,
  isRecord,
  normalizeAddress
} from "./adapters";
import {
  activeRaces,
  leaderboardPlayers,
  mockFactionPerformance,
  mockGiglings,
  mockMetaInsights,
  mockPlayers,
  mockRaces,
  mockRivalryRecords,
  mockStableSummaries
} from "./mock-data";

const REQUEST_TIMEOUT_MS = 8_000;

type RequestOptions = {
  authToken?: string;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

function mockGiglingList() {
  return mockGiglings.map((gigling) => adaptApiGigling(gigling));
}

function mockRaceList() {
  return mockRaces.map((race) => adaptApiRace(race));
}

function toRemotePetId(id: string) {
  return id.replace(/^gigling-/, "").replace(/^#/, "");
}

function toRemoteRaceId(id: string) {
  return id.replace(/^race-/, "");
}

function buildGigaverseUrl(path: string, searchParams?: RequestOptions["searchParams"]) {
  if (!appEnv.gigaverseApiBaseUrl) {
    return undefined;
  }

  const url = new URL(
    `${appEnv.gigaverseApiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`
  );

  Object.entries(searchParams ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url;
}

async function requestGigaverseJson(path: string, options: RequestOptions = {}) {
  if (!hasGigaverseApiConfig()) {
    return undefined;
  }

  const url = buildGigaverseUrl(path, options.searchParams);

  if (!url) {
    return undefined;
  }

  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(options.authToken ? { Authorization: `Bearer ${options.authToken}` } : {})
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return undefined;
    }

    return (await response.json()) as unknown;
  } catch {
    return undefined;
  } finally {
    globalThis.clearTimeout(timeout);
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

function buildStableFromGiglings(
  ownerAddress: string,
  giglings: Gigling[],
  races: Race[]
): StableSummary {
  const ownerGiglings = giglings.filter(
    (gigling) => normalizeAddress(gigling.ownerAddress) === normalizeAddress(ownerAddress)
  );
  const totalRaces = ownerGiglings.reduce((total, gigling) => total + gigling.totalRaces, 0);
  const totalWins = ownerGiglings.reduce((total, gigling) => total + gigling.wins, 0);
  const bestGigling = [...ownerGiglings].sort(
    (first, second) => second.winRate - first.winRate
  )[0];

  return {
    ownerAddress: normalizeAddress(ownerAddress),
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

export async function fetchGiglings() {
  const payload = await requestGigaverseJson("/leaderboard/elo", {
    searchParams: { limit: 50, offset: 0 }
  });
  const remoteGiglings = adaptApiGiglings(payload);

  return remoteGiglings.length > 0 ? remoteGiglings : mockGiglingList();
}

export async function fetchGiglingById(id: string) {
  const remoteId = toRemotePetId(id);
  const [petPayload, statsPayload] = await Promise.all([
    requestGigaverseJson("/pets", { searchParams: { ids: remoteId } }),
    requestGigaverseJson(`/pets/${remoteId}/stats`)
  ]);
  const remotePet =
    adaptApiGiglings(petPayload)[0] ??
    adaptApiGigling(mergeRecordPayloads(petPayload, statsPayload));

  if (remotePet) {
    const merged = adaptApiGigling(mergeRecordPayloads(remotePet, statsPayload));
    return merged ?? remotePet;
  }

  const gigling = mockGiglings.find((entry) => entry.id === id);
  return gigling ? adaptApiGigling(gigling) : undefined;
}

export async function fetchRaces() {
  const payload = await requestGigaverseJson("/races", {
    searchParams: { limit: 50 }
  });
  const remoteRaces = adaptApiRaces(payload);

  return remoteRaces.length > 0 ? remoteRaces : mockRaceList();
}

export async function fetchRaceById(id: string) {
  const remoteId = toRemoteRaceId(id);
  const payload = await requestGigaverseJson(`/race/${remoteId}`);
  const remoteRace = adaptApiRace(payload);

  if (remoteRace) {
    return remoteRace;
  }

  const race = mockRaces.find((entry) => entry.id === id);
  return race ? adaptApiRace(race) : undefined;
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
  const remotePlayers = adaptApiPlayers(payload);

  return remotePlayers.length > 0
    ? remotePlayers
    : mockPlayers.map((player) => adaptApiPlayer(player));
}

export async function fetchLeaderboardPlayers() {
  const payload = await requestGigaverseJson("/leaderboard/elo", {
    searchParams: { limit: 50, offset: 0 }
  });
  const remotePlayers = adaptApiPlayers(payload);

  return remotePlayers.length > 0
    ? remotePlayers
    : leaderboardPlayers.map((player) => adaptApiPlayer(player));
}

export async function fetchStable(ownerAddress: string) {
  const normalizedOwner = normalizeAddress(ownerAddress);
  const remoteStablePayload = await requestGigaverseJson("/pets", {
    searchParams: { owner: normalizedOwner }
  });
  const adaptedStable = adaptApiStable(remoteStablePayload);

  if (adaptedStable && adaptedStable.giglings.length > 0) {
    return adaptedStable;
  }

  const remoteGiglings = adaptApiGiglings(remoteStablePayload);

  if (remoteGiglings.length > 0) {
    const races = await fetchRaces();
    return buildStableFromGiglings(normalizedOwner, remoteGiglings, races);
  }

  return mockStableSummaries.find(
    (summary) => normalizeAddress(summary.ownerAddress) === normalizedOwner
  );
}

export async function fetchPlayerRaceHistory(ownerAddress: string) {
  const payload = await requestGigaverseJson(`/races/${normalizeAddress(ownerAddress)}`, {
    searchParams: { limit: 50 }
  });
  const remoteRaces = adaptApiRaces(payload);

  return remoteRaces.length > 0 ? remoteRaces : mockRaceList();
}

export async function fetchPayouts(ownerAddress: string) {
  return requestGigaverseJson(`/payouts/${normalizeAddress(ownerAddress)}`);
}

export async function fetchHostEligibility(ownerAddress: string) {
  return requestGigaverseJson(`/host-eligibility/${normalizeAddress(ownerAddress)}`);
}

export async function fetchMetaData() {
  return {
    insights: mockMetaInsights,
    factionPerformance: mockFactionPerformance
  };
}

export async function fetchRivalries(ownerAddress: string) {
  const normalizedOwner = normalizeAddress(ownerAddress);
  return mockRivalryRecords.filter(
    (record) => normalizeAddress(record.playerAddress) === normalizedOwner
  );
}

export async function fetchActiveRaces() {
  const races = await fetchRaces();
  const remoteActiveRaces = races.filter(
    (race) => race.status === "live" || race.status === "scheduled"
  );

  return remoteActiveRaces.length > 0 ? remoteActiveRaces : activeRaces.map(adaptApiRace);
}
