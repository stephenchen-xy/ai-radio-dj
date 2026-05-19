# AI Radio DJ

A personal AI radio DJ agent that sequences music, accepts soft steering ("more chill", "warmer"), and generates slight host narration at transition points — all under deterministic harmless boundaries.

## MVP Architecture

```
src/
  contracts/     Zod schemas for model output, HTTP types
  domain/         Pure policy: soft steering decay, narration gating, dominant-driver rules
  services/       Orchestration: context assembly, model adapter, router, scheduler, TTS
  state/          SQLite persistence for storyline continuity
  test-fixtures/  Reusable test data
```

## Principles

- **Deterministic policy lives locally** — narration frequency, steering decay, confidence thresholds
- **Model output behind validated JSON contracts** — everything that enters playback logic is schema-validated
- **Music-first, slight presence** — the DJ supports the sequence, doesn't compete with it
- **Harmless boundaries** — no over-interpretation of listener, no fabricated certainty, silence is often correct

## Quick Start

```bash
npm install
npm test        # 12 tests covering contracts, domain, services, persistence
npm run dev     # start dev server on :3000
```

## Endpoints

- `GET  /api/now`      — current track, storyline label, narration status
- `GET  /api/next`     — upcoming tracks
- `POST /api/request`  — submit soft steering ("more chill", "warmer", etc.)
