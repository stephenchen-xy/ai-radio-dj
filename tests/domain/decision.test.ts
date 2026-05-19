import { describe, expect, it } from 'vitest';
import { chooseDominantDriver } from '../../src/domain/decision';

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
