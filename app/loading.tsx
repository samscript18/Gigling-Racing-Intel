import { LoadingState } from "@/components/shared/loading-state";

export default function AppLoading() {
  return (
    <div aria-live="polite">
      <div className="mb-6 h-20 animate-pulse rounded-lg border border-white/10 bg-white/[0.035]" />
      <LoadingState />
    </div>
  );
}
