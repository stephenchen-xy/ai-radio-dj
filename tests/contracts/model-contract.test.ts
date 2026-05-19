import { describe, expect, it } from 'vitest';
import { ModelDecisionSchema, RequestSteeringSchema } from '../../src/contracts/model';

describe('bootstrap', () => {
  it('loads the test runner', () => {
    expect(true).toBe(true);
  });
});

describe('model contract', () => {
  it('accepts a valid decision payload', () => {
    const payload = {
      storyline: {
        label: 'rain-window',
        salientSignals: ['weather', 'recent_tracks'],
        dominantDriver: 'mixed'
      },
      play: [{ trackId: 'track-1', why: 'lyrics mention rain' }],
      narration: {
        shouldSpeak: true,
        text: 'Next few tracks stay with the weather a little.',
        grounding: ['lyrics imagery', 'weather']
      },
      steering: {
        active: true,
        type: 'soft',
        status: 'continuing'
      }
    };

    expect(ModelDecisionSchema.parse(payload)).toEqual(payload);
  });

  it('accepts a short listener request', () => {
    const request = { text: 'more chill', source: 'listener' as const };
    expect(RequestSteeringSchema.parse(request)).toEqual(request);
  });
});
