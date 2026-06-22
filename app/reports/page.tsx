import { ReportStudio } from "@/components/reports/report-studio";
import { PageHeader } from "@/components/shared/page-header";
import {
  fetchGiglings,
  fetchMetaData,
  fetchRaces
} from "@/lib/gigaverse/api-client";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [giglings, races, metaData] = await Promise.all([
    fetchGiglings(),
    fetchRaces(),
    fetchMetaData()
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

  return (
    <div>
      <PageHeader
        description="Generate shareable Gigling, race, and meta report cards with social-ready copy for community posts."
        eyebrow="Shareable Intel"
        title="Reports"
      />
      <ReportStudio
        giglings={leaderboardGiglings}
        insights={metaData.insights}
        races={recentCompletedRaces}
      />
    </div>
  );
}
