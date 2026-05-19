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
      play: [{
        trackId: 'track-1',
        title: 'Test Track',
        artist: 'Test Artist',
        searchHint: 'Test Artist Test Track',
        why: 'lyrics mention rain'
      }],
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

describe('manual handoff decision contract', () => {
  it('requires user-readable track metadata for each planned track', () => {
    const payload = {
      storyline: {
        label: 'rain-window',
        salientSignals: ['weather', 'recent_tracks'],
        dominantDriver: 'mixed'
      },
      play: [
        {
          trackId: 'seed-1',
          title: 'Only Love Can Break Your Heart',
          artist: 'Neil Young',
          searchHint: 'Neil Young Only Love Can Break Your Heart',
          why: 'Rainy mood and soft steering both point toward quieter folk rock.'
        }
      ],
      narration: {
        shouldSpeak: true,
        text: 'Next few tracks stay on the quieter side.',
        grounding: ['weather', 'seed tags']
      },
      steering: {
        active: true,
        type: 'soft',
        status: 'continuing'
      }
    };

    const result = ModelDecisionSchema.parse(payload);
    expect(result.play[0].title).toBe('Only Love Can Break Your Heart');
    expect(result.play[0].searchHint).toContain('Neil Young');
  });
});
