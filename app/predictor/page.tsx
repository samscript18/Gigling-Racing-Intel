import { DataTable, type DataTableColumn } from "@/components/shared/data-table";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import { runRacePrediction } from "@/lib/gigaverse/predictor";
import { mockGiglings, mockPredictionExamples } from "@/lib/gigaverse/mock-data";
import { formatPercent } from "@/lib/utils/format";
import type { PredictionParticipantResult } from "@/types";

export default function PredictorPage() {
  const sample = mockPredictionExamples[0];
  const modelResult = runRacePrediction(sample.input, mockGiglings);
  const topPick = modelResult.participants[0];
  const columns: DataTableColumn<PredictionParticipantResult>[] = [
    {
      header: "Gigling",
      cell: (row) => row.giglingName
    },
    {
      header: "Win",
      cell: (row) => formatPercent(row.estimatedWinProbability)
    },
    {
      header: "Podium",
      cell: (row) => formatPercent(row.estimatedPodiumProbability)
    },
    {
      header: "Risk",
      cell: (row) => row.riskLevel
    },
    {
      header: "Confidence",
      cell: (row) => `${row.confidence}/100`
    }
  ];

  return (
    <div>
      <PageHeader
        description="A first-pass Race Intelligence Engine is wired with the requested explainable weighted model. Task 08 will add full interactive inputs and participant selection."
        eyebrow="Race Intelligence Engine"
        title="Predictor"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard detail={topPick?.giglingName ?? "Add entrants"} icon="trophy" label="Suggested Pick" tone="orange" value={topPick ? formatPercent(topPick.estimatedWinProbability) : "0%"} />
        <MetricCard detail={`${sample.input.distance} / ${sample.input.weather}`} icon="radar" label="Sample Race" value={sample.input.trackCondition} />
        <MetricCard detail="Weighted scoring model" icon="gauge" label="Confidence" tone="emerald" value={`${modelResult.confidence}/100`} />
        <MetricCard detail="No guaranteed accuracy claims" icon="alert" label="Warnings" tone="violet" value={`${modelResult.warnings.length}`} />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Ranked by estimated win probability with podium, risk, and confidence." title="Ranked Results" />
            <DataTable columns={columns} data={modelResult.participants} getRowKey={(row) => row.giglingId} />
          </div>
        </section>

        <section className="premium-panel rounded-lg p-5">
          <div className="relative z-10">
            <SectionHeader description="Plain-English model reasoning for the current top pick." title="Why This Pick" />
            <p className="rounded-lg border border-cyan-racing/20 bg-cyan-racing/8 p-4 text-sm leading-6 text-white/68">
              {modelResult.summary}
            </p>
            <div className="mt-4 space-y-3">
              {topPick?.reasons.map((reason) => (
                <p key={reason} className="rounded-lg border border-white/10 bg-white/[0.035] p-3 text-sm leading-6 text-white/58">
                  {reason}
                </p>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {modelResult.warnings.map((warning) => (
                <p key={warning} className="text-sm leading-6 text-orange-racing">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
