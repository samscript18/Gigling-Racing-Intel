"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

import { ErrorState } from "@/components/shared/error-state";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      action={
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-cyan-racing/35 bg-cyan-racing/10 px-4 text-sm font-bold text-cyan-racing transition hover:bg-cyan-racing/16"
          type="button"
          onClick={reset}
        >
          <RotateCcw className="h-4 w-4" />
          Retry live data
        </button>
      }
      description={error.message || "Gigaverse could not complete this live racing request."}
      title="Live racing data unavailable"
    />
  );
}
