const skeletonRows = [
  "w-2/3",
  "w-5/6",
  "w-1/2"
];

export function LoadingState() {
  return (
    <div
      aria-label="Loading racing intel"
      className="space-y-4"
      role="status"
    >
      <div className="premium-panel rounded-lg p-5">
        <div className="relative z-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="h-3 w-36 animate-pulse rounded-full bg-cyan-racing/18" />
              <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-white/10" />
            </div>
            <div className="hidden h-11 w-32 animate-pulse rounded-lg border border-cyan-racing/18 bg-cyan-racing/8 sm:block" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="mb-4 h-9 w-9 animate-pulse rounded-lg bg-white/10" />
                <div className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
                <div className="mt-3 h-7 w-20 animate-pulse rounded-lg bg-white/12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="premium-panel rounded-lg p-4"
          >
            <div className="relative z-10">
              <span className="sr-only">Loading card {index + 1}</span>
              <div className="mb-5 h-28 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
                <div className="h-full w-full animate-scanline bg-gradient-to-b from-transparent via-cyan-racing/10 to-transparent" />
              </div>
              <div className="space-y-3">
                {skeletonRows.map((width) => (
                  <div key={width} className={`h-3 animate-pulse rounded-full bg-white/10 ${width}`} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
