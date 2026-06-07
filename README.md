# Vibe. Code. Flow. — Digital Dashboard

A comprehensive reporting platform that unifies organic and paid social media performance — with visual post previews, multi-timeframe reporting, engagement metric calculations, paid budget recommendations, and competitor benchmarking.

## Features

- **Weekly Report** — Rolling 7-day view with full creative previews for every post
- **Monthly Report** — Category rankings, organic vs. paid breakdown, competitor benchmarking, and paid amplification recommendations
- **Quarterly One-Pager** — Executive summary with trends, strategic recommendations, and top-performing creative gallery
- **Export** — PDF and Excel export on every report
- **Metrics** — Engagement rate, CTR, reach, impressions, audience growth, spend vs. performance

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- jsPDF / xlsx for exports

## LinkedIn Data Sync

CGA's demo used **manually researched public LinkedIn metrics** (reactions, comments, reposts) — not a live scraper. This project adds automated sync on top of that same data model.

```bash
# Pull live public posts (requires Apify token)
cp .env.example .env.local
# Add APIFY_TOKEN from https://console.apify.com

npm run sync:linkedin

# Or use curated seed data (BeOne posts, CGA-style)
npm run sync:linkedin:seed
```

Cached posts are saved to `data/linkedin-posts.json` and used by all reports. Use **Pull Latest Data** on the dashboard or `POST /api/sync/linkedin`.

| Provider | Env | What it pulls |
|----------|-----|---------------|
| `apify` | `APIFY_TOKEN` | Public company posts (reactions, comments, captions) |
| `linkedin` | `LINKEDIN_ACCESS_TOKEN` + `LINKEDIN_ORGANIZATION_ID` | Official API (requires client OAuth) |
| `seed` | — | Curated research corpus |
