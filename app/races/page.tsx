import { RaceDashboard } from "@/components/races/race-dashboard";
import { PageHeader } from "@/components/shared/page-header";

export default function RacesPage() {
  return (
    <div>
      <PageHeader
        description="Inspect live, scheduled, recent, and historical races with condition filters, item visibility, winner context, and detail links."
        eyebrow="Race Feed"
        title="Races"
      />
      <RaceDashboard />
    </div>
  );
}
