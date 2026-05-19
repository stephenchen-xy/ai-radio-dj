import { describe, expect, it } from 'vitest';
import { buildPlanningContext } from '../../src/services/context-builder';
import { sampleStorylineState } from '../../src/test-fixtures/sample-state';

describe('context builder', () => {
  it('builds a compact planning prompt payload', () => {
    const context = buildPlanningContext({
      storyline: sampleStorylineState,
      signals: {
        weather: 'rain',
        daypart: 'afternoon',
        recentTrackIds: ['t1', 't2']
      },
      listenerRequest: 'more chill'
    });

    expect(context.storyline.currentSegmentLabel).toBe('late-focus');
    expect(context.signals.weather).toBe('rain');
    expect(context.listenerRequest).toBe('more chill');
  });
});
