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
import { adaptApiGigling, adaptApiPlayer, adaptApiRace, normalizeAddress } from "./adapters";

export async function fetchGiglings() {
  return mockGiglings.map(adaptApiGigling);
}

export async function fetchGiglingById(id: string) {
  const gigling = mockGiglings.find((entry) => entry.id === id);
  return gigling ? adaptApiGigling(gigling) : undefined;
}

export async function fetchRaces() {
  return mockRaces.map(adaptApiRace);
}

export async function fetchRaceById(id: string) {
  const race = mockRaces.find((entry) => entry.id === id);
  return race ? adaptApiRace(race) : undefined;
}

export async function fetchPlayers() {
  return mockPlayers.map(adaptApiPlayer);
}

export async function fetchLeaderboardPlayers() {
  return leaderboardPlayers.map(adaptApiPlayer);
}

export async function fetchStable(ownerAddress: string) {
  const normalizedOwner = normalizeAddress(ownerAddress);
  return mockStableSummaries.find(
    (summary) => normalizeAddress(summary.ownerAddress) === normalizedOwner
  );
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
  return activeRaces.map(adaptApiRace);
}
