import { describe, expect, it } from 'vitest';
import { buildFallbackSegment } from '../../src/domain/fallback-planner';
import { seedCatalog } from '../../src/test-fixtures/seed-catalog';

describe('fallback planner', () => {
  it('produces 3 to 5 tracks with readable metadata', () => {
    const result = buildFallbackSegment({
      candidates: seedCatalog,
      storylineLabel: 'rain-window',
      dominantDriver: 'mixed',
      steeringText: 'more chill',
      shouldSpeak: true
    });

    expect(result.play.length).toBeGreaterThanOrEqual(3);
    expect(result.play.length).toBeLessThanOrEqual(5);
    expect(result.play[0].title.length).toBeGreaterThan(0);
  });

  it('can stay silent when narration is disallowed', () => {
    const result = buildFallbackSegment({
      candidates: seedCatalog,
      storylineLabel: 'late-focus',
      dominantDriver: 'music',
      steeringText: undefined,
      shouldSpeak: false
    });

    expect(result.narration.shouldSpeak).toBe(false);
    expect(result.narration.text).toBe('');
  });
});
