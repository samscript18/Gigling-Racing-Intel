import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  action
}: EmptyStateProps) {
  return (
    <div className="premium-panel rounded-lg p-6 text-center sm:p-8" role="status">
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center">
        <div className="mb-5 w-full max-w-sm">
          <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-lg border border-cyan-racing/25 bg-cyan-racing/10 text-cyan-racing shadow-glow">
            <div className="absolute inset-x-[-5rem] top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-racing/45 to-transparent" />
            <div className="absolute inset-y-[-2rem] left-1/2 w-px bg-gradient-to-b from-transparent via-orange-racing/34 to-transparent" />
            <Icon className="relative h-8 w-8" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-1 rounded-full bg-cyan-racing/35" />
            <div className="h-1 rounded-full bg-orange-racing/35" />
            <div className="h-1 rounded-full bg-violet-racing/35" />
          </div>
        </div>
        <p className="mb-3 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/44">
          No live signal
        </p>
        <h2 className="text-xl font-black text-white">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/58">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
