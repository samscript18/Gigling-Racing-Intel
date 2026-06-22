import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
};

export function EmptyState({ title, description, icon: Icon = SearchX }: EmptyStateProps) {
  return (
    <div className="premium-panel rounded-lg p-8 text-center">
      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-cyan-racing/25 bg-cyan-racing/10 text-cyan-racing">
          <Icon className="h-7 w-7" />
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/54">{description}</p>
      </div>
    </div>
  );
}
