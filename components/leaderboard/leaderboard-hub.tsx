"use client";

import { motion } from "framer-motion";
import { Crown, Eye, Medal, Trophy } from "lucide-react";
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
import { EmptyState } from "@/components/shared/empty-state";
import { FactionBadge } from "@/components/shared/faction-badge";
import { GiglingAvatar } from "@/components/shared/gigling-avatar";
import { MetricCard } from "@/components/shared/metric-card";
import { RaceCard } from "@/components/shared/race-card";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import {
  formatConditionLabel,
  formatOptionalToken,
  formatPercent,
  formatToken,
  shortenAddress
} from "@/lib/utils/format";
import type {
  FactionPerformance,
  Gigling,
  Player,
  Race,
  StableLeaderboardEntry
} from "@/types";

type LeaderboardTab =
  | "giglings"
  | "players"
  | "stables"
  | "factions"
  | "streaks"
  | "earnings"
  | "recent";

type LeaderboardHubProps = {
  giglings: Gigling[];
  players: Player[];
  factions: FactionPerformance[];
  races: Race[];
  stables: StableLeaderboardEntry[];
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
  { label: "Top Stables", value: "stables" },
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

function safeEarningsValue(value: number) {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function PodiumDeck({ giglings }: { giglings: Gigling[] }) {
  const podium = giglings.slice(0, 3);
  const rankStyles = [
    "border-orange-racing/35 bg-orange-racing/10 text-orange-racing",
    "border-cyan-racing/35 bg-cyan-racing/10 text-cyan-racing",
    "border-violet-racing/35 bg-violet-racing/10 text-violet-200"
  ];
  const rankIcons = [Crown, Trophy, Medal];

  return (
    <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-racing">
                Community Podium
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Top indexed Giglings</h2>
            </div>
            <Trophy className="h-8 w-8 text-orange-racing" />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {podium.map((gigling, index) => {
              const Icon = rankIcons[index] ?? Medal;

              return (
                <motion.article
                  key={gigling.id}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  transition={{ delay: index * 0.07, duration: 0.22 }}
                  whileHover={{ y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-black ${rankStyles[index]}`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      #{index + 1}
                    </span>
                    <span className="text-sm font-black text-white">
                      {formatPercent(gigling.winRate)}
                    </span>
                  </div>
                  <GiglingAvatar
                    className="aspect-square rounded-lg"
                    imageUrl={gigling.imageUrl}
                    name={gigling.name}
                    priority={index === 0}
                  />
                  <div className="mt-4 min-w-0">
                    <Link
                      className="block truncate text-lg font-black text-white transition hover:text-cyan-racing"
                      href={`/giglings/${gigling.id}`}
                    >
                      {gigling.name}
                    </Link>
                    <p className="mt-1 text-xs text-white/42">{shortenAddress(gigling.ownerAddress)}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg border border-white/10 bg-black/18 p-2">
                      <p className="text-white/38">Podium</p>
                      <p className="mt-1 font-black text-cyan-racing">
                        {formatPercent(gigling.podiumRate)}
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-black/18 p-2">
                      <p className="text-white/38">Earned</p>
                      <p className="mt-1 font-black text-orange-racing">
                        {formatOptionalToken(gigling.earnings)}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-racing">
            Board Story
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">What the leaderboard says now</h2>
          <div className="mt-5 space-y-3">
            {podium.map((gigling, index) => (
              <div
                key={gigling.id}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
              >
                <p className="text-sm font-black text-white">
                  #{index + 1} {gigling.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/54">
                  {gigling.faction} racer with {formatPercent(gigling.winRate)} wins,
                  {` ${formatPercent(gigling.podiumRate)}`} podium conversion, and strongest
                  live fit {gigling.bestDistance === "unknown" ? "not provided by this feed" : `in ${formatConditionLabel(gigling.bestDistance)} races`}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function LeaderboardHub({
  giglings,
  players,
  factions,
  races,
  stables
}: LeaderboardHubProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("giglings");
  const [selectedPlayerId, setSelectedPlayerId] = useState(players[0]?.id ?? "");

  const topStreaks = useMemo(
    () => [...giglings].sort((first, second) => second.currentStreak - first.currentStreak),
    [giglings]
  );
  const topEarnings = useMemo(
    () => [...giglings].sort((first, second) => safeEarningsValue(second.earnings) - safeEarningsValue(first.earnings)),
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

  if (
    giglings.length === 0 ||
    players.length === 0 ||
    recentWinners.length === 0 ||
    stables.length === 0
  ) {
    return (
      <EmptyState
        description="Gigaverse responded, but one or more live leaderboard sources are empty. Community rankings need Giglings, players, and completed race results."
        title="Live leaderboard data is incomplete"
      />
    );
  }

  const selectedPlayer =
    players.find((player) => player.id === selectedPlayerId) ?? players[0];
  const chartData = giglings.slice(0, 8).map((gigling) => ({
    name: gigling.name,
    winRate: gigling.winRate,
    earnings: safeEarningsValue(gigling.earnings),
    podiumRate: gigling.podiumRate
  }));

  const giglingColumns: DataTableColumn<Gigling>[] = [
    {
      header: "Gigling",
      cell: (row) => (
        <div className="flex min-w-48 items-center gap-3">
          <GiglingAvatar
            className="h-10 w-10 shrink-0 rounded-lg"
            imageUrl={row.imageUrl}
            name={row.name}
          />
          <span className="min-w-0">
            <Link className="block truncate font-bold text-cyan-racing transition hover:text-white" href={`/giglings/${row.id}`}>
              {row.name}
            </Link>
            <span className="block truncate text-xs text-white/38">{row.tokenId}</span>
          </span>
        </div>
      )
    },
    { header: "Faction", cell: (row) => <FactionBadge faction={row.faction} /> },
    { header: "Rarity", cell: (row) => <RarityBadge rarity={row.rarity} /> },
    { header: "Win", cell: (row) => formatPercent(row.winRate) },
    { header: "Podium", cell: (row) => formatPercent(row.podiumRate) },
    { header: "Earnings", cell: (row) => formatOptionalToken(row.earnings) }
  ];
  const playerColumns: DataTableColumn<Player>[] = [
    { header: "Player", cell: (row) => row.displayName ?? shortenAddress(row.walletAddress) },
    { header: "Wallet", cell: (row) => shortenAddress(row.walletAddress) },
    { header: "Wins", cell: (row) => row.wins },
    { header: "Win Rate", cell: (row) => formatPercent(row.winRate) },
    { header: "Stable", cell: (row) => row.stableSize },
    { header: "Earnings", cell: (row) => formatOptionalToken(row.totalEarnings) },
    {
      header: "Scout",
      cell: (row) => (
        <button
          aria-label={`Scout ${row.displayName ?? shortenAddress(row.walletAddress)}`}
          className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-white/58 transition hover:border-cyan-racing/35 hover:text-cyan-racing"
          title="Open player spotlight"
          type="button"
          onClick={() => setSelectedPlayerId(row.id)}
        >
          <Eye className="h-4 w-4" />
        </button>
      )
    }
  ];
  const stableColumns: DataTableColumn<StableLeaderboardEntry>[] = [
    {
      header: "Stable",
      cell: (row) => row.ownerName ?? shortenAddress(row.ownerAddress)
    },
    { header: "Wallet", cell: (row) => shortenAddress(row.ownerAddress) },
    { header: "Giglings", cell: (row) => row.stableSize },
    { header: "Wins", cell: (row) => row.totalWins },
    { header: "Win Rate", cell: (row) => formatPercent(row.winRate) },
    { header: "Earnings", cell: (row) => formatOptionalToken(row.totalEarnings) },
    { header: "Ace", cell: (row) => row.bestGiglingName }
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
      case "stables":
        return (
          <DataTable
            columns={stableColumns}
            data={stables.slice(0, 12)}
            getRowKey={(row) => row.id}
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
      <PodiumDeck giglings={giglings} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          detail={giglings[0].name}
          icon="trophy"
          label="Top Gigling"
          mechanic="winRate"
          tone="orange"
          value={formatPercent(giglings[0].winRate)}
        />
        <MetricCard
          detail={players[0].displayName}
          icon="users"
          label="Top Player"
          value={formatOptionalToken(players[0].totalEarnings)}
        />
        <MetricCard
          detail={stables[0].ownerName ?? shortenAddress(stables[0].ownerAddress)}
          icon="shield"
          label="Top Stable"
          mechanic="winRate"
          tone="emerald"
          value={`${stables[0].totalWins} wins`}
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
              description="Compare Giglings, players, owner-grouped stables, factions, streaks, earnings, and recent winners."
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

      <section className="premium-panel rounded-lg p-5">
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-racing">
              Player Spotlight
            </p>
            <h2 className="mt-3 text-2xl font-black text-white">
              {selectedPlayer.displayName ?? shortenAddress(selectedPlayer.walletAddress)}
            </h2>
            <a
              className="mt-2 inline-block text-sm text-white/48 transition hover:text-cyan-racing"
              href={`https://abscan.org/address/${selectedPlayer.walletAddress}`}
              rel="noreferrer"
              target="_blank"
            >
              {selectedPlayer.walletAddress}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Races", selectedPlayer.totalRaces],
              ["Wins", selectedPlayer.wins],
              ["Win rate", formatPercent(selectedPlayer.winRate)],
              ["Stable", selectedPlayer.stableSize]
            ].map(([label, value]) => (
              <div key={label} className="min-w-24 border-l border-white/10 px-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/38">{label}</p>
                <p className="mt-2 text-xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionHeader
          description="Latest winners as race cards for quick community context."
          title="Recent Winners"
        />
        <div className="mobile-card-rail grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentWinners.slice(0, 3).map((race) => (
            <RaceCard key={race.id} race={race} />
          ))}
        </div>
      </section>
    </div>
  );
}
