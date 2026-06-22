import { notFound } from "next/navigation";
import Link from "next/link";

import { GiglingDetailCharts } from "@/components/giglings/gigling-detail-charts";
import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { GiglingCard } from "@/components/shared/gigling-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  getGiglingIntelligenceSummary,
  getGiglingPerformanceByDistance,
  getGiglingPerformanceByWeather,
  getGiglingRaceHistory,
  getGiglingRiskWarnings,
  getGiglingStatRadarData,
  getRecommendedRaceConditions
} from "@/lib/gigaverse/analytics";
import {
  fetchGiglingById,
  fetchGiglings,
  fetchRaces
} from "@/lib/gigaverse/api-client";
import {
  formatDateTime,
  formatPercent,
  formatToken,
  shortenAddress
} from "@/lib/utils/format";

type GiglingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GiglingDetailPage({ params }: GiglingDetailPageProps) {
  const { id } = await params;
  const [gigling, races, giglings] = await Promise.all([
    fetchGiglingById(id),
    fetchRaces(),
    fetchGiglings()
  ]);

  if (!gigling) {
    notFound();
  }

  const raceHistory = getGiglingRaceHistory(gigling.id, races);
  const completedHistory = raceHistory.filter(
    ({ participant }) => typeof participant.finalPosition === "number"
  );
  const statData = getGiglingStatRadarData(gigling);
  const weatherData = getGiglingPerformanceByWeather(gigling.id, races);
  const distanceData = getGiglingPerformanceByDistance(gigling.id, races);
  const intelligence = getGiglingIntelligenceSummary(gigling, races);
  const recommendations = getRecommendedRaceConditions(gigling);
  const warnings = getGiglingRiskWarnings(gigling);
  const columns: DataTableColumn<(typeof raceHistory)[number]>[] = [
    {
      header: "Race",
      cell: ({ race }) => (
        <Link className="font-bold text-cyan-racing transition hover:text-white" href={`/races/${race.id}`}>
          #{race.raceNumber}
        </Link>
      )
    },
    {
      header: "Status",
      cell: ({ race }) => <StatusBadge status={race.status} />
    },
    {
      header: "Conditions",
      cell: ({ race }) => `${race.distance} / ${race.weather} / ${race.trackCondition}`
    },
    {
      header: "Placement",
      cell: ({ participant }) => participant.finalPosition ? `P${participant.finalPosition}` : "Pending"
    },
    {
      header: "Score",
      cell: ({ participant }) => participant.performanceScore ?? "Pending"
    },
    {
      header: "Date",
      cell: ({ race }) => formatDateTime(race.startedAt)
    }
  ];
  const similarGiglings = giglings
    .filter((entry) => entry.id !== gigling.id && entry.faction === gigling.faction)
    .sort((first, second) => second.winRate - first.winRate)
    .slice(0, 3);
  const averagePlacement =
    completedHistory.reduce(
      (total, { participant }) => total + (participant.finalPosition ?? 0),
      0
    ) / Math.max(completedHistory.length, 1);

  return (
    <div>
      <PageHeader
        description={`Token ${gigling.tokenId} owned by ${gigling.ownerName ?? shortenAddress(gigling.ownerAddress)}. This foundation detail view already links career data to race history.`}
        eyebrow="Gigling Detail"
        title={gigling.name}
      />

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-72 overflow-hidden rounded-lg border border-white/10 bg-track-radial">
            <div className="absolute inset-0 bg-racing-grid opacity-55" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-racing/25 bg-cyan-racing/10 shadow-glow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-7xl font-black text-white/90">
                {gigling.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              <FactionBadge faction={gigling.faction} />
              <RarityBadge rarity={gigling.rarity} />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <FactionBadge faction={gigling.faction} />
              <RarityBadge rarity={gigling.rarity} />
            </div>
            <h2 className="mt-5 text-4xl font-black text-white">{gigling.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/58">
              {intelligence.headline}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Owner</p>
                <p className="mt-2 font-black text-white">{gigling.ownerName}</p>
                <p className="mt-1 text-sm text-white/46">{shortenAddress(gigling.ownerAddress)}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Token</p>
                <p className="mt-2 font-black text-white">{gigling.tokenId}</p>
                <p className="mt-1 text-sm capitalize text-white/46">Level {gigling.level}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Best Distance</p>
                <p className="mt-2 font-black capitalize text-cyan-racing">{gigling.bestDistance}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-white/38">Best Weather</p>
                <p className="mt-2 font-black capitalize text-orange-racing">{gigling.bestWeather}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard icon="flag" label="Total Races" value={`${gigling.totalRaces}`} />
        <MetricCard icon="trophy" label="Win Rate" tone="orange" value={formatPercent(gigling.winRate)} />
        <MetricCard icon="medal" label="Podium Rate" tone="emerald" value={formatPercent(gigling.podiumRate)} />
        <MetricCard icon="coins" label="Earnings" tone="violet" value={formatToken(gigling.earnings)} />
        <MetricCard
          detail={`${completedHistory.length} indexed races`}
          icon="barChart"
          label="Avg Placement"
          value={`P${averagePlacement.toFixed(2)}`}
        />
      </div>

      <div className="mt-6">
        <GiglingDetailCharts
          distanceData={distanceData}
          statData={statData}
          weatherData={weatherData}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Completed, live, and scheduled races involving this Gigling."
              title="Race History"
            />
            <DataTable
              columns={columns}
              data={raceHistory}
              getRowKey={({ race }) => race.id}
            />
          </div>
        </section>

        <div className="space-y-5">
          <section className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader
                description="What the current indexed data says about entry decisions."
                title="Intelligence Summary"
              />
              <div className="space-y-3">
                {intelligence.bullets.map((bullet) => (
                  <p key={bullet} className="rounded-lg border border-cyan-racing/18 bg-cyan-racing/8 p-3 text-sm leading-6 text-white/64">
                    {bullet}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader
                description="Entry patterns that should favor this Gigling."
                title="Recommended Race Conditions"
              />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.label} className="rounded-lg border border-emerald-racing/18 bg-emerald-racing/8 p-3">
                    <p className="text-sm font-black text-white">{recommendation.label}</p>
                    <p className="mt-2 text-sm leading-6 text-white/54">
                      {recommendation.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Risk notes are intentionally cautious and never claim guaranteed outcomes."
              title="Risk Warnings"
            />
            <div className="space-y-3">
              {warnings.map((warning) => (
                <p key={warning} className="rounded-lg border border-orange-racing/22 bg-orange-racing/8 p-3 text-sm leading-6 text-white/64">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Same-faction comparison targets for scouting nearby profiles."
              title="Comparable Giglings"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {similarGiglings.map((entry) => (
                <GiglingCard key={entry.id} compact gigling={entry} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
