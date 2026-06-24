import type { RaceDistance, TrackCondition } from "./race";

export type PredictionInput = {
  raceId?: string;
  distance: RaceDistance;
  trackCondition: TrackCondition;
  participantGiglingIds: string[];
};

export type PredictionParticipantResult = {
  giglingId: string;
  giglingName: string;
  estimatedWinProbability: number;
  estimatedPodiumProbability: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  reasons: string[];
};

export type PredictionResult = {
  input: PredictionInput;
  participants: PredictionParticipantResult[];
  topPickGiglingId: string;
  confidence: number;
  fieldVolatility: number;
  topPickEdge: number;
  recommendation: string;
  summary: string;
  warnings: string[];
};
