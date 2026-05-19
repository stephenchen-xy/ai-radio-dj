import { z } from 'zod';

export const DominantDriverSchema = z.enum(['music', 'environment', 'request', 'mixed']);
export const SteeringTypeSchema = z.enum(['soft', 'hard']);
export const SteeringStatusSchema = z.enum(['new', 'continuing', 'decaying', 'expired', 'promoted']);

export const ModelDecisionSchema = z.object({
  storyline: z.object({
    label: z.string().min(1),
    salientSignals: z.array(z.string()).min(1),
    dominantDriver: DominantDriverSchema
  }),
  play: z.array(z.object({
    trackId: z.string().min(1),
    why: z.string().min(1)
  })).min(1),
  narration: z.object({
    shouldSpeak: z.boolean(),
    text: z.string(),
    grounding: z.array(z.string())
  }),
  steering: z.object({
    active: z.boolean(),
    type: SteeringTypeSchema,
    status: SteeringStatusSchema
  })
});

export const RequestSteeringSchema = z.object({
  text: z.string().min(1).max(120),
  source: z.enum(['listener', 'system']).default('listener')
});

export type ModelDecision = z.infer<typeof ModelDecisionSchema>;
export type RequestSteering = z.infer<typeof RequestSteeringSchema>;
