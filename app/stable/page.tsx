import { StableManager } from "@/components/stable/stable-manager";
import { PageHeader } from "@/components/shared/page-header";

export default function StablePage() {
  return (
    <div>
      <PageHeader
        description="Connect your wallet to inspect live owned Giglings, stable strength, suggested races, and risk alerts from indexed racing history."
        eyebrow="Stable Manager"
        title="Stable"
      />
      <StableManager />
    </div>
  );
}
