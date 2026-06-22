import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export function ErrorState({
  title = "Intel feed unavailable",
  description = "The mock layer could not resolve this request. Try another route or reset filters."
}: ErrorStateProps) {
  return (
    <div className="premium-panel rounded-lg border-red-400/25 p-6">
      <div className="relative z-10 flex items-start gap-4">
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-red-200">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/54">{description}</p>
        </div>
      </div>
    </div>
  );
}
