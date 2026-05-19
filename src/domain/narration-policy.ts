export type NarrationInputs = {
  confidence: number;
  minutesSinceLastNarration: number;
  hasStrongTransition: boolean;
  hasListenerRequest: boolean;
};

export function decideNarration(input: NarrationInputs) {
  if (input.confidence < 0.45) {
    return { allowed: false, reason: 'low-confidence' as const };
  }
  if (input.hasListenerRequest) {
    return { allowed: true, reason: 'listener-request' as const };
  }
  if (input.hasStrongTransition && input.minutesSinceLastNarration >= 10) {
    return { allowed: true, reason: 'strong-transition' as const };
  }
  return { allowed: false, reason: 'stay-silent' as const };
}
