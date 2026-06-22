import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { FactionBadge } from "@/components/shared/faction-badge";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { RarityBadge } from "@/components/shared/rarity-badge";
import { SectionHeader } from "@/components/shared/section-header";
import {
  leaderboardGiglings,
  leaderboardPlayers,
  mockFactionPerformance,
  recentCompletedRaces
} from "@/lib/gigaverse/mock-data";
import { formatPercent, formatToken, shortenAddress } from "@/lib/utils/format";
import type { Gigling, Player } from "@/types";

export default function LeaderboardPage() {
  const giglingColumns: DataTableColumn<Gigling>[] = [
    { header: "Gigling", cell: (row) => row.name },
    { header: "Faction", cell: (row) => <FactionBadge faction={row.faction} /> },
    { header: "Rarity", cell: (row) => <RarityBadge rarity={row.rarity} /> },
    { header: "Win", cell: (row) => formatPercent(row.winRate) },
    { header: "Earnings", cell: (row) => formatToken(row.earnings) }
  ];
  const playerColumns: DataTableColumn<Player>[] = [
    { header: "Player", cell: (row) => row.displayName ?? shortenAddress(row.walletAddress) },
    { header: "Wallet", cell: (row) => shortenAddress(row.walletAddress) },
    { header: "Wins", cell: (row) => row.wins },
    { header: "Win Rate", cell: (row) => formatPercent(row.winRate) },
    { header: "Earnings", cell: (row) => formatToken(row.totalEarnings) }
  ];
  const highestStreak = Math.max(...leaderboardGiglings.map((gigling) => gigling.currentStreak));

  return (
    <div>
      <PageHeader
        description="Community comparison boards for Giglings, players, factions, win streaks, earnings, and recent winners."
        eyebrow="Leaderboards"
        title="Leaderboard"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail={leaderboardGiglings[0].name} icon="trophy" label="Top Gigling" tone="orange" value={formatPercent(leaderboardGiglings[0].winRate)} />
        <MetricCard detail={leaderboardPlayers[0].displayName} icon="users" label="Top Player" value={formatToken(leaderboardPlayers[0].totalEarnings)} />
        <MetricCard detail="Highest current streak" icon="medal" label="Win Streak" tone="emerald" value={`${highestStreak}`} />
        <MetricCard detail={recentCompletedRaces[0].winnerGiglingId ?? "Pending"} icon="coins" label="Recent Winner" tone="violet" value={`#${recentCompletedRaces[0].raceNumber}`} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Sorted by mock career win rate." title="Top Giglings" />
            <DataTable columns={giglingColumns} data={leaderboardGiglings.slice(0, 8)} getRowKey={(row) => row.id} />
          </div>
        </section>
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Sorted by mock total earnings." title="Top Players" />
            <DataTable columns={playerColumns} data={leaderboardPlayers.slice(0, 8)} getRowKey={(row) => row.id} />
          </div>
        </section>
      </div>

      <section className="mt-6 premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <SectionHeader description="Faction comparison by wins, podiums, and average placement." title="Top Factions" />
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {mockFactionPerformance.map((entry) => (
              <div key={entry.faction} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                <p className="font-black capitalize text-white">{entry.faction}</p>
                <p className="mt-2 text-2xl font-black text-cyan-racing">{formatPercent(entry.winRate)}</p>
                <p className="mt-1 text-sm text-white/48">{entry.wins} wins / avg P{entry.averagePlacement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
