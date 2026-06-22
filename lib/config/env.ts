import type { Address } from "viem";
import { isAddress } from "viem";

const DEFAULT_APP_NAME = "Gigling Racing Intel";
const DEFAULT_CHAIN_ID = 2741;

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

function readPublicNumber(value: string | undefined, fallback: number) {
  const parsed = Number(cleanEnvValue(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readPublicUrl(value: string | undefined) {
  const cleaned = cleanEnvValue(value);

  if (!cleaned) {
    return undefined;
  }

  try {
    return new URL(cleaned).toString().replace(/\/$/, "");
  } catch {
    return undefined;
  }
}

function readPublicAddress(value: string | undefined) {
  const cleaned = cleanEnvValue(value);
  return cleaned && isAddress(cleaned) ? (cleaned as Address) : undefined;
}

export const appEnv = {
  appName: cleanEnvValue(process.env.NEXT_PUBLIC_APP_NAME) ?? DEFAULT_APP_NAME,
  gigaverseApiBaseUrl: readPublicUrl(process.env.NEXT_PUBLIC_GIGAVERSE_API_BASE_URL),
  abstractRpcUrl: readPublicUrl(process.env.NEXT_PUBLIC_ABSTRACT_RPC_URL),
  petRacingSystemAddress: readPublicAddress(
    process.env.NEXT_PUBLIC_PET_RACING_SYSTEM_ADDRESS
  ),
  chainId: readPublicNumber(process.env.NEXT_PUBLIC_CHAIN_ID, DEFAULT_CHAIN_ID)
} as const;

export function hasGigaverseApiConfig() {
  return Boolean(appEnv.gigaverseApiBaseUrl);
}

export function hasGigaverseContractConfig() {
  return Boolean(appEnv.abstractRpcUrl && appEnv.petRacingSystemAddress);
}
