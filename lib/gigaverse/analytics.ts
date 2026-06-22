import type {
  FactionPerformance,
  Gigling,
  GiglingFaction,
  Race,
  RaceDistance,
  RaceWeather,
  TrackCondition
} from "@/types";

export function getHighestWinRateGigling(giglings: Gigling[]) {
  return [...giglings].sort((first, second) => second.winRate - first.winRate)[0];
}

export function getTopFaction(performance: FactionPerformance[]) {
  return [...performance].sort((first, second) => second.winRate - first.winRate)[0];
}

export function getGiglingRaceHistory(giglingId: string, races: Race[]) {
  return races
    .filter((race) =>
      race.participants.some((participant) => participant.giglingId === giglingId)
    )
    .map((race) => ({
      race,
      participant: race.participants.find(
        (participant) => participant.giglingId === giglingId
      )
    }))
    .filter((entry): entry is {
      race: Race;
      participant: NonNullable<(typeof entry)["participant"]>;
    } => Boolean(entry.participant));
}

export function getRaceWinner(race: Race, giglings: Gigling[]) {
  if (!race.winnerGiglingId) {
    return undefined;
  }

  return giglings.find((gigling) => gigling.id === race.winnerGiglingId);
}

export function summarizeConditionFit(gigling: Gigling, race: Race) {
  const matches: string[] = [];

  if (gigling.bestDistance === race.distance) {
    matches.push(`${race.distance} distance`);
  }

  if (gigling.bestWeather === race.weather) {
    matches.push(`${race.weather} weather`);
  }

  if (["wet", "muddy", "icy"].includes(race.trackCondition) && gigling.stats.handling >= 85) {
    matches.push("high handling");
  }

  if (race.trackCondition === "chaotic" && gigling.stats.luck >= 80) {
    matches.push("chaos-ready luck");
  }

  return matches;
}

export function explainWinner(race: Race, winner: Gigling) {
  const conditionFit = summarizeConditionFit(winner, race);
  const strongestStat = Object.entries(winner.stats).sort(
    ([, first], [, second]) => second - first
  )[0];

  return [
    `${winner.name} won because its ${strongestStat[0]} profile was elite at ${strongestStat[1]}/100.`,
    conditionFit.length > 0
      ? `The race also matched ${conditionFit.join(", ")}.`
      : "The win came from raw stat quality more than perfect condition fit.",
    winner.currentStreak > 0
      ? `A positive ${winner.currentStreak}-race streak added form confidence.`
      : "Recent form was not the main driver."
  ];
}

export function explainLoss(race: Race, gigling: Gigling) {
  const conditionFit = summarizeConditionFit(gigling, race);
  const participant = race.participants.find((entry) => entry.giglingId === gigling.id);
  const placement = participant?.finalPosition;
  const itemPressure = race.participants.flatMap((entry) => entry.itemsUsed).length;

  return [
    placement
      ? `${gigling.name} finished P${placement}, which suggests the field punished at least one weakness.`
      : `${gigling.name} has not finished this race yet.`,
    conditionFit.length === 0
      ? "The race conditions did not match its strongest weather or distance profile."
      : `It had useful fit in ${conditionFit.join(", ")}, but not enough to overcome the field.`,
    itemPressure > 0
      ? `${itemPressure} item actions created extra variance in the race.`
      : "Item pressure was low, so stat and condition fit mattered more."
  ];
}

export function countRacesByCondition(
  races: Race[],
  key: "weather" | "distance" | "trackCondition"
) {
  return races.reduce<Record<string, number>>((totals, race) => {
    const label = race[key];
    totals[label] = (totals[label] ?? 0) + 1;
    return totals;
  }, {});
}

export function getFactionDashboardData(performance: FactionPerformance[]) {
  return performance.map((entry) => ({
    faction: getConditionLabel(entry.faction),
    winRate: entry.winRate,
    podiumRate: entry.podiumRate,
    averagePlacement: entry.averagePlacement,
    races: entry.races
  }));
}

export function getRaceConditionTrend(races: Race[]) {
  const trackWeight: Record<TrackCondition, number> = {
    dry: 34,
    wet: 58,
    muddy: 66,
    icy: 74,
    chaotic: 88
  };
  const weatherWeight: Record<RaceWeather, number> = {
    sunny: 28,
    windy: 46,
    rainy: 62,
    foggy: 69,
    stormy: 82
  };

  return [...races]
    .filter((race) => race.status === "completed")
    .sort(
      (first, second) =>
        new Date(first.startedAt ?? 0).getTime() - new Date(second.startedAt ?? 0).getTime()
    )
    .slice(-10)
    .map((race) => {
      const itemPressure = race.participants.flatMap(
        (participant) => participant.itemsUsed
      ).length;
      const conditionScore = Math.min(
        100,
        (trackWeight[race.trackCondition] + weatherWeight[race.weather]) / 2 +
          itemPressure * 4
      );

      return {
        raceLabel: `#${race.raceNumber}`,
        conditionScore: Number(conditionScore.toFixed(1)),
        itemPressure,
        prizePool: race.prizePool,
        weather: race.weather,
        trackCondition: race.trackCondition,
        distance: race.distance
      };
    });
}

export function getDashboardRaceMix(races: Race[]) {
  const statusCounts = races.reduce<Record<Race["status"], number>>(
    (totals, race) => ({
      ...totals,
      [race.status]: totals[race.status] + 1
    }),
    {
      scheduled: 0,
      live: 0,
      completed: 0,
      cancelled: 0
    }
  );
  const completed = races.filter((race) => race.status === "completed");
  const totalPrizePool = races.reduce((total, race) => total + race.prizePool, 0);
  const itemPressure = races.reduce(
    (total, race) =>
      total +
      race.participants.reduce(
        (participantTotal, participant) => participantTotal + participant.itemsUsed.length,
        0
      ),
    0
  );

  return {
    statusCounts,
    completedCount: completed.length,
    totalPrizePool,
    itemPressure
  };
}

export function getTopEmergingGiglings(giglings: Gigling[]) {
  return [...giglings]
    .filter((gigling) => gigling.totalRaces >= 15)
    .sort(
      (first, second) =>
        second.currentStreak - first.currentStreak ||
        second.podiumRate - first.podiumRate
    )
    .slice(0, 5);
}

export function getConditionLabel(
  value: GiglingFaction | RaceDistance | RaceWeather | TrackCondition
) {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
