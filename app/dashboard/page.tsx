import Link from "next/link";

import { CommandCenterBrief } from "@/components/dashboard/command-center-brief";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { QuickActionGrid } from "@/components/dashboard/quick-action-grid";
import { GiglingCard } from "@/components/shared/gigling-card";
import { EmptyState } from "@/components/shared/empty-state";
import { InsightCard } from "@/components/shared/insight-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import {
  getDashboardRaceMix,
  getFactionPerformanceFromRaces,
  getFactionDashboardData,
  getHighestWinRateGigling,
  getRaceConditionTrend,
  getTopFaction
} from "@/lib/gigaverse/analytics";
import {
  fetchGiglings,
  fetchMetaData,
  fetchRaces
} from "@/lib/gigaverse/api-client";
import { formatPercent, formatToken } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [races, giglings, metaData] = await Promise.all([
    fetchRaces(),
    fetchGiglings(),
    fetchMetaData()
  ]);

  if (races.length === 0 || giglings.length === 0) {
    return (
      <div>
        <PageHeader
          description="Live command center for race conditions, top Giglings, active lobbies, and meta pressure."
          eyebrow="Race Command"
          title="Dashboard"
        />
        <EmptyState
          description="Gigaverse responded successfully, but the recent race feed or live Gigling leaderboard is empty. Dashboard analytics will appear when both sources contain records."
          title="Live dashboard data is incomplete"
        />
      </div>
    );
  }
  const activeRaces = races.filter(
    (race) => race.status === "live" || race.status === "scheduled"
  );
  const recentCompletedRaces = races
    .filter((race) => race.status === "completed")
    .sort(
      (first, second) =>
        new Date(second.endedAt ?? second.startedAt ?? 0).getTime() -
        new Date(first.endedAt ?? first.startedAt ?? 0).getTime()
    );
  const leaderboardGiglings = [...giglings].sort(
    (first, second) => second.winRate - first.winRate
  );
  const factionPerformance = getFactionPerformanceFromRaces(races);
  const topGigling = getHighestWinRateGigling(giglings);
  const topFaction = getTopFaction(factionPerformance);
  const raceMix = getDashboardRaceMix(races);
  const factionChartData = getFactionDashboardData(factionPerformance);
  const raceTrendData = getRaceConditionTrend(races);
  const averageConditionScore =
    raceTrendData.reduce((total, entry) => total + entry.conditionScore, 0) /
    Math.max(raceTrendData.length, 1);
  const featuredRace = activeRaces[0] ?? races[0];

  return (
    <div>
      <PageHeader
        actions={
          <>
            <Link className="rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 py-2 text-sm font-bold text-cyan-racing transition hover:bg-cyan-racing/16" href="/predictor">
              Open predictor
            </Link>
            <Link className="rounded-lg border border-orange-racing/35 bg-orange-racing/10 px-4 py-2 text-sm font-bold text-orange-racing transition hover:bg-orange-racing/16" href="/meta">
              Watch meta
            </Link>
          </>
        }
        description="A live-feeling command center for race conditions, top Giglings, active lobbies, and meta pressure."
        eyebrow="Race Command"
        title="Dashboard"
      />

      <CommandCenterBrief
        activeRaceCount={activeRaces.length}
        averageConditionScore={averageConditionScore}
        completedRaceCount={raceMix.completedCount}
        featuredRace={
          featuredRace
            ? {
                distance: featuredRace.distance,
                entryFee: featuredRace.entryFee,
                id: featuredRace.id,
                participants: featuredRace.participants.length,
                prizePool: featuredRace.prizePool,
                raceNumber: featuredRace.raceNumber,
                status: featuredRace.status,
                trackCondition: featuredRace.trackCondition,
                weather: featuredRace.weather
              }
            : undefined
        }
        itemPressure={raceMix.itemPressure}
        topFaction={{
          faction: topFaction.faction,
          podiumRate: topFaction.podiumRate,
          winRate: topFaction.winRate
        }}
        topGigling={{
          name: topGigling.name,
          winRate: topGigling.winRate
        }}
        totalPrizePool={raceMix.totalPrizePool}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={`${raceMix.statusCounts.live} live / ${raceMix.statusCounts.scheduled} scheduled`}
          icon="flag"
          label="Races Tracked"
          mechanic="raceStatus"
          value={`${races.length}`}
        />
        <MetricCard
          detail={`${topFaction.faction} faction leads indexed races`}
          icon="barChart"
          label="Top Faction"
          mechanic="faction"
          tone="emerald"
          value={formatPercent(topFaction.winRate)}
        />
        <MetricCard
          detail={topGigling.name}
          icon="trophy"
          label="Highest Win Rate"
          mechanic="winRate"
          tone="orange"
          value={formatPercent(topGigling.winRate)}
        />
        <MetricCard
          detail={`${raceMix.itemPressure} item actions detected`}
          icon="radar"
          label="Prize Flow"
          mechanic="prizePool"
          tone="violet"
          value={formatToken(raceMix.totalPrizePool)}
        />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <SectionHeader
            description="Live and scheduled lobbies that deserve pre-race attention."
            title="Active Race Radar"
          />
          <div className="mobile-card-rail grid gap-4 lg:grid-cols-2">
            {activeRaces.slice(0, 4).map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            description="Fast paths for the most common Gigling Racing decisions."
            title="Quick Actions"
          />
          <div className="premium-panel rounded-lg p-4">
            <div className="relative z-10">
              <QuickActionGrid />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6">
        <DashboardCharts factionData={factionChartData} raceTrendData={raceTrendData} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section>
          <SectionHeader description="Recent completed races, with item pressure and winner context." title="Recent Races" />
          <div className="mobile-card-rail grid gap-4 lg:grid-cols-2">
            {recentCompletedRaces.slice(0, 4).map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader description="The highest-signal meta cards for the current race week." title="Meta Shift Alerts" />
          <div className="space-y-4">
            {metaData.insights.slice(0, 2).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <section>
          <SectionHeader description="Top Giglings by win rate and recent form." title="Top Giglings" />
          <div className="space-y-4">
            {leaderboardGiglings.slice(0, 3).map((gigling) => (
              <GiglingCard key={gigling.id} compact gigling={gigling} />
            ))}
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="A compressed read of race risk, prize pressure, and meta signals for judges opening the dashboard."
              title="Weekly Race Brief"
            />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-cyan-racing/22 bg-cyan-racing/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-racing">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-black text-white">{raceMix.completedCount}</p>
                <p className="mt-1 text-sm text-white/48">indexed races analyzed</p>
              </div>
              <div className="rounded-lg border border-orange-racing/22 bg-orange-racing/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-orange-racing">
                  Volatility
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {Math.round(averageConditionScore)}
                </p>
                <p className="mt-1 text-sm text-white/48">avg condition score</p>
              </div>
              <div className="rounded-lg border border-emerald-racing/22 bg-emerald-racing/8 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-racing">
                  Best Read
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  {formatPercent(topFaction.podiumRate)}
                </p>
                <p className="mt-1 text-sm capitalize text-white/48">
                  {topFaction.faction} podium rate
                </p>
              </div>
            </div>
            <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/58">
              Current dashboard read: {topFaction.faction} has the strongest faction conversion,
              {` ${topGigling.name}`} owns the highest individual win rate, and chaotic or stormy
              races should be treated as higher-risk predictor inputs.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
