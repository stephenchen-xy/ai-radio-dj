import type { ModelDecision } from '../contracts/model';
import type { PlanningAdapter } from './model-adapter';

export function createRouter(adapter: PlanningAdapter) {
  return {
    async next(input: { allowNarration: boolean }): Promise<ModelDecision> {
      const decision = await adapter.planNextSegment({});
      if (!input.allowNarration) {
        return {
          ...decision,
          narration: {
            ...decision.narration,
            shouldSpeak: false,
            text: ''
          }
        };
      }
      return decision;
    }
  };
}
