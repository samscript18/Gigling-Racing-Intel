import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { ShareCard } from "@/components/shared/share-card";
import {
  leaderboardGiglings,
  mockMetaInsights,
  recentCompletedRaces
} from "@/lib/gigaverse/mock-data";
import { formatPercent } from "@/lib/utils/format";

export default function ReportsPage() {
  const topGigling = leaderboardGiglings[0];
  const recentRace = recentCompletedRaces[0];
  const metaAlert = mockMetaInsights[0];

  return (
    <div>
      <PageHeader
        description="Shareable Gigling, race, and meta cards are styled now with copy/share/download placeholders. Task 12 will make these report flows richer."
        eyebrow="Shareable Intel"
        title="Reports"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail="Gigling, race, meta" icon="fileStack" label="Report Types" value="3" />
        <MetricCard detail="Social-ready copy" icon="share" label="Share Actions" tone="violet" value="Ready" />
        <MetricCard detail={topGigling.name} icon="trophy" label="Feature Gigling" tone="orange" value={formatPercent(topGigling.winRate)} />
        <MetricCard detail={metaAlert.title} icon="sparkles" label="Meta Alert" tone="emerald" value={metaAlert.metricValue} />
      </div>

      <section className="mt-6">
        <SectionHeader description="Cards are designed to feel collectible and social-ready for community sharing." title="Report Cards" />
        <div className="grid gap-5 lg:grid-cols-3">
          <ShareCard
            body={`${topGigling.name} is carrying a ${formatPercent(topGigling.winRate)} win rate with ${formatPercent(topGigling.podiumRate)} podium conversion. Best fit: ${topGigling.bestDistance} / ${topGigling.bestWeather}.`}
            eyebrow="Gigling Report"
            metric={`${topGigling.currentStreak} streak`}
            title={topGigling.name}
          />
          <ShareCard
            body={`Race #${recentRace.raceNumber} resolved under ${recentRace.weather} ${recentRace.trackCondition} conditions with ${recentRace.participants.length} entrants and a ${recentRace.prizePool} GIGA prize pool.`}
            eyebrow="Race Report"
            metric={recentRace.winnerGiglingId ?? "Pending"}
            title={`Race #${recentRace.raceNumber}`}
          />
          <ShareCard
            body={metaAlert.description}
            eyebrow="Meta Alert"
            metric={metaAlert.metricValue}
            title={metaAlert.title}
          />
        </div>
      </section>

      <section className="mt-6 premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader description="Plain social copy block for demo and future sharing integrations." title="Social Copy" />
          <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/64">
            Gigling Racing Intel says: {topGigling.name} is the current watchlist pick with {formatPercent(topGigling.winRate)} win rate. Best race fit is {topGigling.bestDistance} in {topGigling.bestWeather} weather. Not financial advice, just racing intel.
          </div>
        </div>
      </section>
    </div>
  );
}
