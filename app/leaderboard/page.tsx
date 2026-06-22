import { LeaderboardHub } from "@/components/leaderboard/leaderboard-hub";
import { PageHeader } from "@/components/shared/page-header";
import {
  leaderboardGiglings,
  leaderboardPlayers,
  mockFactionPerformance,
  recentCompletedRaces
} from "@/lib/gigaverse/mock-data";

export default function LeaderboardPage() {
  return (
    <div>
      <PageHeader
        description="Community comparison boards for Giglings, players, factions, win streaks, earnings, and recent winners."
        eyebrow="Leaderboards"
        title="Leaderboard"
      />
      <LeaderboardHub
        factions={mockFactionPerformance}
        giglings={leaderboardGiglings}
        players={leaderboardPlayers}
        races={recentCompletedRaces}
      />
    </div>
  );
}
