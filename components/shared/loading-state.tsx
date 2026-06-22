export function LoadingState() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="premium-panel h-36 animate-pulse rounded-lg bg-white/[0.03]"
        />
      ))}
    </div>
  );
}
