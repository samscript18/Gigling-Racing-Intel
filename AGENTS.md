# Gigling Racing Intel

## 1. Mission

Build **Gigling Racing Intel**, the intelligence layer for Gigaverse Gigling Racing.

This is a polished hackathon web app that helps players understand, analyze, and win at Gigling Racing by turning raw race, Gigling, player, trait, weather, faction, and onchain data into useful insights.

The app must feel like a premium racing intelligence dashboard, not a generic admin panel.

## 2. Product Positioning

### Product Name

Gigling Racing Intel

### Tagline

The intelligence layer for Gigling Racing.

### Short Description

Gigling Racing Intel helps players inspect Giglings, analyze races, understand the current meta, predict race outcomes, manage their stable, compare rivals, and learn why they win or lose.

### Core Value

Players should be able to open the app and quickly answer:

* Which Gigling should I enter?
* What race conditions favor my Gigling?
* What faction, rarity, weather, or distance is currently performing best?
* Why did my Gigling win or lose?
* Who are my biggest rivals?
* Which races look risky or favorable?
* What does the current Gigling Racing meta look like?

## 3. Hackathon Strategy

Optimize the project for the judging criteria:

### Execution — 30%

The app must work, feel polished, load quickly, and be usable on desktop and mobile.

Requirements:

* Fully implemented pages
* Clean responsive UI
* No broken navigation
* No empty placeholder screens
* Strong TypeScript quality
* Clear loading, empty, and error states
* Vercel-ready deployment

### Creativity — 25%

The project must go beyond a basic dashboard.

Creative features:

* Race Intelligence Engine
* Why Did I Lose? explanation panel
* Meta Shift Detection
* Rivalry Intelligence
* Shareable performance reports
* Fun Gigaverse-inspired racing visual identity

### Usefulness — 20%

The app must genuinely help Gigling Racing players.

Useful features:

* Gigling search and comparison
* Race history inspection
* Meta analytics
* Stable manager
* Race suitability suggestions
* Risk and confidence scoring

### Gigaverse Alignment — 20%

The app must be deeply focused on Gigling Racing.

Requirements:

* Use Gigling Racing language throughout
* Routes, UI, types, and data must revolve around Giglings, races, factions, traits, race conditions, players, and stables
* Real data integration must be isolated and prepared for Gigaverse APIs/contracts
* Do not build a generic Web3 analytics app

### Potential — 5%

The app should feel like it could become the official companion tool for players.

Future-ready layers:

* API adapters
* Contract client structure
* Query architecture
* Shareable reports
* Stable management
* Community/rivalry features

## 4. Tech Stack

Use:

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* TanStack Query
* Zustand
* Recharts
* viem
* wagmi
* Vercel

Optional only if needed later:

* Supabase
* MongoDB Atlas
* Serverless API routes
* Redis or KV caching

Do not add a backend unless specifically requested.

## 5. Non-Negotiable Development Rules

* Build step by step.
* Follow the task order exactly.
* Do not skip layers.
* Do not leave major screens as placeholders.
* Mock data must be realistic and centralized.
* All mock data must live in `lib/gigaverse/mock-data.ts`.
* All shared types must live in `types/`.
* Gigaverse API and contract logic must live in `lib/gigaverse/`.
* UI components must not contain raw API/contract mapping logic.
* Use strict TypeScript.
* Avoid `any` unless unavoidable.
* Build mobile-first responsive UI.
* Every page must include loading, empty, and error-friendly states where applicable.
* Every task must end with a clear report.
* Do not commit secrets.
* Do not hardcode private keys.
* Do not integrate real APIs until the mock MVP works.
* Keep the project Vercel-deployable.
* Use reusable components instead of duplicating UI.
* Do not create unnecessary backend complexity.
* Do not use fake claims like guaranteed prediction accuracy.

## 6. Required Routes

Implement these routes:

```txt
/
 /dashboard
 /giglings
 /giglings/[id]
 /races
 /races/[id]
 /predictor
 /stable
 /leaderboard
 /meta
 /rivals
 /reports
```

Each route must have a meaningful UI.

## 7. Required Folder Structure

Use this structure:

```txt
app/
  layout.tsx
  page.tsx
  dashboard/page.tsx
  giglings/page.tsx
  giglings/[id]/page.tsx
  races/page.tsx
  races/[id]/page.tsx
  predictor/page.tsx
  stable/page.tsx
  leaderboard/page.tsx
  meta/page.tsx
  rivals/page.tsx
  reports/page.tsx

components/
  layout/
  dashboard/
  giglings/
  races/
  predictor/
  stable/
  meta/
  rivals/
  leaderboard/
  reports/
  shared/

lib/
  config/
  gigaverse/
    mock-data.ts
    api-client.ts
    contract-client.ts
    adapters.ts
    analytics.ts
    predictor.ts
    query-keys.ts
  utils/

hooks/
  use-giglings.ts
  use-races.ts
  use-stable.ts
  use-meta-insights.ts

store/
  app-store.ts

types/
  gigling.ts
  race.ts
  player.ts
  analytics.ts
  prediction.ts
  stable.ts
  rivalry.ts
```

## 8. Data Types

Create strong TypeScript types.

### Gigling

```ts
export type GiglingRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type GiglingFaction =
  | "ember"
  | "aqua"
  | "terra"
  | "volt"
  | "shadow"
  | "neutral";

export type GiglingTrait = {
  id: string;
  name: string;
  category: "speed" | "stamina" | "luck" | "handling" | "temperament" | "special";
  revealed: boolean;
  value?: number;
  description: string;
};

export type GiglingStats = {
  speed: number;
  stamina: number;
  handling: number;
  acceleration: number;
  luck: number;
  consistency: number;
};

export type Gigling = {
  id: string;
  tokenId: string;
  name: string;
  imageUrl: string;
  ownerAddress: string;
  ownerName?: string;
  faction: GiglingFaction;
  rarity: GiglingRarity;
  level: number;
  traits: GiglingTrait[];
  stats: GiglingStats;
  totalRaces: number;
  wins: number;
  podiums: number;
  winRate: number;
  podiumRate: number;
  earnings: number;
  currentStreak: number;
  bestDistance: RaceDistance;
  bestWeather: RaceWeather;
  lastRaceAt?: string;
};
```

### Race

```ts
export type RaceStatus = "scheduled" | "live" | "completed" | "cancelled";

export type RaceWeather = "sunny" | "rainy" | "stormy" | "foggy" | "windy";

export type RaceDistance = "sprint" | "medium" | "long" | "marathon";

export type TrackCondition = "dry" | "wet" | "muddy" | "icy" | "chaotic";

export type RaceParticipant = {
  giglingId: string;
  giglingName: string;
  ownerAddress: string;
  ownerName?: string;
  faction: GiglingFaction;
  rarity: GiglingRarity;
  startingLane: number;
  finalPosition?: number;
  itemsUsed: RaceItemUsage[];
  performanceScore?: number;
};

export type RaceItemUsage = {
  id: string;
  itemName: string;
  type: "boost" | "sabotage" | "defense" | "utility";
  targetGiglingId?: string;
  impact: number;
  usedAtStage: "start" | "mid" | "finish";
};

export type Race = {
  id: string;
  raceNumber: number;
  status: RaceStatus;
  distance: RaceDistance;
  weather: RaceWeather;
  trackCondition: TrackCondition;
  entryFee: number;
  prizePool: number;
  startedAt?: string;
  endedAt?: string;
  participants: RaceParticipant[];
  winnerGiglingId?: string;
  payoutTxHash?: string;
};
```

### Player

```ts
export type Player = {
  id: string;
  walletAddress: string;
  displayName?: string;
  avatarUrl?: string;
  totalRaces: number;
  wins: number;
  winRate: number;
  totalEarnings: number;
  favoriteFaction?: GiglingFaction;
  stableSize: number;
};
```

### Prediction

```ts
export type PredictionInput = {
  raceId?: string;
  distance: RaceDistance;
  weather: RaceWeather;
  trackCondition: TrackCondition;
  participantGiglingIds: string[];
};

export type PredictionParticipantResult = {
  giglingId: string;
  giglingName: string;
  estimatedWinProbability: number;
  estimatedPodiumProbability: number;
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  reasons: string[];
};

export type PredictionResult = {
  input: PredictionInput;
  participants: PredictionParticipantResult[];
  topPickGiglingId: string;
  confidence: number;
  summary: string;
  warnings: string[];
};
```

### Meta Insights

```ts
export type MetaInsight = {
  id: string;
  title: string;
  description: string;
  severity: "info" | "positive" | "warning" | "critical";
  metricLabel: string;
  metricValue: string;
  trendDirection: "up" | "down" | "flat";
  createdAt: string;
};

export type FactionPerformance = {
  faction: GiglingFaction;
  races: number;
  wins: number;
  winRate: number;
  podiumRate: number;
  averagePlacement: number;
};
```

### Stable

```ts
export type StableSummary = {
  ownerAddress: string;
  ownerName?: string;
  giglings: Gigling[];
  totalRaces: number;
  totalWins: number;
  averageWinRate: number;
  bestGiglingId?: string;
  recommendedRaceIds: string[];
  alerts: StableAlert[];
};

export type StableAlert = {
  id: string;
  type: "opportunity" | "risk" | "meta" | "performance";
  title: string;
  description: string;
  giglingId?: string;
  raceId?: string;
};
```

### Rivalry

```ts
export type RivalryRecord = {
  id: string;
  playerAddress: string;
  rivalAddress: string;
  rivalName?: string;
  totalEncounters: number;
  winsAgainstRival: number;
  lossesAgainstRival: number;
  winRateAgainstRival: number;
  mostRecentRaceId: string;
  relationshipType: "rival" | "ally" | "nemesis" | "unknown";
  notes: string[];
};
```

## 9. Mock Data Requirements

Create realistic mock data covering:

* At least 24 Giglings
* At least 20 races
* At least 12 players
* At least 6 factions
* Multiple rarities
* Multiple weather conditions
* Multiple track conditions
* Multiple race distances
* Race participants with placements
* Item usage examples
* Rivalry records
* Stable summaries
* Meta insights
* Leaderboard data
* Prediction examples

Mock data must be internally consistent:

* Race winner must exist in race participants.
* Gigling race counts must roughly match race history.
* Player wallet addresses must look realistic.
* Stats should be numbers from 0 to 100.
* Win rates should be percentages.
* Dates should be realistic ISO strings.

## 10. UI Design Requirements

### Visual Style

Use a dark-mode-first design.

The UI should feel:

* Futuristic
* Racing-inspired
* Gaming-native
* Data-rich
* Web3
* Premium
* Fun but not childish

Use:

* Gradient accents
* Glassmorphism cards
* Subtle borders
* Rounded panels
* Metric cards
* Chart cards
* Status badges
* Empty state illustrations or icons
* Race/pet-inspired visual language

Avoid:

* Generic SaaS dashboard look
* Plain white admin UI
* Unstyled tables
* Inconsistent spacing
* Overcrowded mobile layouts

### Layout

Desktop:

* Left sidebar
* Top header
* Main content grid
* Sticky navigation where helpful

Mobile:

* Top compact header
* Bottom nav or collapsible menu
* Cards stacked vertically
* Tables should become cards or horizontally scroll safely

### Shared Components

Build reusable components:

* `AppShell`
* `Sidebar`
* `MobileNav`
* `PageHeader`
* `MetricCard`
* `ChartCard`
* `StatusBadge`
* `FactionBadge`
* `RarityBadge`
* `GiglingCard`
* `RaceCard`
* `DataTable`
* `EmptyState`
* `LoadingState`
* `ErrorState`
* `SectionHeader`
* `InsightCard`
* `ShareCard`

## 11. Data Flow

Use this architecture:

```txt
UI Page
  -> Feature Component
    -> Hook
      -> Query function
        -> Mock data or API client
          -> Adapter
            -> App types
```

Rules:

* Components consume typed app data.
* API/contract responses must be adapted before reaching UI.
* Do not let raw contract/API data leak into UI.
* Query keys must be centralized in `lib/gigaverse/query-keys.ts`.
* Analytics calculations must live in `lib/gigaverse/analytics.ts`.
* Prediction logic must live in `lib/gigaverse/predictor.ts`.

## 12. Prediction Logic

Build a simple but explainable Race Intelligence Engine.

Do not claim guaranteed accuracy.

Use a weighted scoring model:

```txt
Base score =
  speed * 0.25
+ stamina * 0.20
+ handling * 0.15
+ consistency * 0.15
+ luck * 0.10
+ historical condition fit * 0.15
```

Adjustments:

* Sprint races favor speed and acceleration.
* Long races favor stamina and consistency.
* Rainy/wet/muddy races favor handling.
* Chaotic tracks increase luck weight.
* Strong matching weather history adds bonus.
* Poor matching weather history adds penalty.
* Recent losing streak adds small risk penalty.
* Recent winning streak adds small confidence bonus.

Output:

* Estimated win probability
* Estimated podium probability
* Confidence score
* Risk level
* Reasons
* Warnings
* Top pick
* Short explanation

The predictor must explain its reasoning in plain English.

## 13. Required Feature Specs

### Landing Page

Route: `/`

Must include:

* Hero section
* Tagline
* Short problem statement
* Feature cards
* Hackathon/Gigaverse alignment section
* CTA to dashboard
* CTA to predictor
* Preview cards for race intelligence, meta insights, and stable manager

Goal:
A judge should understand the product in under 20 seconds.

### Dashboard

Route: `/dashboard`

Must include:

* Total races tracked
* Active/recent races
* Top faction this week
* Highest win-rate Gigling
* Meta shift alert
* Recent races list
* Top Giglings list
* Faction performance chart
* Race condition trend chart
* Quick links to predictor, explorer, stable, and meta pages

### Gigling Explorer

Route: `/giglings`

Must include:

* Search by name, token ID, owner
* Filter by faction
* Filter by rarity
* Filter by best weather
* Filter by best distance
* Sort by win rate, podium rate, earnings, races, level
* Gigling cards
* Empty state when no result
* Link to detail page

### Gigling Detail

Route: `/giglings/[id]`

Must include:

* Gigling profile header
* Image/avatar
* Owner
* Token ID
* Faction
* Rarity
* Stats radar or stat bars
* Career summary
* Race history
* Performance by weather
* Performance by distance
* Trait list
* Intelligence summary
* Recommended race conditions
* Risk warnings

### Race Dashboard

Route: `/races`

Must include:

* Live/recent/historical tabs
* Search/filter races
* Race cards/table
* Race status
* Distance
* Weather
* Track condition
* Prize pool
* Participants count
* Winner
* Item usage indicator
* Link to detail page

### Race Detail

Route: `/races/[id]`

Must include:

* Race summary
* Conditions
* Participants table
* Final placements
* Winner highlight
* Items used timeline
* Payout/transaction link placeholder
* Why winner won panel
* Why selected Gigling lost panel
* Similar races section

### Meta Insights

Route: `/meta`

Must include:

* Faction win-rate chart
* Rarity performance chart
* Weather impact chart
* Distance impact chart
* Track condition trends
* Meta shift cards
* Top emerging Giglings
* Weekly trend summary

### Predictor

Route: `/predictor`

Must include:

* Race condition input
* Participant selector
* Run prediction button
* Ranked results
* Win probability
* Podium probability
* Confidence
* Risk level
* Plain-English reasoning
* Warnings
* Suggested best pick

### Stable Manager

Route: `/stable`

Must include:

* Wallet-ready connect placeholder
* Mock connected wallet state
* Owned Giglings
* Stable summary
* Best Gigling
* Weakest Gigling
* Suggested races
* Risk alerts
* Stable performance chart

### Rivalry Intelligence

Route: `/rivals`

Must include:

* Rival list
* Ally list
* Nemesis highlight
* Encounter counts
* Win/loss against rival
* Recent rivalry races
* Relationship badges
* Explanation notes

### Leaderboards

Route: `/leaderboard`

Must include:

* Top Giglings
* Top players
* Top factions
* Highest win streaks
* Highest earnings
* Recent winners
* Tabs or filters

### Reports

Route: `/reports`

Must include:

* Shareable Gigling report card
* Shareable race report card
* Shareable meta alert card
* Download/copy placeholder
* Social sharing copy block

## 14. Real Data Layer Preparation

Before real integration, create:

### Environment Variables

Document these in `.env.example`:

```txt
NEXT_PUBLIC_APP_NAME=Gigling Racing Intel
NEXT_PUBLIC_GIGAVERSE_API_BASE_URL=
NEXT_PUBLIC_ABSTRACT_RPC_URL=
NEXT_PUBLIC_PET_RACING_SYSTEM_ADDRESS=
NEXT_PUBLIC_CHAIN_ID=
```

### API Client

Create `lib/gigaverse/api-client.ts`.

Responsibilities:

* Fetch Giglings
* Fetch Gigling by ID
* Fetch races
* Fetch race by ID
* Fetch player/stable data
* Fetch meta data

Initially return mock data or TODO-safe functions.

### Contract Client

Create `lib/gigaverse/contract-client.ts`.

Responsibilities:

* Create viem public client
* Read race contract
* Read Gigling ownership
* Read race results
* Read event logs if needed

Do not add real ABI until requested.

### Adapters

Create `lib/gigaverse/adapters.ts`.

Responsibilities:

* Convert API Gigling to app Gigling
* Convert contract race to app Race
* Normalize addresses
* Normalize dates
* Normalize numbers

### Query Keys

Create `lib/gigaverse/query-keys.ts`.

Centralize all TanStack Query keys.

## 15. Task Roadmap

### Task 01 — Project Foundation

Build:

* App structure
* Global layout
* App shell
* Sidebar
* Mobile nav
* Theme setup
* Mock data
* Shared types
* Shared UI components
* Landing page
* Empty/loading/error components

Completion:

* All core routes exist
* Navigation works
* Landing page is polished
* Mock data compiles
* No major placeholder errors

### Task 02 — Dashboard

Build:

* Dashboard metrics
* Recent races
* Top Giglings
* Faction chart
* Race trend chart
* Meta shift card
* Quick actions

Depends on:
Task 01

Completion:

* Dashboard gives immediate product value
* Uses mock data only
* Responsive on mobile

### Task 03 — Gigling Explorer

Build:

* Search
* Filters
* Sorting
* Gigling cards
* Empty state
* Detail links

Depends on:
Task 01

Completion:

* User can browse and filter Giglings
* No broken detail links

### Task 04 — Gigling Detail

Build:

* Gigling profile
* Stats
* Traits
* Career history
* Weather performance
* Distance performance
* Intelligence summary
* Recommended conditions

Depends on:
Task 03

Completion:

* Every mock Gigling has a useful detail page
* Invalid IDs show error/not-found state

### Task 05 — Race Dashboard

Build:

* Race feed
* Status tabs
* Search/filter
* Race cards/table
* Detail links

Depends on:
Task 01

Completion:

* User can inspect recent and historical races
* Race data is clear and useful

### Task 06 — Race Detail

Build:

* Race profile
* Participants
* Placements
* Items timeline
* Winner explanation
* Why Did I Lose panel
* Similar races

Depends on:
Task 05

Completion:

* Every mock race has useful detail page
* Explanation panel is memorable and demo-worthy

### Task 07 — Meta Insights

Build:

* Faction analytics
* Rarity analytics
* Weather analytics
* Distance analytics
* Track condition analytics
* Meta shift cards

Depends on:
Task 01

Completion:

* Page clearly explains current Gigling Racing meta
* Charts use real mock calculations where possible

### Task 08 — Race Intelligence Engine

Build:

* Prediction input form
* Participant selection
* Weighted scoring model
* Ranked prediction results
* Confidence score
* Risk level
* Explanation and warnings

Depends on:
Tasks 03, 05, 07

Completion:

* Predictor feels useful and explainable
* Does not claim guaranteed accuracy

### Task 09 — Stable Manager

Build:

* Mock wallet connection state
* Owned Giglings
* Stable summary
* Best/weakest Gigling
* Race suggestions
* Risk alerts
* Stable performance chart

Depends on:
Tasks 03, 08

Completion:

* User understands which Giglings in their stable are strongest and where to race them

### Task 10 — Rivalry Intelligence

Build:

* Rival records
* Ally records
* Nemesis highlight
* Win/loss against rivals
* Recent encounters
* Relationship notes

Depends on:
Tasks 05, 09

Completion:

* Page feels social/community-focused
* Gives memorable player relationships

### Task 11 — Leaderboards

Build:

* Top Giglings
* Top players
* Top factions
* Win streaks
* Earnings
* Recent winners

Depends on:
Tasks 03, 05, 07

Completion:

* Leaderboards are sortable/filterable where useful
* Useful for community comparison

### Task 12 — Shareable Reports

Build:

* Gigling report card
* Race report card
* Meta alert card
* Copy/share/download UI placeholders
* Social-ready copy

Depends on:
Tasks 04, 06, 07

Completion:

* Reports are visually polished and demo-worthy
* They support community sharing

### Task 13 — Real Data Layer Preparation

Build:

* `.env.example`
* API client
* Contract client
* Adapters
* Query keys
* Hooks wired through query architecture
* README integration notes

Depends on:
Tasks 01–12

Completion:

* Mock data remains working
* Real data can replace mock layer without rewriting UI

### Task 14 — Real Integration

Only start when Gigaverse API/contract docs are available.

Build:

* Real Gigling fetch
* Real race fetch
* Real race detail fetch
* Real stable ownership lookup if available
* Real contract reads if available
* Fallback to mock data if API fails

Depends on:
Task 13

Completion:

* App still works even if external APIs fail
* Real integration is isolated and safe

### Task 15 — Final Polish

Build:

* README
* Submission copy
* Demo walkthrough script
* Better empty states
* Mobile polish
* Animation polish
* Accessibility pass
* SEO metadata
* Vercel deployment cleanup

Depends on:
Tasks 01–14

Completion:

* App is ready for hackathon submission
* Demo flow is smooth
* README explains setup, features, and Gigaverse integration

## 16. Validation Rules

Before completing each task:

Run where available:

```bash
npm run lint
npm run typecheck
npm run build
```

If scripts do not exist:

* Check `package.json`
* Use the available equivalent
* Report missing scripts

Do not ignore:

* TypeScript errors
* Broken imports
* Runtime route errors
* Broken navigation
* Missing required page sections

## 17. Completion Report Format

At the end of every task, report:

```txt
Task Completed:
Files Changed:
Features Implemented:
Commands Run:
Known Limitations:
Next Recommended Task:
```

## 18. Final Product Acceptance Checklist

The project is complete only when:

* All required routes exist
* All pages are meaningful
* Navigation works on desktop and mobile
* Mock data is realistic
* Search/filter/sort works where required
* Charts render correctly
* Predictor works and explains results
* Stable manager works with mock wallet data
* Rivalry intelligence exists
* Shareable reports exist
* Real data layer is prepared
* README exists
* `.env.example` exists
* App builds successfully
* App is Vercel-ready
* No secrets are committed
* UI feels polished enough for a hackathon demo
* The app clearly aligns with Gigling Racing
* The project can be explained in a 30–90 second demo

## Design Excellence Requirements

This project must feel like a premium Web3 gaming intelligence platform.

The visual quality should be comparable to:

* DexScreener
* Jupiter
* Tensor
* Magic Eden
* Zerion
* Drift Protocol
* Hyperliquid
* Modern esports analytics platforms

### Visual Direction

The UI should feel:

* Futuristic
* Competitive
* Racing-inspired
* Premium
* Data-rich
* Web3-native
* Dark-mode-first

Avoid:

* Generic SaaS dashboards
* Plain admin templates
* Basic shadcn starter appearance
* Large empty spaces
* Flat cards with no depth

### Color System

Primary background:

* Near-black
* Rich charcoal
* Deep slate

Accent colors:

* Electric blue
* Neon cyan
* Purple
* Racing orange
* Emerald success states

Use gradients heavily but tastefully.

### Card Design

All cards should include:

* subtle glass effect
* soft border glow
* layered depth
* hover interaction
* elevated shadows

Cards should feel collectible and premium.

### Charts

Charts must look presentation-ready.

Requirements:

* smooth curves
* animated rendering
* custom tooltips
* gradient fills
* polished legends

Avoid default Recharts appearance.

### Animations

Use Framer Motion.

Required animations:

* page transitions
* card hover effects
* metric count-up animations
* chart reveal animations
* staggered list loading
* sidebar interactions
* modal transitions

Animations must feel smooth and premium.

Avoid excessive movement.

### Mobile Experience

The mobile version is not a simplified afterthought.

Requirements:

* bottom navigation
* swipe-friendly cards
* responsive charts
* large touch targets
* smooth transitions

### Dashboard Goal

When a judge opens the dashboard, the first reaction should be:

"This looks like a real product."

Not:

"This looks like a hackathon prototype."


Every major screen must contain at least one visually impressive element:
- animated chart
- insight card
- leaderboard visualization
- race timeline
- performance radar
- rivalry visualization
- prediction probability display
- The UI must be a beautiful dark-theme Web3 gaming dashboard with smooth animations, premium cards, glowing accents, animated charts, hover effects, and mobile responsiveness. The design should feel like a real Gigling Racing companion product, not a generic shadcn dashboard.

## Hackathon Documentation Alignment

This project is for **GIGATHON 1 — Gigaverse Vibe Coding Hackathon, June 2026**.

The hackathon goal is to expand the Gigaverse ecosystem with creative player tools, community experiences, developer utilities, educational content, clients, mods, mini games, experiences, and utilities around **Gigling Racing**.

Codex must optimize the product for these judging criteria:

* Execution: 30%
* Creativity: 25%
* Usefulness: 20%
* Gigaverse Alignment: 20%
* Potential: 5%

Special preference is given to projects focused on **Gigling Racing**, so every major feature must clearly plug into or enhance Gigling Racing.

## Prize Category Strategy

Primary category:

* Player Tools & Analytics

Secondary categories:

* Community & Social
* Educational & Onboarding
* Developer & Integration Utilities
* Novel & Experimental

The project should be strong enough to compete for **Best Overall** by combining multiple domains.

## Required Hackathon Alignment

The app must directly support these hackathon-approved directions:

### Player Tools & Analytics

* Pet/Gigling stat dashboards
* Historical race analysis
* Odds estimator
* Win-rate tracking by faction, rarity, weather, and distance
* Leaderboards

### Community & Social

* Pet/owner profiles
* Win histories
* Rivalry/ally tracking
* Shareable reports
* Faction/player comparison

### Educational & Onboarding

* Explain why a Gigling won or lost
* Explain race mechanics through tooltips
* Explain faction, rarity, weather, distance, and item impact
* Help new players make better race decisions

### Developer & Integration Utilities

* Prepare clean API/contract clients
* Prepare adapters for Gigaverse APIs/contracts
* Prepare query architecture for real race data
* Keep mock data replaceable with real data

### Novel & Experimental

* Race Intelligence Engine
* Meta Shift Detection
* Why Did I Lose? panel
* Rivalry Intelligence
* Shareable race intelligence cards

## Submission Requirements

The final project must support the hackathon submission format:

* Project name
* Short description
* Problem it solves
* How it uses Gigaverse APIs/data
* Demo link
* Repo/build link
* Future potential
* 30–90 second demo walkthrough

Task 15 must include README, submission copy, and demo script.

