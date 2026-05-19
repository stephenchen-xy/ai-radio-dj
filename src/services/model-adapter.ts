import { ModelDecisionSchema, type ModelDecision } from '../contracts/model';

export type PlanningAdapter = {
  planNextSegment(context: unknown): Promise<ModelDecision>;
};

export function createStubPlanningAdapter(payload: ModelDecision): PlanningAdapter {
  return {
    async planNextSegment() {
      return ModelDecisionSchema.parse(payload);
    }
  };
}
