import type {
  Gigling,
  PredictionInput,
  PredictionParticipantResult,
  PredictionResult
} from "@/types";

function conditionFit(gigling: Gigling, input: PredictionInput) {
  let score = 50;

  if (gigling.bestDistance === input.distance) {
    score += 22;
  }

  if (gigling.bestTrackCondition === input.trackCondition) {
    score += 18;
  }

  if (input.trackCondition === "cold" || input.trackCondition === "hot") {
    score += Math.max(0, gigling.stats.finish - 72) * 0.35;
  }

  return Math.min(100, score);
}

function weightedScore(gigling: Gigling, input: PredictionInput) {
  const stats = gigling.stats;
  let score =
    stats.start * 0.2 +
    stats.speed * 0.25 +
    stats.stamina * 0.2 +
    stats.finish * 0.2 +
    conditionFit(gigling, input) * 0.15;

  if (input.distance === "sprint") {
    score += stats.speed * 0.05 + stats.start * 0.08;
  }

  if (input.distance === "long" || input.distance === "marathon") {
    score += stats.stamina * 0.07 + stats.finish * 0.05;
  }

  if (input.trackCondition === "cold" || input.trackCondition === "hot") {
    score += stats.finish * 0.05;
  }

  if (gigling.bestTrackCondition === input.trackCondition) {
    score += 4;
  } else {
    score -= 2;
  }

  if (gigling.currentStreak > 0) {
    score += Math.min(4, gigling.currentStreak);
  }

  if (gigling.currentStreak < 0) {
    score += Math.max(-4, gigling.currentStreak);
  }

  return Math.max(1, score);
}

function buildReasons(gigling: Gigling, input: PredictionInput) {
  const reasons: string[] = [];

  if (gigling.bestDistance === input.distance) {
    reasons.push(`${gigling.name} has proven fit at ${input.distance} distance.`);
  }

  if (gigling.bestTrackCondition === input.trackCondition) {
    reasons.push(`Its best condition is ${input.trackCondition}, matching this race.`);
  }

  if (input.distance === "sprint" && gigling.stats.start >= 85) {
    reasons.push("High start gives it a strong launch profile.");
  }

  if ((input.distance === "long" || input.distance === "marathon") && gigling.stats.stamina >= 85) {
    reasons.push("Strong stamina protects the late split.");
  }

  if ((input.trackCondition === "cold" || input.trackCondition === "hot") && gigling.stats.finish >= 85) {
    reasons.push("High finish control lowers condition mismatch risk.");
  }

  if (gigling.currentStreak > 0) {
    reasons.push(`Recent form is positive with a ${gigling.currentStreak}-race streak.`);
  }

  if (reasons.length === 0) {
    reasons.push("The estimate is driven by balanced baseline stats rather than a standout condition match.");
  }

  return reasons;
}

export function runRacePrediction(
  input: PredictionInput,
  giglings: Gigling[]
): PredictionResult {
  const participants = input.participantGiglingIds
    .map((id) => giglings.find((gigling) => gigling.id === id))
    .filter((gigling): gigling is Gigling => Boolean(gigling));

  const scored = participants.map((gigling) => ({
    gigling,
    score: weightedScore(gigling, input)
  }));
  const totalScore = scored.reduce((total, entry) => total + entry.score, 0);

  const results: PredictionParticipantResult[] = scored
    .map(({ gigling, score }) => {
      const winProbability = (score / Math.max(totalScore, 1)) * 100;
      const podiumProbability = Math.min(94, winProbability * 2.45 + gigling.podiumRate * 0.25);
      const confidence = Math.min(
        92,
        48 + conditionFit(gigling, input) * 0.22 + Math.max(0, gigling.currentStreak) * 3
      );
      const riskLevel: PredictionParticipantResult["riskLevel"] =
        gigling.currentStreak < -1 || conditionFit(gigling, input) < 55
          ? "high"
          : input.trackCondition !== "average" || confidence < 64
            ? "medium"
            : "low";

      return {
        giglingId: gigling.id,
        giglingName: gigling.name,
        estimatedWinProbability: Number(winProbability.toFixed(1)),
        estimatedPodiumProbability: Number(podiumProbability.toFixed(1)),
        riskLevel,
        confidence: Number(confidence.toFixed(0)),
        reasons: buildReasons(gigling, input)
      };
    })
    .sort(
      (first, second) =>
        second.estimatedWinProbability - first.estimatedWinProbability
    );

  const topPick = results[0];
  const secondPick = results[1];
  const topPickEdge = topPick
    ? Number(
        (topPick.estimatedWinProbability - (secondPick?.estimatedWinProbability ?? 0)).toFixed(1)
      )
    : 0;
  const riskPressure = results.reduce(
    (total, result) =>
      total + (result.riskLevel === "high" ? 90 : result.riskLevel === "medium" ? 58 : 28),
    0
  ) / Math.max(results.length, 1);
  const conditionPressure =
    input.trackCondition === "hot" || input.trackCondition === "cold" ? 68 : 38;
  const fieldVolatility = Math.round((riskPressure + conditionPressure) / 2);
  const fieldWarning =
    input.trackCondition === "hot" || input.trackCondition === "cold"
      ? "Hot or cold conditions can expose condition mismatches, so confidence should be treated carefully."
      : "Prediction is directional and explainable, not a guarantee.";

  return {
    input,
    participants: results,
    topPickGiglingId: topPick?.giglingId ?? "",
    confidence: topPick?.confidence ?? 0,
    fieldVolatility,
    topPickEdge,
    recommendation: topPick
      ? topPick.confidence >= 72 && topPickEdge >= 3 && topPick.riskLevel !== "high"
        ? `${topPick.giglingName} has a meaningful model edge, but confirm live eligibility and entry cost before entering.`
        : `The field is tightly matched or volatile. Treat ${topPick.giglingName} as a watchlist leader rather than an automatic entry.`
      : "Add a complete field before making an entry decision.",
    summary: topPick
      ? `${topPick.giglingName} is the model's current top pick with ${topPick.estimatedWinProbability}% estimated win probability.`
      : "Add at least one Gigling to generate a prediction.",
    warnings: [
      fieldWarning,
      "Resolver items, late field changes, and future Gigaverse mechanic updates can change the final outcome."
    ]
  };
}
