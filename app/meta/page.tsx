import { InsightCard } from "@/components/shared/insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { getTopEmergingGiglings, getTopFaction } from "@/lib/gigaverse/analytics";
import {
  mockFactionPerformance,
  mockGiglings,
  mockMetaInsights,
  mockRaces
} from "@/lib/gigaverse/mock-data";
import { formatPercent } from "@/lib/utils/format";

export default function MetaPage() {
  const topFaction = getTopFaction(mockFactionPerformance);
  const emerging = getTopEmergingGiglings(mockGiglings);
  const completedRaces = mockRaces.filter((race) => race.status === "completed");

  return (
    <div>
      <PageHeader
        description="Current faction, weather, distance, and track condition reads from centralized mock race results. Task 07 upgrades this into full Recharts analytics."
        eyebrow="Meta Intelligence"
        title="Meta"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail={`${topFaction.faction} leading`} icon="barChart" label="Top Faction" value={formatPercent(topFaction.winRate)} />
        <MetricCard detail="Completed races analyzed" icon="activity" label="Samples" tone="emerald" value={`${completedRaces.length}`} />
        <MetricCard detail="Active meta cards" icon="lineChart" label="Insights" tone="violet" value={`${mockMetaInsights.length}`} />
        <MetricCard detail={emerging[0]?.name ?? "Pending"} icon="zap" label="Emerging Pick" tone="orange" value={formatPercent(emerging[0]?.podiumRate ?? 0)} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Foundation faction chart using mock placements." title="Faction Win Rate" />
            <div className="space-y-4">
              {mockFactionPerformance.map((entry) => (
                <div key={entry.faction}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-bold capitalize text-white">{entry.faction}</span>
                    <span className="text-white/54">{formatPercent(entry.winRate)}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-racing via-cyan-racing to-violet-racing" style={{ width: `${Math.max(8, entry.winRate * 2.5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionHeader description="Meta shift cards already use the same centralized insight type." title="Meta Shift Cards" />
          <div className="grid gap-4 md:grid-cols-2">
            {mockMetaInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader description="Giglings gaining podium equity or streak momentum." title="Top Emerging Giglings" />
          <div className="grid gap-3 md:grid-cols-5">
            {emerging.map((gigling) => (
              <div key={gigling.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                <p className="text-sm font-bold text-white">{gigling.name}</p>
                <p className="mt-1 text-xs capitalize text-cyan-racing">{gigling.faction}</p>
                <p className="mt-3 text-sm text-white/56">Podium {formatPercent(gigling.podiumRate)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
