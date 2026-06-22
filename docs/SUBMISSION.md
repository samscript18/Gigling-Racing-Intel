# Gigling Racing Intel Submission Copy

## Project Name

Gigling Racing Intel

## Short Description

Gigling Racing Intel is the intelligence layer for Gigaverse Gigling Racing: a polished player dashboard for inspecting Giglings, analyzing races, reading the meta, predicting race outcomes, managing a stable, tracking rivals, and sharing performance reports.

## Problem It Solves

Gigling Racing players need quick answers before entering races:

- Which Gigling should I enter?
- What conditions favor my stable?
- Why did my Gigling win or lose?
- Which factions, rarities, weather, and distances are performing best?
- Who are my biggest rivals?

The app turns raw racing, pet, owner, item, condition, and onchain data into decisions players can act on.

## How It Uses Gigaverse Data

- Reads the public Gigaverse Racing REST API by default.
- Parses live race feed data from `/races`.
- Parses race detail payloads from `/race/{raceId}`.
- Parses Gigling metadata and racing stats from `/pets`, `/pets/stats`, and `/pets/{petId}/stats`.
- Parses ELO leaderboard data from `/leaderboard/elo`.
- Parses global racing stats from `/stats`.
- Prepares viem contract reads for PetRacingSystem views such as `getRace`, `getRacePets`, `getRaceFinalRanking`, `getRaceFinishTimes`, `getPetOwnerInRace`, and `canPetRace`.
- Uses the eight official racing factions: Crusader, Overseer, Athena, Archon, Foxglove, Summoner, Chobo, and Gigus.
- Uses live data exclusively and presents explicit retry or empty states when upstream data is unavailable.

## Core Features

- Dashboard: live-feeling race command center with metrics, active races, charts, alerts, and quick actions.
- Gigling Explorer: search, filters, sorting, cards, and detailed Gigling intelligence pages.
- Race Dashboard: live/recent/historical race feed with filters and race cards.
- Race Detail: placements, item timeline, winner explanation, loss explanation, and similar races.
- Race Intelligence Engine: explainable weighted scoring model with probabilities, confidence, risk, reasons, and warnings.
- Meta Insights: faction, rarity, weather, distance, and track-condition analysis.
- Stable Manager: injected wallet connection, live owned Giglings, suggested races, and risk alerts.
- Rivalry Intelligence: rival, ally, and nemesis tracking with notes.
- Leaderboards: top Giglings, players, factions, streaks, earnings, and recent winners.
- Reports: shareable Gigling, race, and meta report cards with copy, native share, and download actions.

## Why It Fits Gigaverse

The entire product is centered on Gigling Racing language and decisions. It does not behave like a generic Web3 analytics panel; every route, type, chart, card, and explanation revolves around Giglings, races, factions, weather, track conditions, items, players, stables, and rivals.

## Judging Strengths

- Execution: complete Next.js app with all required routes, responsive UI, loading/empty/error states, TypeScript quality, and Vercel-ready build.
- Creativity: Race Intelligence Engine, "Why Did I Lose?", Meta Shift Detection, Rivalry Intelligence, and shareable report cards.
- Usefulness: directly helps players pick Giglings, avoid bad race fits, understand losses, and track the current meta.
- Gigaverse Alignment: built around Gigling Racing APIs, contract reads, and racing-specific gameplay language.
- Potential: clean adapters, query architecture, stable manager, reports, and community features can evolve into an official companion.

## Future Potential

- Add authenticated item inventory and race chat.
- Add realtime race updates through GigaSocket/Pusher.
- Add authenticated Gigaverse sessions for protected item, chat, and inventory endpoints.
- Add richer statistical models after more live race history is indexed.
- Add player-facing public report URLs and social card image export.
