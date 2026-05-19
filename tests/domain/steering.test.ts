import { describe, expect, it } from 'vitest';
import { applySoftSteering, tickSteering } from '../../src/domain/steering';

describe('soft steering', () => {
  it('starts with bounded windows', () => {
    const state = applySoftSteering(undefined, 'more chill');
    expect(state.requestText).toBe('more chill');
    expect(state.minWindowTracks).toBe(2);
    expect(state.maxWindowTracks).toBe(6);
    expect(state.status).toBe('new');
  });

  it('decays after the minimum window has been satisfied', () => {
    const state = tickSteering({
      requestText: 'more chill',
      status: 'continuing',
      startedAt: '2026-05-19T10:00:00.000Z',
      minWindowTracks: 2,
      maxWindowTracks: 6,
      consumedTracks: 2
    }, { moodLanded: true, promote: false });

    expect(state?.status).toBe('decaying');
  });
});
