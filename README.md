# Gigling Racing Intel

Gigling Racing Intel is a polished racing intelligence dashboard for Gigaverse Gigling Racing. It helps players inspect Giglings, study race history, understand the current meta, run explainable race predictions, manage a stable, track rivals, compare leaderboards, and generate shareable reports.

Built for GIGATHON 1, the app targets Player Tools & Analytics while also supporting community, onboarding, and developer utility use cases.

## Features

- Premium dark-mode dashboard with racing metrics, active races, meta alerts, charts, and quick actions.
- Gigling explorer with search, filters, sorting, cards, and full Gigling detail pages.
- Race dashboard and race detail pages with placements, item timelines, winner explanations, and "Why Did I Lose?" analysis.
- Meta insights for faction, rarity, weather, distance, and track condition performance.
- Race Intelligence Engine with weighted scoring, probabilities, confidence, risk, warnings, and plain-English reasoning.
- Stable manager with mock wallet state, owned Giglings, race suggestions, and risk alerts.
- Rivalry intelligence, leaderboards, and shareable report cards.
- Mock-first data layer that can be replaced by Gigaverse REST and contract reads without rewriting UI components.

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

Copy `.env.example` to `.env.local` for local integration work. The public REST client defaults to `https://gigaverse.io/api/racing`; leave the other values blank until contract reads are configured.

```txt
NEXT_PUBLIC_APP_NAME=Gigling Racing Intel
NEXT_PUBLIC_GIGAVERSE_API_BASE_URL=
NEXT_PUBLIC_ABSTRACT_RPC_URL=
NEXT_PUBLIC_PET_RACING_SYSTEM_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=
```

Recommended Gigaverse values for real integration:

```txt
NEXT_PUBLIC_GIGAVERSE_API_BASE_URL=https://gigaverse.io/api/racing
NEXT_PUBLIC_CHAIN_ID=2741
```

Set `NEXT_PUBLIC_ABSTRACT_RPC_URL` to an Abstract RPC endpoint and `NEXT_PUBLIC_PET_RACING_SYSTEM_ADDRESS` to the deployed PetRacingSystem contract address when enabling viem reads. If the REST API is unreachable or returns an unexpected payload, the app falls back to the centralized mock dataset.

## Data Architecture

The app keeps raw external data away from UI components:

```txt
UI Page
  -> Feature Component
    -> Hook
      -> Query function
        -> Mock data or Gigaverse API/contract client
          -> Adapter
            -> App types
```

Important files:

- `lib/gigaverse/mock-data.ts` - centralized realistic mock data.
- `lib/gigaverse/api-client.ts` - REST fetch functions with mock fallback.
- `lib/gigaverse/contract-client.ts` - viem public client and PetRacingSystem read helpers.
- `lib/gigaverse/adapters.ts` - normalization from API/contract payloads into app types.
- `lib/gigaverse/query-keys.ts` - centralized TanStack Query keys.
- `lib/gigaverse/analytics.ts` - dashboard, detail, meta, rivalry, and report calculations.
- `lib/gigaverse/predictor.ts` - explainable prediction model.
- `hooks/` - UI-facing query hooks.

## Gigaverse Integration Notes

The current integration layer is live-connected and safe by default:

- Public race, race detail, pet, leaderboard, stats, and player race-history reads target the Gigaverse Racing REST API.
- If the API responds with an error, malformed payload, or empty result, the app falls back to mock data.
- If contract env vars are missing, contract helpers return a typed `not-configured` result.
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

Realtime can be added after the REST and contract reads are verified. Gigaverse racing uses Pusher-compatible channels such as `race-{raceId}`, `racing.lobby`, and `global.chat.racing`.

## Mock Data

The mock dataset includes 24 Giglings, 20 races, 12 players, 6 factions, multiple rarities, weather conditions, track conditions, item usage examples, stable summaries, meta insights, rivalry records, leaderboards, and prediction examples.

Mock data remains the reliable demo path until live API and contract responses are verified.

## Hackathon Demo Flow

1. Open `/dashboard` to show the product value in under 20 seconds.
2. Open `/giglings` and filter by faction, rarity, weather, or distance.
3. Open a Gigling detail page to explain strengths, history, and risk warnings.
4. Open `/races` and a race detail page to show winner and loss explanations.
5. Open `/predictor` and run the Race Intelligence Engine.
6. Open `/stable`, `/rivals`, `/leaderboard`, and `/reports` to show player utility and community sharing.

## Scripts

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
```

## Security

Do not commit secrets, private keys, JWTs, or private RPC credentials. Only public `NEXT_PUBLIC_*` values belong in browser-readable configuration.
