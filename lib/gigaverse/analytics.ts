import type {
  FactionPerformance,
  Gigling,
  GiglingFaction,
  Race,
  RaceDistance,
  RaceWeather,
  StableLeaderboardEntry,
  TrackCondition
} from "@/types";

const weatherOrder: RaceWeather[] = ["sunny", "rainy", "stormy", "foggy", "windy"];
const distanceOrder: RaceDistance[] = ["sprint", "medium", "long", "marathon"];

export function getHighestWinRateGigling(giglings: Gigling[]) {
  return [...giglings].sort((first, second) => second.winRate - first.winRate)[0];
}

export function getTopFaction(performance: FactionPerformance[]) {
  return [...performance].sort((first, second) => second.winRate - first.winRate)[0];
}

export function getStableLeaderboard(giglings: Gigling[]): StableLeaderboardEntry[] {
  const grouped = new Map<string, Gigling[]>();

  for (const gigling of giglings) {
    if (gigling.ownerAddress === "0x0000000000000000000000000000000000000000") {
      continue;
    }

    grouped.set(gigling.ownerAddress, [
      ...(grouped.get(gigling.ownerAddress) ?? []),
      gigling
    ]);
  }

  return [...grouped.entries()]
    .map(([ownerAddress, stableGiglings]) => {
      const totalRaces = stableGiglings.reduce(
        (total, gigling) => total + gigling.totalRaces,
        0
      );
      const totalWins = stableGiglings.reduce(
        (total, gigling) => total + gigling.wins,
        0
      );
      const bestGigling = [...stableGiglings].sort(
        (first, second) => second.winRate - first.winRate
      )[0];

      return {
        id: `stable-${ownerAddress}`,
        ownerAddress,
        ownerName: stableGiglings.find((gigling) => gigling.ownerName)?.ownerName,
        stableSize: stableGiglings.length,
        totalRaces,
        totalWins,
        winRate:
          totalRaces > 0 ? Number(((totalWins / totalRaces) * 100).toFixed(1)) : 0,
        totalEarnings: stableGiglings.reduce(
          (total, gigling) => total + gigling.earnings,
          0
        ),
        bestGiglingName: bestGigling?.name ?? "Unavailable"
      } satisfies StableLeaderboardEntry;
    })
    .sort(
      (first, second) =>
        second.totalWins - first.totalWins ||
        second.winRate - first.winRate ||
        second.totalEarnings - first.totalEarnings
    );
}

export function getFactionPerformanceFromRaces(races: Race[]): FactionPerformance[] {
  const factions: GiglingFaction[] = [
    "crusader",
    "overseer",
    "athena",
    "archon",
    "foxglove",
    "summoner",
    "chobo",
    "gigus"
  ];
  const completedParticipants = races
    .filter((race) => race.status === "completed")
    .flatMap((race) => race.participants)
    .filter((participant) => typeof participant.finalPosition === "number");

  return factions.map((faction) => {
    const entries = completedParticipants.filter(
      (participant) => participant.faction === faction
    );
    const wins = entries.filter((participant) => participant.finalPosition === 1).length;
    const podiums = entries.filter(
      (participant) =>
        typeof participant.finalPosition === "number" && participant.finalPosition <= 3
    ).length;
    const placementTotal = entries.reduce(
      (total, participant) => total + (participant.finalPosition ?? 0),
      0
    );

    return {
      faction,
      races: entries.length,
      wins,
      winRate: Number(((wins / Math.max(entries.length, 1)) * 100).toFixed(1)),
      podiumRate: Number(((podiums / Math.max(entries.length, 1)) * 100).toFixed(1)),
      averagePlacement: Number((placementTotal / Math.max(entries.length, 1)).toFixed(2))
    };
  });
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

export function getGiglingStatRadarData(gigling: Gigling) {
  return Object.entries(gigling.stats).map(([stat, value]) => ({
    stat: getConditionLabel(stat),
    value
  }));
}

export function getGiglingPerformanceByWeather(giglingId: string, races: Race[]) {
  const history = getGiglingRaceHistory(giglingId, races).filter(
    ({ participant }) => typeof participant.finalPosition === "number"
  );

  return weatherOrder.map((weather) => {
    const entries = history.filter(({ race }) => race.weather === weather);
    const wins = entries.filter(({ participant }) => participant.finalPosition === 1).length;
    const podiums = entries.filter(
      ({ participant }) =>
        typeof participant.finalPosition === "number" && participant.finalPosition <= 3
    ).length;
    const scoreTotal = entries.reduce(
      (total, { participant }) => total + (participant.performanceScore ?? 0),
      0
    );

    return {
      label: getConditionLabel(weather),
      races: entries.length,
      wins,
      podiums,
      winRate: Number(((wins / Math.max(entries.length, 1)) * 100).toFixed(1)),
      podiumRate: Number(((podiums / Math.max(entries.length, 1)) * 100).toFixed(1)),
      averageScore: Number((scoreTotal / Math.max(entries.length, 1)).toFixed(1))
    };
  });
}

export function getGiglingPerformanceByDistance(giglingId: string, races: Race[]) {
  const history = getGiglingRaceHistory(giglingId, races).filter(
    ({ participant }) => typeof participant.finalPosition === "number"
  );

  return distanceOrder.map((distance) => {
    const entries = history.filter(({ race }) => race.distance === distance);
    const wins = entries.filter(({ participant }) => participant.finalPosition === 1).length;
    const podiums = entries.filter(
      ({ participant }) =>
        typeof participant.finalPosition === "number" && participant.finalPosition <= 3
    ).length;
    const placementTotal = entries.reduce(
      (total, { participant }) => total + (participant.finalPosition ?? 0),
      0
    );

    return {
      label: getConditionLabel(distance),
      races: entries.length,
      wins,
      podiums,
      winRate: Number(((wins / Math.max(entries.length, 1)) * 100).toFixed(1)),
      podiumRate: Number(((podiums / Math.max(entries.length, 1)) * 100).toFixed(1)),
      averagePlacement: Number(
        (placementTotal / Math.max(entries.length, 1)).toFixed(2)
      )
    };
  });
}

export function getGiglingIntelligenceSummary(gigling: Gigling, races: Race[]) {
  const history = getGiglingRaceHistory(gigling.id, races);
  const completedHistory = history.filter(
    ({ participant }) => typeof participant.finalPosition === "number"
  );
  const bestStat = Object.entries(gigling.stats).sort(
    ([, first], [, second]) => second - first
  )[0];
  const averagePlacement =
    completedHistory.reduce(
      (total, { participant }) => total + (participant.finalPosition ?? 0),
      0
    ) / Math.max(completedHistory.length, 1);
  const itemExposure = completedHistory.reduce(
    (total, { race }) =>
      total +
      race.participants.reduce(
        (raceTotal, participant) => raceTotal + participant.itemsUsed.length,
        0
      ),
    0
  );

  return {
    headline: `${gigling.name} profiles as a ${gigling.bestDistance} specialist with its clearest edge in ${gigling.bestWeather} weather.`,
    bullets: [
      `${getConditionLabel(bestStat[0])} is the peak stat at ${bestStat[1]}/100.`,
      `Average completed placement in indexed races is P${averagePlacement.toFixed(2)}.`,
      itemExposure > 0
        ? `It has raced through ${itemExposure} recorded item actions, so variance history is meaningful.`
        : "Item exposure is limited, so current projections lean more heavily on stats."
    ]
  };
}

export function getRecommendedRaceConditions(gigling: Gigling) {
  const recommendations = [
    {
      label: `${getConditionLabel(gigling.bestDistance)} races`,
      description: `Primary distance fit based on historical performance and stat shape.`
    },
    {
      label: `${getConditionLabel(gigling.bestWeather)} weather`,
      description: "Best weather signal from its indexed career profile."
    }
  ];

  if (gigling.stats.handling >= 85) {
    recommendations.push({
      label: "Wet or technical tracks",
      description: "High handling should protect placement on wet, muddy, or icy tracks."
    });
  }

  if (gigling.stats.acceleration >= 88) {
    recommendations.push({
      label: "High-pressure sprint lobbies",
      description: "Launch speed can create early lane control before item pressure spikes."
    });
  }

  if (gigling.stats.consistency >= 86) {
    recommendations.push({
      label: "Low-variance prize races",
      description: "Consistency makes the Gigling more reliable when the field is evenly matched."
    });
  }

  return recommendations.slice(0, 4);
}

export function getGiglingRiskWarnings(gigling: Gigling) {
  const warnings: string[] = [];

  if (gigling.currentStreak < 0) {
    warnings.push(
      `Recent form is negative (${gigling.currentStreak}), so avoid overpaying entry fees until it stabilizes.`
    );
  }

  if (gigling.stats.handling < 75) {
    warnings.push("Handling is below 75, making wet, muddy, or icy tracks a riskier entry.");
  }

  if (gigling.stats.luck < 70) {
    warnings.push("Luck is below 70, so chaotic tracks and sabotage-heavy fields can swing against it.");
  }

  if (gigling.bestDistance === "sprint" && gigling.stats.stamina < 76) {
    warnings.push("Sprint profile is strong, but longer races can expose stamina late.");
  }

  if (warnings.length === 0) {
    warnings.push("No severe red flags from the current indexed profile; still account for item timing and live field strength.");
  }

  return warnings;
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

export function getRaceFieldSummary(race: Race, giglings: Gigling[]) {
  const fieldGiglings = race.participants
    .map((participant) => giglings.find((gigling) => gigling.id === participant.giglingId))
    .filter((gigling): gigling is Gigling => Boolean(gigling));
  const averageWinRate =
    fieldGiglings.reduce((total, gigling) => total + gigling.winRate, 0) /
    Math.max(fieldGiglings.length, 1);
  const favorite = [...fieldGiglings].sort(
    (first, second) => second.winRate - first.winRate
  )[0];
  const itemCount = race.participants.reduce(
    (total, participant) => total + participant.itemsUsed.length,
    0
  );
  const conditionRisk =
    race.trackCondition === "chaotic" ||
    race.weather === "stormy" ||
    race.trackCondition === "icy"
      ? "high"
      : race.weather === "rainy" || race.trackCondition === "muddy"
        ? "medium"
        : "low";

  return {
    averageWinRate: Number(averageWinRate.toFixed(1)),
    favorite,
    itemCount,
    conditionRisk,
    summary:
      conditionRisk === "high"
        ? "This race carried elevated variance because harsh conditions increased the value of luck, handling, and item timing."
        : conditionRisk === "medium"
          ? "This race rewarded condition fit more than raw speed because the surface or weather introduced technical pressure."
          : "This race leaned cleaner, so baseline stats and lane execution were easier to trust."
  };
}

export function getRaceLoserCandidate(race: Race, giglings: Gigling[]) {
  const placedLosers = race.participants
    .filter((participant) => participant.finalPosition && participant.finalPosition > 1)
    .sort((first, second) => {
      const firstGigling = giglings.find((gigling) => gigling.id === first.giglingId);
      const secondGigling = giglings.find((gigling) => gigling.id === second.giglingId);

      return (secondGigling?.winRate ?? 0) - (firstGigling?.winRate ?? 0);
    });
  const selectedParticipant = placedLosers[0];

  if (!selectedParticipant) {
    return undefined;
  }

  const gigling = giglings.find((entry) => entry.id === selectedParticipant.giglingId);

  if (!gigling) {
    return undefined;
  }

  return {
    participant: selectedParticipant,
    gigling
  };
}

export function getSimilarRaces(race: Race, races: Race[]) {
  return races
    .filter((entry) => entry.id !== race.id)
    .map((entry) => {
      const score =
        (entry.distance === race.distance ? 3 : 0) +
        (entry.weather === race.weather ? 2 : 0) +
        (entry.trackCondition === race.trackCondition ? 2 : 0) +
        (entry.status === race.status ? 1 : 0);

      return {
        race: entry,
        score
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 3)
    .map((entry) => entry.race);
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
    chaotic: 88,
    unknown: 0
  };
  const weatherWeight: Record<RaceWeather, number> = {
    sunny: 28,
    windy: 46,
    rainy: 62,
    foggy: 69,
    stormy: 82,
    unknown: 0
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
      cancelled: 0,
      unknown: 0
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

export function getRarityPerformanceData(races: Race[]) {
  const completedParticipants = races
    .filter((race) => race.status === "completed")
    .flatMap((race) => race.participants)
    .filter((participant) => typeof participant.finalPosition === "number");
  const rarities = ["common", "uncommon", "rare", "epic", "legendary"] as const;

  return rarities.map((rarity) => {
    const entries = completedParticipants.filter(
      (participant) => participant.rarity === rarity
    );
    const wins = entries.filter((participant) => participant.finalPosition === 1).length;
    const podiums = entries.filter(
      (participant) =>
        typeof participant.finalPosition === "number" && participant.finalPosition <= 3
    ).length;
    const scoreTotal = entries.reduce(
      (total, participant) => total + (participant.performanceScore ?? 0),
      0
    );

    return {
      rarity: getConditionLabel(rarity),
      races: entries.length,
      wins,
      podiums,
      winRate: Number(((wins / Math.max(entries.length, 1)) * 100).toFixed(1)),
      podiumRate: Number(((podiums / Math.max(entries.length, 1)) * 100).toFixed(1)),
      averageScore: Number((scoreTotal / Math.max(entries.length, 1)).toFixed(1))
    };
  });
}

export function getWeatherImpactData(races: Race[]) {
  return weatherOrder.map((weather) => {
    const matchingRaces = races.filter(
      (race) => race.status === "completed" && race.weather === weather
    );
    const participants = matchingRaces.flatMap((race) => race.participants);
    const scoreTotal = participants.reduce(
      (total, participant) => total + (participant.performanceScore ?? 0),
      0
    );
    const itemPressure = matchingRaces.reduce(
      (total, race) =>
        total +
        race.participants.reduce(
          (participantTotal, participant) => participantTotal + participant.itemsUsed.length,
          0
        ),
      0
    );

    return {
      weather: getConditionLabel(weather),
      races: matchingRaces.length,
      averageScore: Number((scoreTotal / Math.max(participants.length, 1)).toFixed(1)),
      itemPressure,
      volatility: Number(
        ((itemPressure / Math.max(matchingRaces.length, 1)) * 12 +
          (weather === "stormy" ? 36 : weather === "foggy" ? 28 : weather === "rainy" ? 20 : 12)).toFixed(1)
      )
    };
  });
}

export function getDistanceImpactData(races: Race[]) {
  return distanceOrder.map((distance) => {
    const matchingRaces = races.filter(
      (race) => race.status === "completed" && race.distance === distance
    );
    const participants = matchingRaces.flatMap((race) => race.participants);
    const scoreTotal = participants.reduce(
      (total, participant) => total + (participant.performanceScore ?? 0),
      0
    );
    const prizeTotal = matchingRaces.reduce((total, race) => total + race.prizePool, 0);
    const averageWinnerScore =
      matchingRaces.reduce((total, race) => {
        const winner = race.participants.find(
          (participant) => participant.finalPosition === 1
        );

        return total + (winner?.performanceScore ?? 0);
      }, 0) / Math.max(matchingRaces.length, 1);

    return {
      distance: getConditionLabel(distance),
      races: matchingRaces.length,
      averageScore: Number((scoreTotal / Math.max(participants.length, 1)).toFixed(1)),
      averagePrize: Number((prizeTotal / Math.max(matchingRaces.length, 1)).toFixed(1)),
      winnerScore: Number(averageWinnerScore.toFixed(1))
    };
  });
}

export function getTrackConditionTrendData(races: Race[]) {
  const trackOrder: TrackCondition[] = ["dry", "wet", "muddy", "icy", "chaotic"];

  return trackOrder.map((trackCondition) => {
    const matchingRaces = races.filter(
      (race) =>
        race.status === "completed" && race.trackCondition === trackCondition
    );
    const participants = matchingRaces.flatMap((race) => race.participants);
    const podiumScores = participants.filter(
      (participant) =>
        typeof participant.finalPosition === "number" && participant.finalPosition <= 3
    );
    const upsetCount = matchingRaces.filter((race) => {
      const winner = race.participants.find(
        (participant) => participant.finalPosition === 1
      );
      const favorite = [...race.participants].sort(
        (first, second) =>
          (second.performanceScore ?? 0) - (first.performanceScore ?? 0)
      )[0];

      return Boolean(winner && favorite && winner.giglingId !== favorite.giglingId);
    }).length;

    return {
      trackCondition: getConditionLabel(trackCondition),
      races: matchingRaces.length,
      podiumScores: podiumScores.length,
      upsetRate: Number(
        ((upsetCount / Math.max(matchingRaces.length, 1)) * 100).toFixed(1)
      ),
      technicalLoad: Number(
        (((trackCondition === "chaotic" ? 90 : trackCondition === "icy" ? 82 : trackCondition === "muddy" ? 72 : trackCondition === "wet" ? 62 : 38) +
          podiumScores.length * 2) /
          1).toFixed(1)
      )
    };
  });
}

export function getWeeklyTrendSummary(races: Race[], performance: FactionPerformance[]) {
  const topFaction = getTopFaction(performance);
  const conditionTrend = getRaceConditionTrend(races);
  const volatilityAverage =
    conditionTrend.reduce((total, entry) => total + entry.conditionScore, 0) /
    Math.max(conditionTrend.length, 1);
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
    title: `${getConditionLabel(topFaction.faction)} is setting the pace`,
    description: `${getConditionLabel(topFaction.faction)} owns the strongest faction win rate at ${topFaction.winRate}%, while recent race volatility averages ${volatilityAverage.toFixed(1)}/100 across the latest completed samples.`,
    bullets: [
      `${itemPressure} recorded item actions are shaping current race variance.`,
      `Podium conversion is the better signal than raw wins in volatile tracks.`,
      `Condition fit is most important when stormy, foggy, muddy, icy, or chaotic tags stack.`
    ]
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
  value: GiglingFaction | RaceDistance | RaceWeather | TrackCondition | string
) {
  return value
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}
