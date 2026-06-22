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
    <div aria-live="polite" className="premium-panel rounded-lg border-red-400/25 p-6" role="alert">
      <div className="relative z-10 flex items-start gap-4">
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-red-200">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/54">{description}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
