import { describe, expect, it } from 'vitest';
import { decideNarration } from '../../src/domain/narration-policy';

describe('narration policy', () => {
  it('stays silent when confidence is low', () => {
    const result = decideNarration({
      confidence: 0.2,
      minutesSinceLastNarration: 3,
      hasStrongTransition: false,
      hasListenerRequest: false
    });

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('low-confidence');
  });

  it('allows narration on a strong transition after enough quiet time', () => {
    const result = decideNarration({
      confidence: 0.8,
      minutesSinceLastNarration: 14,
      hasStrongTransition: true,
      hasListenerRequest: false
    });

    expect(result.allowed).toBe(true);
  });
});
