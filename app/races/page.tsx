import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { activeRaces, mockRaces, recentCompletedRaces } from "@/lib/gigaverse/mock-data";
import { formatToken } from "@/lib/utils/format";

export default function RacesPage() {
  const prizePool = mockRaces.reduce((total, race) => total + race.prizePool, 0);
  const itemCount = mockRaces.flatMap((race) => race.participants.flatMap((participant) => participant.itemsUsed)).length;

  return (
    <div>
      <PageHeader
        description="Live, scheduled, and historical race cards are wired now. Task 05 adds status tabs, search, and richer filters."
        eyebrow="Race Feed"
        title="Races"
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Total mock race feed" icon="flag" label="Races" value={`${mockRaces.length}`} />
        <MetricCard detail="Live or scheduled" icon="timer" label="Active Races" tone="orange" value={`${activeRaces.length}`} />
        <MetricCard detail="Across mock pools" icon="trophy" label="Prize Pools" tone="emerald" value={formatToken(prizePool)} />
        <MetricCard detail="Boost, sabotage, defense, utility" icon="users" label="Items Used" tone="violet" value={`${itemCount}`} />
      </div>

      <section className="mt-6">
        <SectionHeader description="Open a race to inspect placements, participants, item usage, and race explanations." title="Race Intel Feed" />
        <div className="grid gap-4 lg:grid-cols-2">
          {[...activeRaces, ...recentCompletedRaces].slice(0, 12).map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
