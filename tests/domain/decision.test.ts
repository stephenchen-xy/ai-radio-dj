import { describe, expect, it } from 'vitest';
import { chooseDominantDriver } from '../../src/domain/decision';
import { createInMemoryDb, saveStorylineState, loadStorylineState } from '../../src/state/db';

describe('dominant driver selection', () => {
  it('prefers listener request in the short-term when present', () => {
    const driver = chooseDominantDriver({
      weatherStrength: 0.4,
      musicFlowStrength: 0.7,
      requestStrength: 0.9
    });

    expect(driver).toBe('request');
  });
});

describe('state persistence', () => {
  it('stores and reloads storyline state', () => {
    const db = createInMemoryDb();
    saveStorylineState(db, {
      mainlineLabel: 'sunset-drive',
      currentSegmentLabel: 'sunset-drive',
      dominantDriver: 'environment',
      confidence: 0.82
    });

    expect(loadStorylineState(db)?.mainlineLabel).toBe('sunset-drive');
  });
});
