import { ReportStudio } from "@/components/reports/report-studio";
import { PageHeader } from "@/components/shared/page-header";
import {
  leaderboardGiglings,
  mockMetaInsights,
  recentCompletedRaces
} from "@/lib/gigaverse/mock-data";

export default function ReportsPage() {
  return (
    <div>
      <PageHeader
        description="Generate shareable Gigling, race, and meta report cards with social-ready copy and copy/share/download placeholders."
        eyebrow="Shareable Intel"
        title="Reports"
      />
      <ReportStudio
        giglings={leaderboardGiglings}
        insights={mockMetaInsights}
        races={recentCompletedRaces}
      />
    </div>
  );
}
