import { FlagOff, Gauge } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16">
      <section className="premium-panel w-full rounded-lg p-6 text-center sm:p-8">
        <div className="relative z-10 mx-auto max-w-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-orange-racing/30 bg-orange-racing/10 text-orange-racing shadow-orange-glow">
            <FlagOff className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.26em] text-cyan-racing">
            Race Intel Missing
          </p>
          <h1 className="mt-3 text-3xl font-black text-white sm:text-5xl">
            This racing lane does not exist.
          </h1>
          <p className="mt-4 text-sm leading-6 text-white/58">
            The route, Gigling, or race you opened is not available in the current
            indexed feed. Head back to the dashboard and pick up the trail from
            live race intel.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 py-3 text-sm font-black text-cyan-racing transition hover:bg-cyan-racing/16"
              href="/dashboard"
            >
              <Gauge className="h-4 w-4" />
              Open dashboard
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white/70 transition hover:border-white/18 hover:text-white"
              href="/races"
            >
              Browse races
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
