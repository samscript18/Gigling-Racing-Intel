# Project Name

Gigling Racing Intel

# Short Description

Gigling Racing Intel is a live-data racing intelligence app for Gigaverse Gigling Racing. It helps players inspect Giglings, study race history, read the current meta, run explainable race predictions, manage a stable, track rivals, and create shareable reports so race decisions feel clearer and more strategic.

# Problem It Solves

Gigling Racing exposes valuable race, Gigling, owner, payout, and performance data, but players still need fast answers before entering or analyzing races. The app turns that data into practical guidance: which Giglings fit a race, why a result happened, what conditions are trending, who the toughest rivals are, and how a stable can be managed more intelligently.

# How It Uses Gigaverse APIs / Data

The app uses live Gigaverse Racing REST data and Abstract contract reads. It reads race feeds, race details, Gigling metadata, Gigling racing stats, player race history, ELO leaderboards, global racing stats, ownership context, race entry data, prize and payout fields, item/action fields when present, and PetRacingSystem contract views. Central adapters normalize the raw payloads into typed app data for analytics, prediction scoring, dashboards, charts, report cards, and user-readable unavailable states.

# Demo Link


# Repo / Build Link

Repository: https://github.com/samscript18/Gigling-Racing-Intel

Build commands: `npm install`, `npm run lint`, `npm run typecheck`, `npm run build`

# Future Potential

Gigling Racing Intel can evolve into a long-term companion for Gigling Racing with authenticated item inventory and race chat, deeper historical indexing, persistent public report URLs, stronger backtested prediction models, richer stable automation, and realtime race updates through Gigaverse socket channels.
