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
    <div className="premium-panel rounded-lg p-8 text-center" role="status">
      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-lg bg-cyan-racing/20 blur-xl" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-racing/25 bg-cyan-racing/10 text-cyan-racing">
            <Icon className="h-7 w-7" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/54">{description}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
