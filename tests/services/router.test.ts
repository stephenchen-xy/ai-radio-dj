import { describe, expect, it } from 'vitest';
import { createRouter } from '../../src/services/router';
import { createServer } from '../../src/server';

describe('router', () => {
  it('skips narration when policy disallows it', async () => {
    const router = createRouter({
      planNextSegment: async () => ({
        storyline: {
          label: 'quiet-rain',
          salientSignals: ['weather'],
          dominantDriver: 'environment'
        },
        play: [{ trackId: 't3', why: 'rain imagery' }],
        narration: { shouldSpeak: true, text: 'Rain keeps this group together.', grounding: ['weather'] },
        steering: { active: false, type: 'soft', status: 'expired' }
      })
    });

    const result = await router.next({
      allowNarration: false
    });

    expect(result.narration.shouldSpeak).toBe(false);
    expect(result.narration.text).toBe('');
  });
});

describe('server', () => {
  it('exposes a now endpoint', async () => {
    const server = await createServer();
    const response = await server.inject({ method: 'GET', url: '/api/now' });
    expect(response.statusCode).toBe(200);
  });
});
