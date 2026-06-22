import { RaceIntelligenceEngine } from "@/components/predictor/race-intelligence-engine";
import { PageHeader } from "@/components/shared/page-header";

export default function PredictorPage() {
  return (
    <div>
      <PageHeader
        description="Configure race conditions, select participants, and run an explainable weighted model for estimated win probability, podium probability, confidence, risk, and reasoning."
        eyebrow="Race Intelligence Engine"
        title="Predictor"
      />
      <RaceIntelligenceEngine />
    </div>
  );
}
