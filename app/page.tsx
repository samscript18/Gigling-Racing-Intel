import {
  ArrowRight,
  BrainCircuit,
  LineChart,
  Radar,
  ShieldCheck,
  Swords,
} from "lucide-react";
import Link from "next/link";

import { InsightCard } from "@/components/shared/insight-card";
import { EmptyState } from "@/components/shared/empty-state";
import { MetricCard } from "@/components/shared/metric-card";
import {
  fetchGiglings,
  fetchMetaData,
  fetchRaces
} from "@/lib/gigaverse/api-client";
import { formatPercent } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

const features = [
  {
    title: "Race Intelligence Engine",
    description:
      "Explainable estimates for race fit, risk, confidence, and field volatility before players commit a Gigling.",
    icon: Radar
  },
  {
    title: "Why Did I Lose?",
    description:
      "Post-race panels translate weather, distance, stats, lane pressure, and item usage into plain-English lessons.",
    icon: BrainCircuit
  },
  {
    title: "Meta Shift Detection",
    description:
      "Faction, rarity, weather, distance, and track trends reveal what is quietly winning this week.",
    icon: LineChart
  },
  {
    title: "Rivalry Intelligence",
    description:
      "Track allies, rivals, nemeses, encounter counts, and patterns from repeat Gigling Racing matchups.",
    icon: Swords
  }
];

export default async function LandingPage() {
  const [giglingResult, raceResult, metaResult] = await Promise.allSettled([
    fetchGiglings(),
    fetchRaces(),
    fetchMetaData()
  ]);
  const giglings = giglingResult.status === "fulfilled" ? giglingResult.value : [];
  const races = raceResult.status === "fulfilled" ? raceResult.value : [];
  const metaData =
    metaResult.status === "fulfilled"
      ? metaResult.value
      : { factionPerformance: [], insights: [] };
  const topGigling = [...giglings].sort(
    (first, second) => second.winRate - first.winRate
  )[0];
  const activeRaceCount = races.filter(
    (race) => race.status === "live" || race.status === "scheduled"
  ).length;

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative min-h-[92vh] px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-track-radial" />
        <div className="absolute inset-0 bg-racing-grid opacity-40 [background-size:42px_42px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070d] to-transparent" />
        <div className="absolute left-1/2 top-[18%] h-[44rem] w-[44rem] -translate-x-1/2 rounded-full border border-cyan-racing/12" />
        <div className="absolute left-1/2 top-[24%] h-[31rem] w-[31rem] -translate-x-1/2 rounded-full border border-orange-racing/12" />
        <div className="absolute left-[8%] top-[20%] hidden h-[70%] w-24 -skew-x-12 border-x border-cyan-racing/18 bg-cyan-racing/[0.03] lg:block" />
        <div className="absolute right-[10%] top-[14%] hidden h-[72%] w-24 skew-x-12 border-x border-orange-racing/18 bg-orange-racing/[0.03] lg:block" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 shadow-glow">
              <span className="text-sm font-black tracking-[0.18em] text-cyan-racing">GRI</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Gigling Racing Intel</p>
              <p className="text-xs text-white/48">The intelligence layer for Gigling Racing.</p>
            </div>
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-white/62 transition hover:text-white" href="/giglings">
              Giglings
            </Link>
            <Link className="rounded-lg px-3 py-2 text-sm font-semibold text-white/62 transition hover:text-white" href="/meta">
              Meta
            </Link>
            <Link className="rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 py-2 text-sm font-bold text-cyan-racing transition hover:bg-cyan-racing/16" href="/dashboard">
              Open app
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center pb-16 pt-24 text-center sm:pt-28 lg:pt-32">
          <p className="mb-5 rounded-full border border-orange-racing/30 bg-orange-racing/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.26em] text-orange-racing">
            GIGATHON 1 - Player Tools & Analytics
          </p>
          <h1 className="max-w-5xl text-5xl font-black tracking-normal text-white sm:text-7xl lg:text-8xl">
            Gigling Racing Intel
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/66 sm:text-xl">
            The intelligence layer for Gigaverse Gigling Racing, built to help players inspect Giglings,
            understand race conditions, read the meta, and learn why they win or lose.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-racing px-5 py-3 text-sm font-black text-[#031018] shadow-glow transition hover:scale-[1.02]"
              href="/dashboard"
            >
              Launch dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-racing/40 bg-orange-racing/10 px-5 py-3 text-sm font-black text-orange-racing transition hover:bg-orange-racing/16"
              href="/predictor"
            >
              Run predictor
              <Radar className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              detail="Indexed races with participants, placements, items, and payouts"
              icon="flag"
              label="Races Tracked"
              tone="cyan"
              value={`${races.length}`}
            />
            <MetricCard
              detail={topGigling ? `${topGigling.name} leads the live indexed field` : "No live leaderboard records returned"}
              icon="bot"
              label="Top Win Rate"
              tone="orange"
              value={topGigling ? formatPercent(topGigling.winRate) : "--"}
            />
            <MetricCard
              detail="Open and resolving races from Gigaverse"
              icon="activity"
              label="Active Races"
              tone="emerald"
              value={`${activeRaceCount}`}
            />
            <MetricCard
              detail="Faction, rarity, weather, distance, and track reads"
              icon="barChart"
              label="Meta Signals"
              tone="violet"
              value={`${metaData.insights.length}`}
            />
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="premium-panel rounded-lg p-5">
                  <div className="relative z-10">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-racing/25 bg-cyan-racing/10 text-cyan-racing">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-black text-white">{feature.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-white/56">{feature.description}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {metaData.insights[0] ? (
              <InsightCard insight={metaData.insights[0]} />
            ) : (
              <EmptyState
                description="Live Gigaverse meta statistics are not available right now. No substitute data is shown."
                title="Live meta signal unavailable"
              />
            )}
            <article className="premium-panel rounded-lg p-5">
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-racing">
                  Stable Manager
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">
                  Connect your racing wallet
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/56">
                  Load owned Giglings, race suggestions, and performance signals directly from
                  your wallet&apos;s indexed Gigaverse racing history.
                </p>
                <div className="mt-5 rounded-lg border border-emerald-racing/25 bg-emerald-racing/10 p-4 text-emerald-racing">
                  Live wallet ownership only. No synthetic stable is substituted.
                </div>
              </div>
            </article>
            <article className="premium-panel rounded-lg p-5">
              <div className="relative z-10">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-racing">
                  Hackathon Alignment
                </p>
                <h2 className="mt-3 text-2xl font-black text-white">Built for Gigling Racing</h2>
                <p className="mt-3 text-sm leading-6 text-white/56">
                  Every route, type, data record, and UI label is centered on Giglings, stables,
                  race conditions, items, rivals, and meta shifts.
                </p>
                <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm text-white/62">
                  <ShieldCheck className="h-5 w-5 text-emerald-racing" />
                  Vercel-ready structure, live data, explicit outage states, and isolated integration clients.
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
