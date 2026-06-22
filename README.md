# Gigling Racing Intel

Gigling Racing Intel is a polished racing intelligence dashboard for Gigaverse Gigling Racing. It helps players inspect Giglings, study race history, understand the current meta, run explainable race predictions, manage a stable, track rivals, compare leaderboards, and generate shareable reports.

Built for GIGATHON 1, the app targets Player Tools & Analytics while also supporting community, onboarding, and developer utility use cases.

## Features

- Premium dark-mode dashboard with racing metrics, active races, meta alerts, charts, and quick actions.
- Gigling explorer with search, filters, sorting, cards, and full Gigling detail pages.
- Race dashboard and race detail pages with placements, item timelines, winner explanations, and "Why Did I Lose?" analysis.
- Meta insights for faction, rarity, weather, distance, and track condition performance.
- Race Intelligence Engine with weighted scoring, probabilities, confidence, risk, warnings, and plain-English reasoning.
- Stable manager with a connected demo wallet state, owned Giglings, race suggestions, and risk alerts.
- Rivalry intelligence, leaderboards, and shareable report cards.
- Live Gigaverse REST integration with resilient centralized demo fallback and isolated contract reads.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Recharts
- Framer Motion
- viem
- wagmi
- Vercel-ready deployment

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Validate the app:

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` only when overriding the verified public defaults.

```txt
NEXT_PUBLIC_APP_NAME=Gigling Racing Intel
NEXT_PUBLIC_GIGAVERSE_API_BASE_URL=https://gigaverse.io/api/racing
NEXT_PUBLIC_ABSTRACT_RPC_URL=https://api.mainnet.abs.xyz
NEXT_PUBLIC_PET_RACING_SYSTEM_ADDRESS=0xF6Ed2a53F311352c869e268601AAe5B78B9a9650
NEXT_PUBLIC_CHAIN_ID=2741
```

The app uses the Abstract mainnet public RPC and the verified PetRacingSystem deployment by default. Override these values only for another network or provider. If the REST API or RPC is unreachable, the app falls back to the centralized demo dataset.

## Data Architecture

The app keeps raw external data away from UI components:

```txt
UI Page
  -> Feature Component
    -> Hook
      -> Query function
        -> Gigaverse API/contract client or demo fallback
          -> Adapter
            -> App types
```

Important files:

- `lib/gigaverse/mock-data.ts` - centralized realistic demo/fallback data.
- `lib/gigaverse/api-client.ts` - REST fetch functions with demo fallback.
- `lib/gigaverse/contract-client.ts` - viem public client and PetRacingSystem read helpers.
- `lib/gigaverse/adapters.ts` - normalization from API/contract payloads into app types.
- `lib/gigaverse/query-keys.ts` - centralized TanStack Query keys.
- `lib/gigaverse/analytics.ts` - dashboard, detail, meta, rivalry, and report calculations.
- `lib/gigaverse/predictor.ts` - explainable prediction model.
- `hooks/` - UI-facing query hooks.

## Gigaverse Integration Notes

The current integration layer is live-connected and safe by default:

- Public race, race detail, pet, leaderboard, stats, and player race-history reads target the Gigaverse Racing REST API.
- If the API responds with an error, malformed payload, or empty result, the app falls back to demo data.
- Contract reads default to Abstract mainnet and return typed status results when unavailable.
- API and contract responses are adapted before reaching components.

Prepared REST paths include:

- `GET /races?limit=50`
- `GET /race/{raceId}`
- `GET /race-state?raceId=...`
- `GET /pets?ids=1,2,3`
- `GET /pets/{petId}/stats`
- `GET /races/{address}?limit=50`
- `GET /payouts/{address}`
- `GET /host-eligibility/{address}`
- `GET /leaderboard/elo?limit=&offset=`
- `GET /stats`

Prepared contract reads include:

- `getRace`
- `getRacePets`
- `getRaceFinalRanking`
- `getRaceFinishTimes`
- `getPetOwnerInRace`
- `getPetPayout`
- `canPetRace`

Gigaverse racing exposes Pusher-compatible realtime channels such as `race-{raceId}`, `racing.lobby`, and `global.chat.racing`; the current dashboard uses resilient REST refreshes and is structured for realtime subscriptions.

## Demo Fallback Data

The fallback dataset includes 24 Giglings, 20 races, 12 players, all 8 official factions, multiple rarities, weather conditions, track conditions, item usage examples, stable summaries, meta insights, rivalry records, leaderboards, and prediction examples.

Live Gigaverse REST data is the primary path. The fallback dataset keeps every route demo-ready during upstream outages.

## Hackathon Demo Flow

1. Open `/dashboard` to show the product value in under 20 seconds.
2. Open `/giglings` and filter by faction, rarity, weather, or distance.
3. Open a Gigling detail page to explain strengths, history, and risk warnings.
4. Open `/races` and a race detail page to show winner and loss explanations.
5. Open `/predictor` and run the Race Intelligence Engine.
6. Open `/stable`, `/rivals`, `/leaderboard`, and `/reports` to show player utility and community sharing.

Submission-ready copy lives in `docs/SUBMISSION.md`, the 30-90 second demo script lives in `docs/DEMO-WALKTHROUGH.md`, and the judging review lives in `docs/ALIGNMENT-AUDIT.md`.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Security

Do not commit secrets, private keys, JWTs, or private RPC credentials. Only public `NEXT_PUBLIC_*` values belong in browser-readable configuration.
