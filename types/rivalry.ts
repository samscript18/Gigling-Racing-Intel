export type RivalryRecord = {
  id: string;
  playerAddress: string;
  rivalAddress: string;
  rivalName?: string;
  totalEncounters: number;
  winsAgainstRival: number;
  lossesAgainstRival: number;
  winRateAgainstRival: number;
  mostRecentRaceId: string;
  relationshipType: "rival" | "ally" | "nemesis" | "unknown";
  notes: string[];
};
