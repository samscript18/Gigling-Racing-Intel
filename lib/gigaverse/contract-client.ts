import { createPublicClient, defineChain, formatEther, http, type Address } from "viem";

import { appEnv, hasGigaverseContractConfig } from "@/lib/config/env";
import { adaptContractRace, normalizeAddress, normalizeNumber } from "@/lib/gigaverse/adapters";

const ABSTRACT_MAINNET_CHAIN_ID = 2741;
const ABSTRACT_MAINNET_RPC_URL = "https://api.mainnet.abs.xyz";

const PET_RACING_VIEW_ABI = [
  {
    type: "function",
    name: "getRace",
    stateMutability: "view",
    inputs: [{ name: "raceId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "phase", type: "uint8" },
          { name: "raceStart", type: "uint256" },
          { name: "raceFinish", type: "uint256" },
          { name: "entryFee", type: "uint256" },
          { name: "pool", type: "uint256" },
          { name: "fieldSize", type: "uint256" },
          { name: "petCount", type: "uint256" },
          { name: "trackLength", type: "uint256" },
          { name: "creator", type: "address" },
          { name: "isPrivate", type: "bool" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "getRacePets",
    stateMutability: "view",
    inputs: [{ name: "raceId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getRaceFinalRanking",
    stateMutability: "view",
    inputs: [{ name: "raceId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getRaceFinishTimes",
    stateMutability: "view",
    inputs: [{ name: "raceId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256[]" }]
  },
  {
    type: "function",
    name: "getPetOwnerInRace",
    stateMutability: "view",
    inputs: [
      { name: "raceId", type: "uint256" },
      { name: "petId", type: "uint256" }
    ],
    outputs: [{ name: "", type: "address" }]
  },
  {
    type: "function",
    name: "getPetPayout",
    stateMutability: "view",
    inputs: [
      { name: "raceId", type: "uint256" },
      { name: "petId", type: "uint256" }
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "amount", type: "uint256" },
          { name: "claimed", type: "bool" },
          { name: "raceAmount", type: "uint256" },
          { name: "jackpotAmount", type: "uint256" }
        ]
      }
    ]
  },
  {
    type: "function",
    name: "canPetRace",
    stateMutability: "view",
    inputs: [
      { name: "petId", type: "uint256" },
      { name: "owner", type: "address" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

type ContractReadStatus = "ok" | "not-configured" | "invalid-input" | "error";

type ContractReadResult<T> = {
  status: ContractReadStatus;
  data?: T;
  message?: string;
};

type RaceStructRecord = {
  phase?: unknown;
  raceStart?: unknown;
  raceFinish?: unknown;
  entryFee?: unknown;
  pool?: unknown;
  fieldSize?: unknown;
  petCount?: unknown;
  trackLength?: unknown;
  creator?: unknown;
  isPrivate?: unknown;
};

export const gigaverseChain = defineChain({
  id: appEnv.chainId,
  name: appEnv.chainId === 2741 ? "Abstract Mainnet" : "Gigaverse Target Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: [appEnv.abstractRpcUrl ?? ABSTRACT_MAINNET_RPC_URL]
    }
  }
});

function notConfigured<T>(): ContractReadResult<T> {
  return {
    status: "not-configured",
    message:
      "Set NEXT_PUBLIC_ABSTRACT_RPC_URL for a custom network, or use the default Abstract mainnet configuration."
  };
}

function invalidInput<T>(message: string): ContractReadResult<T> {
  return {
    status: "invalid-input",
    message
  };
}

function readError<T>(error: unknown): ContractReadResult<T> {
  return {
    status: "error",
    message: error instanceof Error ? error.message : "Contract read failed."
  };
}

function normalizeContractId(value: string | number | bigint, label: string) {
  const raw = String(value).replace(/^race-/, "").replace(/^gigling-/, "").replace(/^#/, "");

  try {
    return BigInt(raw);
  } catch {
    throw new Error(`Invalid ${label}: ${String(value)}`);
  }
}

function weiToTokenNumber(value: unknown) {
  try {
    return Number(formatEther(BigInt(String(value))));
  } catch {
    return normalizeNumber(value, 0);
  }
}

function raceStructToRecord(value: unknown): RaceStructRecord {
  if (Array.isArray(value)) {
    const [
      phase,
      raceStart,
      raceFinish,
      entryFee,
      pool,
      fieldSize,
      petCount,
      trackLength,
      creator,
      isPrivate
    ] = value;

    return {
      phase,
      raceStart,
      raceFinish,
      entryFee,
      pool,
      fieldSize,
      petCount,
      trackLength,
      creator,
      isPrivate
    };
  }

  return typeof value === "object" && value !== null ? (value as RaceStructRecord) : {};
}

export function createGigaversePublicClient() {
  if (appEnv.chainId !== ABSTRACT_MAINNET_CHAIN_ID && !appEnv.abstractRpcUrl) {
    return undefined;
  }

  return createPublicClient({
    chain: gigaverseChain,
    transport: http(appEnv.abstractRpcUrl)
  });
}

function getContractConfig() {
  if (!hasGigaverseContractConfig() || !appEnv.petRacingSystemAddress) {
    return undefined;
  }

  const client = createGigaversePublicClient();

  if (!client) {
    return undefined;
  }

  return {
    address: appEnv.petRacingSystemAddress,
    client
  };
}

export async function readRaceContract(raceId: string | number | bigint) {
  const config = getContractConfig();

  if (!config) {
    return notConfigured<ReturnType<typeof adaptContractRace>>();
  }

  let normalizedRaceId: bigint;

  try {
    normalizedRaceId = normalizeContractId(raceId, "race id");
  } catch (error) {
    return invalidInput<ReturnType<typeof adaptContractRace>>(
      error instanceof Error ? error.message : "Invalid race id."
    );
  }

  try {
    const [raceStruct, pets, finalRanking] = await Promise.all([
      config.client.readContract({
        address: config.address,
        abi: PET_RACING_VIEW_ABI,
        functionName: "getRace",
        args: [normalizedRaceId]
      }),
      config.client.readContract({
        address: config.address,
        abi: PET_RACING_VIEW_ABI,
        functionName: "getRacePets",
        args: [normalizedRaceId]
      }),
      config.client.readContract({
        address: config.address,
        abi: PET_RACING_VIEW_ABI,
        functionName: "getRaceFinalRanking",
        args: [normalizedRaceId]
      })
    ]);
    const raceRecord = raceStructToRecord(raceStruct);
    const participants = pets.map((petId, index) => ({
      petId,
      startingLane: index + 1,
      finalPosition: finalRanking.findIndex((rankedPetId) => rankedPetId === petId) + 1 || undefined
    }));

    return {
      status: "ok",
      data: adaptContractRace({
        raceId: normalizedRaceId,
        phase: raceRecord.phase,
        raceStart: raceRecord.raceStart,
        raceFinish: raceRecord.raceFinish,
        entryFee: weiToTokenNumber(raceRecord.entryFee),
        pool: weiToTokenNumber(raceRecord.pool),
        trackLength: raceRecord.trackLength,
        participants,
        finalRanking
      })
    } satisfies ContractReadResult<ReturnType<typeof adaptContractRace>>;
  } catch (error) {
    return readError<ReturnType<typeof adaptContractRace>>(error);
  }
}

export async function readGiglingOwnership(
  raceId: string | number | bigint,
  giglingId: string | number | bigint
) {
  const config = getContractConfig();

  if (!config) {
    return notConfigured<string>();
  }

  try {
    const owner = await config.client.readContract({
      address: config.address,
      abi: PET_RACING_VIEW_ABI,
      functionName: "getPetOwnerInRace",
      args: [
        normalizeContractId(raceId, "race id"),
        normalizeContractId(giglingId, "Gigling id")
      ]
    });

    return {
      status: "ok",
      data: normalizeAddress(owner)
    } satisfies ContractReadResult<string>;
  } catch (error) {
    return readError<string>(error);
  }
}

export async function readRaceResults(raceId: string | number | bigint) {
  const config = getContractConfig();

  if (!config) {
    return notConfigured<{
      finalRanking: string[];
      finishTimesMs: number[];
    }>();
  }

  try {
    const normalizedRaceId = normalizeContractId(raceId, "race id");
    const [finalRanking, finishTimes] = await Promise.all([
      config.client.readContract({
        address: config.address,
        abi: PET_RACING_VIEW_ABI,
        functionName: "getRaceFinalRanking",
        args: [normalizedRaceId]
      }),
      config.client.readContract({
        address: config.address,
        abi: PET_RACING_VIEW_ABI,
        functionName: "getRaceFinishTimes",
        args: [normalizedRaceId]
      })
    ]);

    return {
      status: "ok",
      data: {
        finalRanking: finalRanking.map((petId) => `gigling-${String(petId)}`),
        finishTimesMs: finishTimes.map((time) => normalizeNumber(time))
      }
    } satisfies ContractReadResult<{
      finalRanking: string[];
      finishTimesMs: number[];
    }>;
  } catch (error) {
    return readError<{
      finalRanking: string[];
      finishTimesMs: number[];
    }>(error);
  }
}

export async function readGiglingRaceEligibility(
  giglingId: string | number | bigint,
  ownerAddress: Address
) {
  const config = getContractConfig();

  if (!config) {
    return notConfigured<boolean>();
  }

  try {
    const canRace = await config.client.readContract({
      address: config.address,
      abi: PET_RACING_VIEW_ABI,
      functionName: "canPetRace",
      args: [normalizeContractId(giglingId, "Gigling id"), ownerAddress]
    });

    return {
      status: "ok",
      data: canRace
    } satisfies ContractReadResult<boolean>;
  } catch (error) {
    return readError<boolean>(error);
  }
}
