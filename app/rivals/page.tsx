import { RivalryIntelligence } from "@/components/rivals/rivalry-intelligence";
import { PageHeader } from "@/components/shared/page-header";
import { mockRaces, mockRivalryRecords } from "@/lib/gigaverse/mock-data";

export default function RivalsPage() {
  return (
    <div>
      <PageHeader
        description="Track repeat opponents, allies, nemeses, encounter counts, and race notes for social Gigling Racing intelligence."
        eyebrow="Rivalry Intelligence"
        title="Rivals"
      />
      <RivalryIntelligence races={mockRaces} records={mockRivalryRecords} />
    </div>
  );
}
