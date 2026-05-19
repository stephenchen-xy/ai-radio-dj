import { z } from 'zod';

const PlannedTrackSchema = z.object({
  trackId: z.string().min(1),
  title: z.string().min(1),
  artist: z.string().min(1),
  searchHint: z.string().min(1),
  why: z.string().min(1)
});

export const ModelDecisionSchema = z.object({
  storyline: z.object({
    label: z.string().min(1),
    salientSignals: z.array(z.string()).min(1),
    dominantDriver: z.enum(['music', 'environment', 'request', 'mixed'])
  }),
  play: z.array(PlannedTrackSchema).min(1).max(5),
  narration: z.object({
    shouldSpeak: z.boolean(),
    text: z.string(),
    grounding: z.array(z.string())
  }),
  steering: z.object({
    active: z.boolean(),
    type: z.enum(['soft', 'hard']),
    status: z.enum(['new', 'continuing', 'decaying', 'expired', 'promoted'])
  })
});

export const RequestSteeringSchema = z.object({
  text: z.string().min(1).max(120),
  source: z.enum(['listener', 'system']).default('listener')
});

export type ModelDecision = z.infer<typeof ModelDecisionSchema>;
export type RequestSteering = z.infer<typeof RequestSteeringSchema>;
