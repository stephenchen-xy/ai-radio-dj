import { describe, expect, it } from 'vitest';
import { createPlanningService } from '../../src/services/planning-service';
import { createSeedCatalogProvider } from '../../src/providers/seed-catalog-provider';
import { seedCatalog } from '../../src/test-fixtures/seed-catalog';

describe('planning service', () => {
  it('falls back when the model output is invalid', async () => {
    const provider = createSeedCatalogProvider(seedCatalog);
    const service = createPlanningService({
      provider,
      planWithModel: async () => ({ invalid: true }) as never
    });

    const result = await service.plan({
      storylineLabel: 'rain-window',
      dominantDriver: 'mixed',
      steeringText: 'more chill',
      narrationAllowed: true,
      recentTrackIds: []
    });

    expect(result.play.length).toBeGreaterThan(0);
    expect(result.play[0].title.length).toBeGreaterThan(0);
  });
});
