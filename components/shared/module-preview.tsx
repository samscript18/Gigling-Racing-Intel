import Link from "next/link";

import { ChartCard } from "@/components/shared/chart-card";
import { MetricCard, type MetricIconName } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";

type PreviewMetric = {
  label: string;
  value: string;
  detail?: string;
  icon?: MetricIconName;
  tone?: "cyan" | "orange" | "violet" | "emerald";
};

type ModulePreviewProps = {
  eyebrow: string;
  title: string;
  description: string;
  metrics: PreviewMetric[];
  highlights: string[];
  primaryHref?: string;
  primaryLabel?: string;
};

export function ModulePreview({
  eyebrow,
  title,
  description,
  metrics,
  highlights,
  primaryHref = "/dashboard",
  primaryLabel = "Back to dashboard"
}: ModulePreviewProps) {
  return (
    <div>
      <PageHeader
        actions={
          <Link
            className="rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 py-2 text-sm font-bold text-cyan-racing transition hover:bg-cyan-racing/16"
            href={primaryHref}
          >
            {primaryLabel}
          </Link>
        }
        description={description}
        eyebrow={eyebrow}
        title={title}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <ChartCard
          description="A live-connected intelligence view with resilient demo data when upstream services are unavailable."
          title="Intel Module Online"
        >
          <div className="space-y-3">
            {highlights.map((highlight, index) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-3"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-racing/28 bg-orange-racing/10 text-sm font-black text-orange-racing">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-white/64">{highlight}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader
              description="Core navigation and typed data architecture are active across the product."
              title="Platform Status"
            />
            <div className="space-y-3 text-sm text-white/58">
              <p>Core route exists and renders in the shared shell.</p>
              <p>Gigaverse API and contract payloads are normalized before reaching the UI.</p>
              <p>Loading, empty, and error states are available to feature screens.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
