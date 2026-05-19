import Fastify from 'fastify';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { CatalogTrack } from './contracts/catalog';
import { createSeedCatalogProvider } from './providers/seed-catalog-provider';
import { createPlanningService } from './services/planning-service';
import { createRouter } from './services/router';
import {
  createInMemoryDb,
  loadStorylineState,
  savePlannedSegment,
  loadPlannedSegment,
  saveStorylineState,
  type PlannedSegmentState
} from './state/db';
import { decideNarration } from './domain/narration-policy';

function loadCatalog(): CatalogTrack[] {
  const raw = readFileSync(resolve(process.cwd(), 'data/seed-tracks.json'), 'utf-8');
  return JSON.parse(raw) as CatalogTrack[];
}

export async function createServer() {
  const app = Fastify();

  // --- dependency wiring ---
  const catalog = loadCatalog();
  const provider = createSeedCatalogProvider(catalog);
  const db = createInMemoryDb();

  // Bootstrap storyline state if none exists
  if (!loadStorylineState(db)) {
    saveStorylineState(db, {
      mainlineLabel: 'bootstrap',
      currentSegmentLabel: 'bootstrap',
      dominantDriver: 'mixed',
      confidence: 0.7
    });
  }

  const planningService = createPlanningService({
    provider,
    // Stub model — in production this would call an LLM
    planWithModel: async () => {
      // Return invalid JSON to trigger deterministic fallback
      return { invalid: true };
    }
  });

  const router = createRouter({
    planningService,
    loadStoryline: () => {
      const state = loadStorylineState(db);
      return {
        label: state?.currentSegmentLabel ?? 'bootstrap',
        dominantDriver: state?.dominantDriver ?? 'mixed'
      };
    },
    saveSegment: (decision) => {
      const segment: PlannedSegmentState = {
        storylineLabel: decision.storyline.label,
        dominantDriver: decision.storyline.dominantDriver,
        steeringStatus: decision.steering.active ? decision.steering.status : undefined,
        narrationText: decision.narration.text,
        tracksJson: JSON.stringify(decision.play)
      };
      savePlannedSegment(db, segment);
      // Also update storyline
      saveStorylineState(db, {
        mainlineLabel: decision.storyline.label,
        currentSegmentLabel: decision.storyline.label,
        dominantDriver: decision.storyline.dominantDriver,
        confidence: 0.7,
        lastNarrationAt: decision.narration.shouldSpeak ? new Date().toISOString() : undefined
      });
    },
    loadSegment: () => {
      const saved = loadPlannedSegment(db);
      if (!saved) return undefined;
      return {
        storyline: {
          label: saved.storylineLabel,
          salientSignals: ['preserved'],
          dominantDriver: saved.dominantDriver
        },
        play: JSON.parse(saved.tracksJson),
        narration: {
          shouldSpeak: saved.narrationText.length > 0,
          text: saved.narrationText,
          grounding: ['preserved']
        },
        steering: {
          active: Boolean(saved.steeringStatus),
          type: 'soft' as const,
          status: saved.steeringStatus ?? 'expired'
        }
      };
    }
  });

  // --- routes ---

  app.get('/api/now', async () => {
    const state = loadStorylineState(db);
    const segment = loadPlannedSegment(db);
    return {
      currentTrackId: undefined,
      storylineLabel: state?.currentSegmentLabel ?? 'bootstrap',
      shouldSpeak: segment ? segment.narrationText.length > 0 : false,
      steeringStatus: segment?.steeringStatus ?? undefined
    };
  });

  app.get('/api/next', async () => {
    const lastSegment = router.getLastSegment();
    if (lastSegment) return lastSegment;

    // No segment yet — plan a default one
    return router.next({
      narrationAllowed: true,
      recentTrackIds: []
    });
  });

  app.post('/api/request', async (request) => {
    const body = request.body as { text?: string };
    const text = body?.text;
    if (!text) return { accepted: false };

    const narrationDecision = decideNarration({
      confidence: 0.7,
      minutesSinceLastNarration: 15,
      hasStrongTransition: true,
      hasListenerRequest: true
    });

    const result = await router.next({
      steeringText: text,
      narrationAllowed: narrationDecision.allowed,
      recentTrackIds: []
    });

    return { accepted: true, next: result };
  });

  return app;
}
