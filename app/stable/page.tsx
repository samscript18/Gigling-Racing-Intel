import { StableManager } from "@/components/stable/stable-manager";
import { PageHeader } from "@/components/shared/page-header";

export default function StablePage() {
  return (
    <div>
      <PageHeader
        description="Use the mock connected wallet state to inspect owned Giglings, stable strength, suggested races, and risk alerts before real ownership reads are connected."
        eyebrow="Stable Manager"
        title="Stable"
      />
      <StableManager />
    </div>
  );
}
