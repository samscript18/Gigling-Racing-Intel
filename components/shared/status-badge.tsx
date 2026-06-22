import type { RaceStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const statusStyles: Record<RaceStatus, string> = {
  scheduled: "border-cyan-racing/35 bg-cyan-racing/10 text-cyan-racing",
  live: "border-orange-racing/40 bg-orange-racing/12 text-orange-racing",
  completed: "border-emerald-racing/35 bg-emerald-racing/10 text-emerald-racing",
  cancelled: "border-red-400/35 bg-red-500/10 text-red-200"
};

type StatusBadgeProps = {
  status: RaceStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize",
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
