import { describe, expect, it } from 'vitest';
import { createSeedCatalogProvider } from '../../src/providers/seed-catalog-provider';
import { seedCatalog } from '../../src/test-fixtures/seed-catalog';

describe('seed catalog provider', () => {
  it('returns chill rainy tracks when the request and signals align', async () => {
    const provider = createSeedCatalogProvider(seedCatalog);
    const results = await provider.recommendNextTracks({
      dominantDriver: 'mixed',
      listenerRequest: 'more chill',
      weather: 'rain',
      recentTrackIds: []
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results[0].searchHint.length).toBeGreaterThan(0);
  });

  it('filters out recently used tracks', async () => {
    const provider = createSeedCatalogProvider(seedCatalog);
    const results = await provider.recommendNextTracks({
      dominantDriver: 'music',
      recentTrackIds: ['seed-rain-1']
    });

    expect(results.some((track) => track.id === 'seed-rain-1')).toBe(false);
  });
});
