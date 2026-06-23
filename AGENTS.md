## Task — Docs / Racing Academy Page

Build a comprehensive, premium `/docs` page for Gigling Racing Intel.

This page should function as an interactive in-app knowledge hub, strategy guide, and lightweight technical documentation layer.

It must strengthen the project’s alignment with:

* Educational & Onboarding
* Player Tools & Analytics
* Developer & Integration Utilities
* Best Overall

## Route

Add:

```txt
/docs
```

The route must be linked from:

* Landing page
* Dashboard quick actions
* Main navigation
* Mobile navigation
* Footer

## Page Positioning

The `/docs` page is not a boring documentation page.

It should feel like a **Racing Academy + Intelligence Manual + Strategy Lab** for Gigling Racing.

The page should teach players how to use the platform and understand Gigling Racing decisions.

## Visual Direction

Make the page:

* Beautiful
* Dark-theme-first
* Game-like
* Premium
* Futuristic
* Racing-inspired
* Data-rich
* Beginner-friendly
* Smoothly animated

Avoid:

* Plain markdown docs
* Basic FAQ layout
* Generic documentation templates
* Large walls of text
* Unstyled code blocks
* Flat cards

## Motion Design

Add sleeker gaming-style motion lanes, pulses, and animated background effects.

Examples:

* Subtle neon racing lanes moving behind the hero
* Horizontal pulse lines across section dividers
* Glowing circuit-like paths
* Animated scanner sweep on active cards
* Soft pulse around important insight blocks
* Animated progress rails for learning paths
* Section reveal animations
* Staggered card entrances
* Hover glow on academy cards

Respect reduced-motion settings.

Implementation rules:

* Use `prefers-reduced-motion` CSS handling.
* If using Framer Motion, use `useReducedMotion()`.
* Disable continuous movement for users who prefer reduced motion.
* Replace motion-heavy effects with static gradients when reduced motion is enabled.
* Never make animations distracting or performance-heavy.
* Animations should feel premium, not gimmicky.

## Required Page Sections

### 1. Hero Section

Title:

```txt
Racing Academy
```

Subtitle:

```txt
Learn the mechanics, master the meta, and turn Gigling Racing data into smarter race decisions.
```

Include:

* Animated neon racing lanes background
* Glowing badge: “Built for Gigling Racing players”
* CTA buttons:

  * Start Learning
  * Open Race Intelligence Engine
  * Explore Giglings

Show 3–4 animated stats:

* Mechanics explained
* Strategy modules
* Live data sources
* Intelligence models

### 2. Learning Path Section

Create a guided learning path with steps:

1. Understand Giglings
2. Read Race Conditions
3. Analyze Performance
4. Track the Meta
5. Run Race Intelligence
6. Manage Your Stable
7. Study Rivals
8. Share Reports

Each step should have:

* Icon
* Short explanation
* Related app link
* Progress-style visual

### 3. Gigling Basics

Explain:

* What a Gigling is
* Factions
* Rarity
* Traits
* Stats
* Owner/stable concept
* Race history
* Why different Giglings perform differently

Use visual cards, not plain text.

### 4. Race Mechanics Guide

Explain:

* Race distance
* Weather
* Track condition
* Entry fee
* Prize pool
* Participants
* Placement
* Item usage when data is available
* Payouts

Include a diagram-style race lifecycle:

```txt
Race Created → Giglings Enter → Conditions Apply → Items Impact → Race Settles → Results + Payouts
```

### 5. Strategy Guide

Explain how players should think about:

* Sprint races
* Medium races
* Long races
* Marathon races
* Sunny conditions
* Rainy/wet/muddy conditions
* Chaotic tracks
* Consistency
* Luck
* Handling
* Stamina
* Speed

Include “Do / Avoid” strategy cards.

### 6. Race Intelligence Engine Documentation

Explain how the predictor works.

Make it clear:

* It is decision support.
* It is not a guaranteed outcome engine.
* It uses weighted scoring and historical condition fit.

Show the model:

```txt
Base score =
speed × 0.25
+ stamina × 0.20
+ handling × 0.15
+ consistency × 0.15
+ luck × 0.10
+ historical condition fit × 0.15
```

Explain:

* Win probability
* Podium probability
* Confidence score
* Risk level
* Warnings
* Recommendation logic

Add a visual example using existing mock or live app data.

### 7. Why Did I Lose? Guide

Explain how the app interprets race losses.

Examples:

* Poor condition fit
* Weak stat match
* Stronger opponent
* Track/weather disadvantage
* Item impact
* Low consistency
* Unfavorable distance

Create polished explanation cards.

### 8. Meta Shift Detection Guide

Explain:

* Faction trends
* Weather trends
* Distance trends
* Rarity performance
* Emerging dominance
* Weekly performance shifts

Include example:

```txt
Volt faction win rate increased from 21% to 34% over the last 7 days.
Primary cause: stronger medium-distance performance.
```

### 9. Stable Manager Guide

Explain:

* How wallet/stable analysis works
* Owned Giglings
* Best race suggestions
* Risk alerts
* Best/weakest performer
* Race opportunity detection

Include a mini visual stable example.

### 10. Rivalry Intelligence Guide

Explain:

* Rival detection
* Ally detection
* Nemesis status
* Encounter count
* Head-to-head win/loss
* Recent matchups
* Social/community value

This section should feel fun and game-like.

### 11. Reports & Sharing Guide

Explain:

* Gigling report cards
* Race report cards
* Meta alert cards
* Shareable social copy
* Discord/X/Telegram usage

Show beautiful report card previews.

### 12. Developer / Data Layer Section

Add a developer-friendly section explaining how the app uses data.

Include:

* Gigaverse APIs
* Gigling Racing race data
* Contract reads
* Wallet ownership lookups
* Adapters
* Analytics engine
* Predictor engine
* Query layer

Show architecture flow:

```txt
Gigaverse APIs / Contracts
        ↓
Data Clients
        ↓
Adapters
        ↓
Typed App Data
        ↓
Analytics + Prediction Engines
        ↓
Player-Facing UI
```

Do not expose secrets.

Do not hardcode sensitive data.

### 13. FAQ Section

Include FAQs:

* Is the predictor guaranteed?
* Does this use real Gigverse data?
* Can beginners use this?
* Why do race conditions matter?
* How are rivalries calculated?
* Why is my stable recommendation different from my win rate?
* What happens if live data is unavailable?

### 14. Final CTA Section

End with a strong call to action:

```txt
Ready to race smarter?
```

Buttons:

* Launch Dashboard
* Run Race Intelligence
* Explore Meta

## UI Components to Create or Reuse

Create/reuse:

* `DocsHero`
* `LearningPath`
* `AcademyCard`
* `MotionLaneBackground`
* `StrategyCard`
* `FormulaCard`
* `RaceLifecycle`
* `DocsSection`
* `DocsCTA`
* `DocsFAQ`
* `ArchitectureFlow`
* `ReportPreviewCard`

## Design Details

Use:

* Glass cards
* Neon borders
* Animated lane backgrounds
* Gradient section dividers
* Glowing badges
* Rich icons
* Gaming-style stat blocks
* Responsive grid layouts
* Smooth scroll anchors
* Sticky section navigation on desktop if practical

## Accessibility Requirements

* Respect reduced motion.
* Maintain readable text contrast.
* Use semantic headings.
* Buttons and links must be keyboard-accessible.
* Avoid tiny text on mobile.
* Avoid animation that affects readability.
* Ensure long docs content is scannable.

## Completion Checklist

The task is complete only when:

* `/docs` route exists.
* The route is linked from navigation.
* The page has all required sections.
* The page is visually rich and game-like.
* Motion lanes/pulses exist.
* Reduced-motion settings are respected.
* The page is responsive.
* The page strengthens educational/onboarding value.
* The page explains Race Intelligence clearly.
* The page explains Gigaverse data usage clearly.
* No secrets are exposed.
* Lint/typecheck/build pass where available.

## Final Report

After implementation, report:

```txt
Task Completed:
Files Changed:
Sections Implemented:
Motion/Animation Added:
Reduced Motion Handling:
Commands Run:
Known Limitations:
Next Recommended Task:
```
