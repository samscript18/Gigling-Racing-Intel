import { GiglingExplorer } from "@/components/giglings/gigling-explorer";
import { PageHeader } from "@/components/shared/page-header";

export default function GiglingsPage() {
  return (
    <div>
      <PageHeader
        description="Search by name, token ID, owner, or wallet; filter by faction, rarity, best weather, and best distance; then sort by the racing signal that matters."
        eyebrow="Gigling Explorer"
        title="Giglings"
      />
      <GiglingExplorer />
    </div>
  );
}
