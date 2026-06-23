import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function ErrorState({
  title = "Intel feed unavailable",
  description = "Live Gigaverse racing data is currently unavailable. Please retry shortly.",
  action
}: ErrorStateProps) {
  return (
    <div
      aria-live="polite"
      className="premium-panel rounded-lg border-red-400/25 p-5 sm:p-6"
      role="alert"
    >
      <div className="relative z-10 grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-lg border border-red-400/30 bg-red-500/10 text-red-200">
          <div className="absolute inset-x-[-3rem] top-1/2 h-px bg-gradient-to-r from-transparent via-red-300/40 to-transparent" />
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <p className="mb-2 inline-flex rounded-full border border-red-300/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-red-200">
            Live data interruption
          </p>
          <h2 className="text-xl font-black text-white">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">{description}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {["API reachability", "Auth state", "Network latency"].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/42"
              >
                {label}
              </div>
            ))}
          </div>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
