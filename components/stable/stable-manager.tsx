"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Dna, ShieldAlert, ShieldCheck, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { ChartCard } from "@/components/shared/chart-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { GiglingCard } from "@/components/shared/gigling-card";
import { LoadingState } from "@/components/shared/loading-state";
import { MetricCard } from "@/components/shared/metric-card";
import { RaceCard } from "@/components/shared/race-card";
import { SectionHeader } from "@/components/shared/section-header";
import { WalletConnectButton } from "@/components/shared/wallet-connect-button";
import { useRaces } from "@/hooks/use-races";
import { useStable, useStableEligibility } from "@/hooks/use-stable";
import {
  getStableBreedingRecommendations,
  getStableRetirementWarnings
} from "@/lib/gigaverse/analytics";
import { formatPercent, formatToken, shortenAddress } from "@/lib/utils/format";

type TooltipPayload = {
  name: string;
  value: number | string;
};

type StableTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

function StableTooltip({ active, payload, label }: StableTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border border-white/12 bg-[#07101d]/95 p-3 shadow-glow backdrop-blur-xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-racing">
        {label}
      </p>
      <div className="mt-2 space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-5 text-sm">
            <span className="text-white/58">{entry.name}</span>
            <span className="font-bold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StableManager() {
  const { address, isConnected } = useAccount();
  const { data: stable, error, isLoading, isError } = useStable(address);
  const { data: races } = useRaces();
  const eligibilityQueries = useStableEligibility(stable?.giglings ?? [], address);

  if (!isConnected || !address) {
    return (
      <EmptyState
        action={<WalletConnectButton />}
        description="Connect a wallet to load Giglings and race history owned by your live wallet address."
        icon={Wallet}
        title="Connect your racing wallet"
      />
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState
        description={
          error instanceof Error
            ? error.message
            : "Gigaverse could not load live stable data for this wallet."
        }
        title="Stable unavailable"
      />
    );
  }

  if (!stable) {
    return (
      <EmptyState
        description="Gigaverse returned no stable record for this connected wallet."
        icon={Wallet}
        title="No stable found"
      />
    );
  }

  if (stable.giglings.length === 0) {
    return (
      <EmptyState
        action={<WalletConnectButton />}
        description={`Gigaverse returned no indexed Giglings or race entries for ${shortenAddress(address)}. Try a wallet that has participated in Gigling Racing.`}
        icon={Wallet}
        title="No live stable data found"
      />
    );
  }

  const bestGigling =
    stable.giglings.find((gigling) => gigling.id === stable.bestGiglingId) ??
    stable.giglings[0];
  const weakestGigling = [...stable.giglings].sort(
    (first, second) => first.winRate - second.winRate
  )[0];
  const suggestedRaces =
    races?.filter((race) => stable.recommendedRaceIds.includes(race.id)) ?? [];
  const totalEarnings = stable.giglings.reduce(
    (total, gigling) => total + gigling.earnings,
    0
  );
  const performanceData = stable.giglings.map((gigling) => ({
    name: gigling.name,
    winRate: gigling.winRate,
    podiumRate: gigling.podiumRate,
    earnings: gigling.earnings,
    races: gigling.totalRaces
  }));
  const raceVolumeData = stable.giglings.map((gigling) => ({
    name: gigling.name,
    races: gigling.totalRaces,
    wins: gigling.wins,
    podiums: gigling.podiums
  }));
  const breedingRecommendations = getStableBreedingRecommendations(stable.giglings);
  const retirementWarnings = getStableRetirementWarnings(stable.giglings);
  const ineligibleGiglings = stable.giglings.filter(
    (_, index) =>
      eligibilityQueries[index]?.data?.status === "ok" &&
      eligibilityQueries[index]?.data?.data === false
  );

  return (
    <div className="space-y-6">
      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-emerald-racing/28 bg-emerald-racing/10 text-emerald-racing">
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-racing">
                Connected racing wallet
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                {`${stable.ownerName ?? shortenAddress(stable.ownerAddress)}'s Stable`}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/58">
                Live ownership and race history for {shortenAddress(stable.ownerAddress)} from
                the Gigaverse Racing API.
              </p>
            </div>
          </div>
          <WalletConnectButton />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail="Owned Giglings"
          icon="bot"
          label="Stable Size"
          value={`${stable.giglings.length}`}
        />
        <MetricCard
          detail={`${stable.totalWins} wins / ${stable.totalRaces} races`}
          icon="trophy"
          label="Average Win"
          mechanic="winRate"
          tone="emerald"
          value={formatPercent(stable.averageWinRate)}
        />
        <MetricCard
          detail={bestGigling.name}
          icon="medal"
          label="Best Gigling"
          mechanic="podiumRate"
          tone="orange"
          value={formatPercent(bestGigling.winRate)}
        />
        <MetricCard
          detail="Stable career earnings"
          icon="coins"
          label="Earnings"
          tone="violet"
          value={formatToken(totalEarnings)}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <ChartCard
          description="Owned Giglings by win and podium rate, useful for entry selection."
          mechanic="podiumRate"
          title="Stable Performance Chart"
        >
          <div className="h-[320px]">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={performanceData} margin={{ left: -22, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="stableWinGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#20F7FF" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.48)", fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<StableTooltip />} />
                <Area
                  dataKey="winRate"
                  fill="url(#stableWinGradient)"
                  name="Win rate"
                  stroke="#20F7FF"
                  strokeWidth={3}
                  type="monotone"
                />
                <Area
                  dataKey="podiumRate"
                  fill="transparent"
                  name="Podium rate"
                  stroke="#FF8A1F"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          description="Race volume, wins, and podiums by owned Gigling."
          title="Stable Race Volume"
        >
          <div className="h-[320px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={raceVolumeData} margin={{ left: -22, right: 8, top: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.48)", fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "rgba(255,255,255,0.42)", fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip content={<StableTooltip />} cursor={{ fill: "rgba(32,247,255,0.06)" }} />
                <Bar dataKey="races" fill="#A855F7" name="Races" radius={[6, 6, 0, 0]} />
                <Bar dataKey="podiums" fill="#20F7FF" name="Podiums" radius={[6, 6, 0, 0]} />
                <Bar dataKey="wins" fill="#32FF9D" name="Wins" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Profile compatibility derived from live stats; protocol breeding availability remains explicitly unverified."
              title="Breeding Research"
            />
            {breedingRecommendations.length > 0 ? (
              <div className="space-y-3">
                {breedingRecommendations.map((recommendation) => (
                  <div
                    key={recommendation.id}
                    className="rounded-lg border border-violet-racing/20 bg-violet-racing/8 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 font-black text-white">
                          <Dna className="h-4 w-4 text-violet-200" />
                          {recommendation.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-white/52">
                          {recommendation.description}
                        </p>
                      </div>
                      <span className="rounded-full border border-violet-racing/25 bg-violet-racing/10 px-2.5 py-1 text-xs font-black text-violet-100">
                        {recommendation.compatibilityScore}/100
                      </span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-white/42">
                      {recommendation.reasons.join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-white/52">
                At least two live owned Giglings are required for compatibility research.
              </p>
            )}
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Performance rotation signals plus live PetRacingSystem eligibility checks."
              mechanic="eligibility"
              title="Retirement & Eligibility Watch"
            />
            <div className="space-y-3">
              {ineligibleGiglings.map((gigling) => (
                <div
                  key={`eligibility-${gigling.id}`}
                  className="rounded-lg border border-red-400/24 bg-red-500/8 p-4"
                >
                  <p className="flex items-center gap-2 font-black text-red-100">
                    <ShieldAlert className="h-4 w-4" />
                    {gigling.name} cannot currently race
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/52">
                    PetRacingSystem reports a lock, cooldown, or active race-limit condition.
                  </p>
                </div>
              ))}
              {retirementWarnings.map((warning) => (
                <div
                  key={warning.id}
                  className="rounded-lg border border-orange-racing/22 bg-orange-racing/8 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-racing">
                    {warning.severity} / {warning.giglingName}
                  </p>
                  <p className="mt-2 font-black text-white">{warning.title}</p>
                  <p className="mt-2 text-sm leading-6 text-white/52">
                    {warning.description}
                  </p>
                </div>
              ))}
              {ineligibleGiglings.length === 0 && retirementWarnings.length === 0 ? (
                <p className="rounded-lg border border-emerald-racing/20 bg-emerald-racing/8 p-4 text-sm leading-6 text-white/58">
                  No contract eligibility blocks or performance-based rotation warnings are active.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.82fr]">
        <section>
          <SectionHeader
            description="Owned Giglings from the connected stable state."
            title="Owned Giglings"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {stable.giglings.map((gigling) => (
              <GiglingCard key={gigling.id} gigling={gigling} />
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader
                description="Best and weakest performers from current stable data."
                title="Stable Read"
              />
              <div className="grid gap-3">
                <motion.div
                  className="rounded-lg border border-emerald-racing/20 bg-emerald-racing/8 p-4"
                  whileHover={{ x: 3 }}
                >
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald-racing">
                    <ShieldCheck className="h-4 w-4" />
                    Best
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{bestGigling.name}</p>
                  <p className="mt-1 text-sm text-white/52">
                    {formatPercent(bestGigling.winRate)} win rate, best in {bestGigling.bestWeather}.
                  </p>
                </motion.div>
                <motion.div
                  className="rounded-lg border border-orange-racing/20 bg-orange-racing/8 p-4"
                  whileHover={{ x: 3 }}
                >
                  <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-orange-racing">
                    <AlertTriangle className="h-4 w-4" />
                    Needs Care
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{weakestGigling.name}</p>
                  <p className="mt-1 text-sm text-white/52">
                    Avoid overexposing it outside {weakestGigling.bestDistance} races.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="premium-panel rounded-lg p-5">
            <div className="relative z-10">
              <SectionHeader
                description="Opportunity, risk, meta, and performance notices."
                title="Risk Alerts"
              />
              <div className="space-y-3">
                {stable.alerts.length > 0 ? (
                  stable.alerts.map((alert) => (
                    <div key={alert.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-racing/70">
                        {alert.type}
                      </p>
                      <p className="mt-2 text-sm font-bold text-white">{alert.title}</p>
                      <p className="mt-2 text-sm leading-6 text-white/54">{alert.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-white/54">
                    No live risk alerts are available for this stable yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section>
        <SectionHeader
          description="Races that match stable opportunities, condition fit, or risk alerts."
          title="Suggested Races"
        />
        {suggestedRaces.length > 0 ? (
          <div className="mobile-card-rail grid gap-4 lg:grid-cols-3">
            {suggestedRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        ) : (
          <p className="premium-panel rounded-lg p-5 text-sm leading-6 text-white/54">
            Gigaverse has not returned a live or scheduled race recommendation for this stable.
          </p>
        )}
      </section>
    </div>
  );
}
