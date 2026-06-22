"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { RaceCard } from "@/components/shared/race-card";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import { formatPercent, formatToken, shortenAddress } from "@/lib/utils/format";
import type { FactionPerformance, Gigling, Player, Race } from "@/types";

type LeaderboardTab =
  | "giglings"
  | "players"
  | "factions"
  | "streaks"
  | "earnings"
  | "recent";

type LeaderboardHubProps = {
  giglings: Gigling[];
  players: Player[];
  factions: FactionPerformance[];
  races: Race[];
};

type TooltipPayload = {
  name: string;
  value: number | string;
};

type LeaderboardTooltipProps = {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
};

const tabs: Array<{
  label: string;
  value: LeaderboardTab;
}> = [
  { label: "Top Giglings", value: "giglings" },
  { label: "Top Players", value: "players" },
  { label: "Factions", value: "factions" },
  { label: "Streaks", value: "streaks" },
  { label: "Earnings", value: "earnings" },
  { label: "Recent Winners", value: "recent" }
];

function LeaderboardTooltip({ active, payload, label }: LeaderboardTooltipProps) {
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

function winnerName(race: Race) {
  return (
    race.participants.find((participant) => participant.giglingId === race.winnerGiglingId)
      ?.giglingName ?? "Pending"
  );
}

export function LeaderboardHub({
  giglings,
  players,
  factions,
  races
}: LeaderboardHubProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("giglings");
  const topStreaks = useMemo(
    () => [...giglings].sort((first, second) => second.currentStreak - first.currentStreak),
    [giglings]
  );
  const topEarnings = useMemo(
    () => [...giglings].sort((first, second) => second.earnings - first.earnings),
    [giglings]
  );
  const recentWinners = useMemo(
    () =>
      races
        .filter((race) => race.status === "completed")
        .sort(
          (first, second) =>
            new Date(second.endedAt ?? 0).getTime() -
            new Date(first.endedAt ?? 0).getTime()
        ),
    [races]
  );
  const highestStreak = topStreaks[0]?.currentStreak ?? 0;
  const chartData = giglings.slice(0, 8).map((gigling) => ({
    name: gigling.name,
    winRate: gigling.winRate,
    earnings: gigling.earnings,
    podiumRate: gigling.podiumRate
  }));

  const giglingColumns: DataTableColumn<Gigling>[] = [
    {
      header: "Gigling",
      cell: (row) => (
        <Link className="font-bold text-cyan-racing transition hover:text-white" href={`/giglings/${row.id}`}>
          {row.name}
        </Link>
      )
    },
    { header: "Faction", cell: (row) => <FactionBadge faction={row.faction} /> },
    { header: "Rarity", cell: (row) => <RarityBadge rarity={row.rarity} /> },
    { header: "Win", cell: (row) => formatPercent(row.winRate) },
    { header: "Podium", cell: (row) => formatPercent(row.podiumRate) },
    { header: "Earnings", cell: (row) => formatToken(row.earnings) }
  ];
  const playerColumns: DataTableColumn<Player>[] = [
    { header: "Player", cell: (row) => row.displayName ?? shortenAddress(row.walletAddress) },
    { header: "Wallet", cell: (row) => shortenAddress(row.walletAddress) },
    { header: "Wins", cell: (row) => row.wins },
    { header: "Win Rate", cell: (row) => formatPercent(row.winRate) },
    { header: "Stable", cell: (row) => row.stableSize },
    { header: "Earnings", cell: (row) => formatToken(row.totalEarnings) }
  ];
  const factionColumns: DataTableColumn<FactionPerformance>[] = [
    { header: "Faction", cell: (row) => <FactionBadge faction={row.faction} /> },
    { header: "Races", cell: (row) => row.races },
    { header: "Wins", cell: (row) => row.wins },
    { header: "Win Rate", cell: (row) => formatPercent(row.winRate) },
    { header: "Podium", cell: (row) => formatPercent(row.podiumRate) },
    { header: "Avg Place", cell: (row) => `P${row.averagePlacement}` }
  ];
  const raceColumns: DataTableColumn<Race>[] = [
    {
      header: "Race",
      cell: (row) => (
        <Link className="font-bold text-cyan-racing transition hover:text-white" href={`/races/${row.id}`}>
          #{row.raceNumber}
        </Link>
      )
    },
    { header: "Winner", cell: winnerName },
    { header: "Distance", cell: (row) => row.distance },
    { header: "Weather", cell: (row) => row.weather },
    { header: "Prize", cell: (row) => formatToken(row.prizePool) }
  ];

  function renderActiveTable() {
    switch (activeTab) {
      case "players":
        return (
          <DataTable
            columns={playerColumns}
            data={players.slice(0, 12)}
            getRowKey={(row) => row.id}
          />
        );
      case "factions":
        return (
          <DataTable
            columns={factionColumns}
            data={[...factions].sort((first, second) => second.winRate - first.winRate)}
            getRowKey={(row) => row.faction}
          />
        );
      case "streaks":
        return (
          <DataTable
            columns={giglingColumns}
            data={topStreaks.slice(0, 12)}
            getRowKey={(row) => row.id}
          />
        );
      case "earnings":
        return (
          <DataTable
            columns={giglingColumns}
            data={topEarnings.slice(0, 12)}
            getRowKey={(row) => row.id}
          />
        );
      case "recent":
        return (
          <DataTable
            columns={raceColumns}
            data={recentWinners.slice(0, 12)}
            getRowKey={(row) => row.id}
          />
        );
      case "giglings":
      default:
        return (
          <DataTable
            columns={giglingColumns}
            data={giglings.slice(0, 12)}
            getRowKey={(row) => row.id}
          />
        );
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={giglings[0].name}
          icon="trophy"
          label="Top Gigling"
          tone="orange"
          value={formatPercent(giglings[0].winRate)}
        />
        <MetricCard
          detail={players[0].displayName}
          icon="users"
          label="Top Player"
          value={formatToken(players[0].totalEarnings)}
        />
        <MetricCard
          detail="Highest current streak"
          icon="medal"
          label="Win Streak"
          tone="emerald"
          value={`${highestStreak}`}
        />
        <MetricCard
          detail={winnerName(recentWinners[0])}
          icon="coins"
          label="Recent Winner"
          tone="violet"
          value={`#${recentWinners[0].raceNumber}`}
        />
      </div>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader
            description="Top Giglings by win rate, with podium and earnings overlays."
            title="Leaderboard Visualization"
          />
          <div className="h-[340px]">
            <ResponsiveContainer height="100%" width="100%">
              <BarChart data={chartData} margin={{ left: -22, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="leaderboardWin" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#20F7FF" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity={0.45} />
                  </linearGradient>
                  <linearGradient id="leaderboardPodium" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF8A1F" stopOpacity={0.95} />
                    <stop offset="100%" stopColor="#32FF9D" stopOpacity={0.45} />
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
                <Tooltip content={<LeaderboardTooltip />} cursor={{ fill: "rgba(32,247,255,0.06)" }} />
                <Bar dataKey="winRate" fill="url(#leaderboardWin)" name="Win rate" radius={[7, 7, 0, 0]} />
                <Bar dataKey="podiumRate" fill="url(#leaderboardPodium)" name="Podium rate" radius={[7, 7, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              description="Switch between top Giglings, players, factions, streaks, earnings, and recent winners."
              title="Community Boards"
            />
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold transition ${
                    activeTab === tab.value
                      ? "border-cyan-racing/40 bg-cyan-racing/12 text-cyan-racing"
                      : "border-white/10 bg-white/[0.04] text-white/58 hover:border-white/20 hover:text-white"
                  }`}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <motion.div
            key={activeTab}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveTable()}
          </motion.div>
        </div>
      </section>

      <section>
        <SectionHeader
          description="Latest winners as race cards for quick community context."
          title="Recent Winners"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {recentWinners.slice(0, 3).map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
