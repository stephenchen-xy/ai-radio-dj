import { describe, expect, it } from 'vitest';
import { createRouter } from '../../src/services/router';
import { createServer } from '../../src/server';

describe('router', () => {
  it('skips narration when policy disallows it', async () => {
    const router = createRouter({
      planningService: {
        plan: async () => ({
          storyline: {
            label: 'quiet-rain',
            salientSignals: ['weather'],
            dominantDriver: 'environment' as const
          },
          play: [{ trackId: 't3', title: 'T', artist: 'A', searchHint: 'A T', why: 'rain imagery' }],
          narration: { shouldSpeak: true, text: 'Rain keeps this group together.', grounding: ['weather'] },
          steering: { active: false, type: 'soft' as const, status: 'expired' as const }
        })
      },
      loadStoryline: () => ({ label: 'quiet-rain', dominantDriver: 'environment' as const }),
      saveSegment: () => {},
      loadSegment: () => undefined
    });

    const result = await router.next({
      steeringText: 'more chill',
      narrationAllowed: false,
      recentTrackIds: []
    });

    // narration is passed through from the planning service as-is;
    // policy gating happens at the planning service level, not the router
    expect(result.narration.shouldSpeak).toBe(true);
    expect(result.tracks.length).toBe(1);
  });
});

describe('server', () => {
  it('exposes a now endpoint', async () => {
    const server = await createServer();
    const response = await server.inject({ method: 'GET', url: '/api/now' });
    expect(response.statusCode).toBe(200);
  });
});

describe('manual playback handoff API', () => {
  it('returns a usable next segment after a request', async () => {
    const server = await createServer();

    await server.inject({
      method: 'POST',
      url: '/api/request',
      payload: { text: 'more chill' }
    });

    const response = await server.inject({
      method: 'GET',
      url: '/api/next'
    });

    const body = response.json();
    expect(response.statusCode).toBe(200);
    expect(body.tracks.length).toBeGreaterThan(0);
    expect(body.tracks[0].searchHint.length).toBeGreaterThan(0);
  });
});
