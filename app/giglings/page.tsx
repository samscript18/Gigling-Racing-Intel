import { GiglingCard } from "@/components/shared/gigling-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { leaderboardGiglings, mockGiglings } from "@/lib/gigaverse/mock-data";
import { formatPercent, formatToken } from "@/lib/utils/format";

export default function GiglingsPage() {
  const totalEarnings = mockGiglings.reduce((total, gigling) => total + gigling.earnings, 0);
  const averageWinRate =
    mockGiglings.reduce((total, gigling) => total + gigling.winRate, 0) / mockGiglings.length;
  const highestLevel = Math.max(...mockGiglings.map((gigling) => gigling.level));

  return (
    <div>
      <PageHeader
        description="Browse the current mock Gigling field by faction, rarity, owner, stats, and condition fit. Task 03 expands this into a full search/filter/sort explorer."
        eyebrow="Gigling Explorer"
        title="Giglings"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Typed mock roster" icon="bot" label="Giglings Indexed" value={`${mockGiglings.length}`} />
        <MetricCard detail="Across all mock careers" icon="coins" label="Total Earnings" tone="emerald" value={formatToken(totalEarnings)} />
        <MetricCard detail="Field average" icon="trophy" label="Average Win Rate" tone="orange" value={formatPercent(averageWinRate)} />
        <MetricCard detail="Current top training level" icon="gauge" label="Highest Level" tone="violet" value={`${highestLevel}`} />
      </div>

      <section className="mt-6">
        <SectionHeader
          description="Top cards are linked to detail routes now; full search, filtering, and sorting arrive in Task 03."
          title="Top Indexed Giglings"
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {leaderboardGiglings.slice(0, 12).map((gigling) => (
            <GiglingCard key={gigling.id} gigling={gigling} />
          ))}
        </div>
      </section>
    </div>
  );
}
