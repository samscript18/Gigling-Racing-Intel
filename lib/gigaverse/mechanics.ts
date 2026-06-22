export const racingMechanics = {
  confidence: {
    label: "Prediction confidence",
    explanation:
      "Confidence measures how complete and internally consistent the selected Giglings' live racing profiles are. It is not an accuracy guarantee.",
    strategy:
      "Treat low-confidence rankings as scouting prompts and prefer fields with deeper race history."
  },
  distance: {
    label: "Race distance",
    explanation:
      "Distance is normalized from the live track length. Short fields reward launch speed, while longer fields put more pressure on stamina and consistency.",
    strategy:
      "Compare the race distance with each Gigling's strongest indexed distance before entering."
  },
  eligibility: {
    label: "Race eligibility",
    explanation:
      "PetRacingSystem canPetRace combines active locks, cooldowns, career limits, and daily limits into one live contract check.",
    strategy:
      "Run this check before planning an entry so a strong matchup does not become a reverted transaction."
  },
  faction: {
    label: "Faction performance",
    explanation:
      "Faction is resolver metadata attached to Gigling Racing. This app measures observed win and podium conversion without assuming a guaranteed faction bonus.",
    strategy:
      "Use faction trends as a field-level signal, then confirm with the individual Gigling's stats and history."
  },
  items: {
    label: "Race items",
    explanation:
      "Items are offchain race actions such as boosts, sabotage, defense, and utility effects. Their timing can change race variance.",
    strategy:
      "Fields with more recorded item actions should be treated as less predictable."
  },
  podiumRate: {
    label: "Podium rate",
    explanation:
      "Podium rate is the share of completed indexed races where a Gigling finished in the top three.",
    strategy:
      "Use podium rate to find consistent contenders even when their outright win rate is modest."
  },
  prizePool: {
    label: "Prize pool",
    explanation:
      "The prize pool is live race escrow after entry funding. Protocol, jackpot, and creator fee rules can affect final payout distribution.",
    strategy:
      "Compare expected competition and entry cost with the pool instead of chasing the largest number alone."
  },
  raceStatus: {
    label: "Race phase",
    explanation:
      "Open races accept entrants, resolving races await the trusted resolver, resolved races have final rankings, and cancelled races expose refunds.",
    strategy:
      "Check phase and available field slots before preparing an entry."
  },
  rarity: {
    label: "Rarity performance",
    explanation:
      "Rarity describes the Gigling profile tier. The analytics show observed outcomes and do not assume rarity alone determines a winner.",
    strategy:
      "Use rarity as context, then prioritize condition fit and historical consistency."
  },
  risk: {
    label: "Race risk",
    explanation:
      "Risk increases when condition fit is weak, history is thin, recent form is poor, or the field contains volatile race conditions.",
    strategy:
      "High risk is a warning to inspect the reasons, not an instruction to avoid every race."
  },
  streak: {
    label: "Current streak",
    explanation:
      "Streak summarizes recent winning or losing momentum from the indexed racing profile.",
    strategy:
      "Momentum is useful context, but do not let a short streak outweigh distance and weather fit."
  },
  trackCondition: {
    label: "Track condition",
    explanation:
      "Track condition describes the race surface. Wet, muddy, and icy tracks place more emphasis on handling; chaotic tracks increase variance.",
    strategy:
      "Favor handling on technical surfaces and demand more confidence before entering chaotic races."
  },
  weather: {
    label: "Race weather",
    explanation:
      "Weather is supplied by the offchain resolver metadata and can be compared with each Gigling's indexed condition history.",
    strategy:
      "A matching weather record is supporting evidence, not a guaranteed bonus."
  },
  winRate: {
    label: "Win rate",
    explanation:
      "Win rate is completed indexed wins divided by completed indexed races. Small samples can move sharply after one result.",
    strategy:
      "Read win rate together with race count, podium rate, and the conditions behind those results."
  }
} as const;

export type RacingMechanic = keyof typeof racingMechanics;
