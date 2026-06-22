# Demo Walkthrough Script

## 30 Second Version

Gigling Racing Intel is the intelligence layer for Gigaverse Gigling Racing. I would start on the dashboard, where a player can immediately see tracked races, active lobbies, top factions, top Giglings, meta alerts, and condition charts.

Then I would jump into the predictor. A player chooses race conditions and entrants, runs the Race Intelligence Engine, and gets ranked probabilities, confidence, field volatility, model edge, and a cautious entry recommendation.

Finally, I would open a race detail page and show "Why Winner Won," "Why Did I Lose?", and the concrete next-race adjustments. That is the core value: raw racing data becomes a decision the player can act on.

## 60-90 Second Version

1. Open `/dashboard`.
   Show that this is a polished racing command center, not a generic admin panel. Point out active races, top faction, highest win-rate Gigling, race condition trend chart, and meta shift cards.

2. Open `/giglings`.
   Search or filter by faction, rarity, weather, or distance. Open a Gigling detail page and show stats, career summary, race history, performance by weather and distance, traits, recommended conditions, and risk warnings.

3. Open `/races`.
   Switch between live, recent, and historical tabs. Open a race detail page. Show final placements, item timeline, payout transaction reference, winner highlight, similar races, and the explanation panels.

4. Open `/predictor`.
   Select conditions and entrants, run the prediction, and explain that the model is intentionally transparent rather than claiming guaranteed accuracy.

5. Open `/stable`.
   Connect a wallet and show live owned Giglings, contract eligibility, best and weakest Gigling, suggested races, breeding-profile research, and rotation warnings.

6. Open `/rivals`, `/leaderboard`, and `/reports`.
   Show community utility: the rivalry pressure map, player and stable leaderboards, then download a 1200 x 630 PNG report for a social post.

7. Close with integration readiness.
   The app reads the public Gigaverse Racing REST API and PetRacingSystem through viem. It uses live data exclusively and clearly reports upstream outages or empty results.

## One Sentence Close

Gigling Racing Intel helps players understand which Gigling to enter, what conditions matter, why races were won or lost, and how the current Gigling Racing meta is shifting.
