import type { Gigling, Player, Race } from "@/types";

export function normalizeAddress(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeDate(value: string | number | Date | undefined) {
  if (!value) {
    return undefined;
  }

  return new Date(value).toISOString();
}

export function normalizeNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function adaptApiGigling(input: Gigling): Gigling {
  return {
    ...input,
    ownerAddress: normalizeAddress(input.ownerAddress),
    lastRaceAt: normalizeDate(input.lastRaceAt)
  };
}

export function adaptApiRace(input: Race): Race {
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

export function adaptApiPlayer(input: Player): Player {
  return {
    ...input,
    walletAddress: normalizeAddress(input.walletAddress)
  };
}

export function adaptContractRace(input: Race): Race {
  return adaptApiRace(input);
}
