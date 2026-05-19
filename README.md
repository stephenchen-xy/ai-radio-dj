# AI Radio DJ

A personal AI radio DJ agent that sequences music, accepts soft steering ("more chill", "warmer"), and generates slight host narration at transition points — all under deterministic harmless boundaries.

## What This Is

This project is a manual playback handoff MVP for an AI Radio DJ.

It does not stream music directly. Instead, it plans the next 3-5 tracks, writes a short radio-host segue, and hands playback off through track metadata and search hints.

## MVP Architecture

```
src/
  contracts/     Zod schemas for model output, HTTP types, catalog types
  domain/         Pure policy: soft steering decay, narration gating, dominant-driver rules, fallback planner
  providers/      MusicProvider interface + local JSON-backed seed catalog
  services/       Orchestration: context assembly, model adapter, planning service, router, scheduler, TTS
  state/          SQLite persistence for storyline and planned segment continuity
  test-fixtures/  Reusable test data

data/
  seed-tracks.json  32-track curated catalog across 4 flows (rain/chill, commute, gym, focus)
```

## Principles

- **Deterministic policy lives locally** — narration frequency, steering decay, confidence thresholds
- **Model output behind validated JSON contracts** — everything that enters playback logic is schema-validated
- **Deterministic fallback** — when model output is invalid, a local planner takes over
- **Music-first, slight presence** — the DJ supports the sequence, doesn't compete with it
- **Harmless boundaries** — no over-interpretation of listener, no fabricated certainty, silence is often correct

## Current Capabilities

- storyline persistence
- soft steering with bounded decay
- narration gating
- local seed catalog recommendations
- model planning with deterministic fallback
- manual playback handoff via `/api/request` → `/api/next`

## Not Included Yet

- Spotify integration
- Apple Music integration
- QQ Music integration
- browser playback
- TTS narration audio
- real LLM model calls (stub returns invalid JSON to test fallback path)

## Quick Start

```bash
npm install
npm test        # 19 tests covering contracts, domain, providers, services, persistence, HTTP
npm run dev     # start dev server on :3000
```

## Quick Demo

1. Start the server with `npm run dev`
2. Send `POST /api/request` with `{ "text": "more chill" }`
3. Read `GET /api/next`
4. Copy `searchHint` into QQ Music, Apple Music, or another player

## Endpoints

- `GET  /api/now`      — current track, storyline label, narration status
- `GET  /api/next`     — 3-4 planned tracks with title, artist, searchHint, why
- `POST /api/request`  — submit soft steering ("more chill", "warmer", etc.); returns `{ accepted: true, next: NextResponse }`
