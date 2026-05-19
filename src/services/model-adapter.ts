import type { ModelDecision } from '../contracts/model';

export type PlanWithModel = (context: unknown) => Promise<unknown>;

export async function validatePlannedDecision(
  planner: PlanWithModel,
  context: unknown
): Promise<ModelDecision> {
  const raw = await planner(context);
  return ModelDecisionSchema.parse(raw);
}

// --- temporary: preserved for Phase 1 backward compat, will be replaced in Task 5 ---
import { ModelDecisionSchema } from '../contracts/model';

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
