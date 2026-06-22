import { StableManager } from "@/components/stable/stable-manager";
import { PageHeader } from "@/components/shared/page-header";

export default function StablePage() {
  return (
    <div>
      <PageHeader
        description="Use the connected demo wallet to inspect owned Giglings, stable strength, suggested races, and risk alerts through the wallet-ready ownership layer."
        eyebrow="Stable Manager"
        title="Stable"
      />
      <StableManager />
    </div>
  );
}
