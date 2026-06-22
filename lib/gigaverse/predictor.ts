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

  if (gigling.bestWeather === input.weather) {
    score += 18;
  }

  if (["rainy", "stormy"].includes(input.weather) || ["wet", "muddy", "icy"].includes(input.trackCondition)) {
    score += Math.max(0, gigling.stats.handling - 72) * 0.35;
  }

  if (input.trackCondition === "chaotic") {
    score += Math.max(0, gigling.stats.luck - 70) * 0.45;
  }

  return Math.min(100, score);
}

function weightedScore(gigling: Gigling, input: PredictionInput) {
  const stats = gigling.stats;
  let score =
    stats.speed * 0.25 +
    stats.stamina * 0.2 +
    stats.handling * 0.15 +
    stats.consistency * 0.15 +
    stats.luck * 0.1 +
    conditionFit(gigling, input) * 0.15;

  if (input.distance === "sprint") {
    score += stats.speed * 0.05 + stats.acceleration * 0.08;
  }

  if (input.distance === "long" || input.distance === "marathon") {
    score += stats.stamina * 0.07 + stats.consistency * 0.05;
  }

  if (["rainy", "stormy"].includes(input.weather) || ["wet", "muddy"].includes(input.trackCondition)) {
    score += stats.handling * 0.05;
  }

  if (input.trackCondition === "chaotic") {
    score += stats.luck * 0.06;
  }

  if (gigling.bestWeather === input.weather) {
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

  if (gigling.bestWeather === input.weather) {
    reasons.push(`Its best weather is ${input.weather}, matching this race.`);
  }

  if (input.distance === "sprint" && gigling.stats.acceleration >= 85) {
    reasons.push("High acceleration gives it a strong launch profile.");
  }

  if ((input.distance === "long" || input.distance === "marathon") && gigling.stats.stamina >= 85) {
    reasons.push("Strong stamina protects the late split.");
  }

  if (["wet", "muddy", "icy"].includes(input.trackCondition) && gigling.stats.handling >= 85) {
    reasons.push("High handling lowers weather and track-condition risk.");
  }

  if (input.trackCondition === "chaotic" && gigling.stats.luck >= 80) {
    reasons.push("Luck is high enough to benefit from chaotic item variance.");
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
          : input.trackCondition === "chaotic" || confidence < 64
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
    input.trackCondition === "chaotic"
      ? 92
      : ["muddy", "icy"].includes(input.trackCondition)
        ? 76
        : ["stormy", "foggy"].includes(input.weather)
          ? 68
          : 38;
  const fieldVolatility = Math.round((riskPressure + conditionPressure) / 2);
  const fieldWarning =
    input.trackCondition === "chaotic"
      ? "Chaotic tracks increase item and luck variance, so confidence should be treated carefully."
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
