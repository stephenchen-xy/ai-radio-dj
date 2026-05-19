# AI Radio DJ Design

## Overview

This document defines a runtime design for a personal AI radio DJ agent.

The core product shape is:

- A quiet, companion-style radio DJ
- Automatic by default
- Able to accept light listener requests and adjust the next segment
- Focused on sequencing music first, with slight narration at transition points
- Constrained by harmless engineering boundaries rather than hard-coded narration templates

This is not a pet, a chatbot, or a generic music recommender. It is an agent that composes a listening flow from environment signals, music context, and short listener requests.

## Core Principles

### Ambient-first
The music remains the main experience.

### Slight presence
Narration is sparse and low-pressure.

### Music-first sequencing
The primary job is to decide what plays next.

### Dynamic judgment
The agent receives signals from weather, time, location, motion, activity, current tracks, recent tracks, and listener requests.

### Harmless engineering
The system is governed by behavioral boundaries and failure constraints.

## Architecture

Four layers:
1. External Context (music APIs, environment sources, voice stack, model runtime)
2. Local Brain (router, context builder, model adapter, scheduler, state store, TTS pipeline)
3. Runtime Assembly (persona, boundaries, profile, signals, history, storyline, steering)
4. Interaction Surface (PWA, local app, or HTTP layer)

## Implementation Notes

- MVP runtime uses a local TypeScript service.
- Deterministic policy modules own narration frequency and soft steering decay.
- Model output must conform to a validated JSON schema before entering playback logic.
- Storyline state is persisted in SQLite for continuity across planning cycles.
- HTTP endpoints begin with `/api/now`, `/api/next`, and `/api/request`.
