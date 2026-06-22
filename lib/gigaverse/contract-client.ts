import { createPublicClient, defineChain, http } from "viem";

const configuredChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "0");

export const gigaverseChain = defineChain({
  id: Number.isFinite(configuredChainId) && configuredChainId > 0 ? configuredChainId : 2741,
  name: "Gigaverse Target Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_ABSTRACT_RPC_URL || "http://localhost:8545"]
    }
  }
});

export function createGigaversePublicClient() {
  const rpcUrl = process.env.NEXT_PUBLIC_ABSTRACT_RPC_URL;

  if (!rpcUrl) {
    return undefined;
  }

  return createPublicClient({
    chain: gigaverseChain,
    transport: http(rpcUrl)
  });
}

export async function readRaceContract() {
  return {
    status: "mock-only",
    message: "Real Gigaverse race ABI is intentionally not wired before official docs."
  };
}

export async function readGiglingOwnership() {
  return {
    status: "mock-only",
    message: "Ownership reads will be added when the official contract surface is available."
  };
}

export async function readRaceResults() {
  return {
    status: "mock-only",
    message: "Race result reads are isolated here for the future contract adapter."
  };
}
