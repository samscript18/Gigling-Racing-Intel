import { LeaderboardHub } from "@/components/leaderboard/leaderboard-hub";
import { PageHeader } from "@/components/shared/page-header";
import {
  getFactionPerformanceFromRaces
} from "@/lib/gigaverse/analytics";
import {
  fetchGiglings,
  fetchLeaderboardPlayers,
  fetchRaces
} from "@/lib/gigaverse/api-client";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const [giglings, players, races] = await Promise.all([
    fetchGiglings(),
    fetchLeaderboardPlayers(),
    fetchRaces()
  ]);
  const leaderboardGiglings = [...giglings].sort(
    (first, second) => second.winRate - first.winRate
  );
  const recentCompletedRaces = races
    .filter((race) => race.status === "completed")
    .sort(
      (first, second) =>
        new Date(second.endedAt ?? second.startedAt ?? 0).getTime() -
        new Date(first.endedAt ?? first.startedAt ?? 0).getTime()
    );
  const factionPerformance = getFactionPerformanceFromRaces(races);

  return (
    <div>
      <PageHeader
        description="Community comparison boards for Giglings, players, factions, win streaks, earnings, and recent winners."
        eyebrow="Leaderboards"
        title="Leaderboard"
      />
      <LeaderboardHub
        factions={factionPerformance}
        giglings={leaderboardGiglings}
        players={players}
        races={recentCompletedRaces}
      />
    </div>
  );
}
