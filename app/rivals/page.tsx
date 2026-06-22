import { RivalryIntelligence } from "@/components/rivals/rivalry-intelligence";
import { PageHeader } from "@/components/shared/page-header";
import {
  fetchPlayerRaceHistory,
  fetchRivalries
} from "@/lib/gigaverse/api-client";
import { GIGAVERSE_OWNER_ADDRESS } from "@/lib/gigaverse/mock-data";

export default async function RivalsPage() {
  const [races, records] = await Promise.all([
    fetchPlayerRaceHistory(GIGAVERSE_OWNER_ADDRESS),
    fetchRivalries(GIGAVERSE_OWNER_ADDRESS)
  ]);

  return (
    <div>
      <PageHeader
        description="Track repeat opponents, allies, nemeses, encounter counts, and race notes for social Gigling Racing intelligence."
        eyebrow="Rivalry Intelligence"
        title="Rivals"
      />
      <RivalryIntelligence races={races} records={records} />
    </div>
  );
}
