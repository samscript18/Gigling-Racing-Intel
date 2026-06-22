import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { MetaInsight } from "@/types";

type InsightCardProps = {
  insight: MetaInsight;
  className?: string;
};

const severityStyles: Record<MetaInsight["severity"], string> = {
  info: "border-cyan-racing/28 text-cyan-racing",
  positive: "border-emerald-racing/30 text-emerald-racing",
  warning: "border-orange-racing/32 text-orange-racing",
  critical: "border-red-400/32 text-red-200"
};

export function InsightCard({ insight, className }: InsightCardProps) {
  const TrendIcon =
    insight.trendDirection === "up"
      ? ArrowUpRight
      : insight.trendDirection === "down"
        ? ArrowDownRight
        : ArrowRight;

  return (
    <article className={cn("premium-panel rounded-lg p-5", className)}>
      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-4">
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
              severityStyles[insight.severity]
            )}
          >
            {insight.severity}
          </span>
          <div className="flex items-center gap-1 text-sm font-bold text-white">
            <TrendIcon className="h-4 w-4" />
            {insight.metricValue}
          </div>
        </div>
        <h3 className="text-lg font-black text-white">{insight.title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/56">{insight.description}</p>
        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/52">
          {insight.metricLabel}
        </div>
      </div>
    </article>
  );
}
