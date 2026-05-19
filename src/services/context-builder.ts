import type { SignalSnapshot } from '../domain/signals';
import type { StorylineState } from '../domain/storyline';

export function buildPlanningContext(input: {
  storyline: StorylineState;
  signals: SignalSnapshot;
  listenerRequest?: string;
}) {
  return {
    persona: 'slight-radio-host',
    harmlessMode: 'constrain-harms-not-style',
    storyline: input.storyline,
    signals: input.signals,
    listenerRequest: input.listenerRequest
  };
}
