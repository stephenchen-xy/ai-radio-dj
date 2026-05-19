import type { ModelDecision } from '../contracts/model';
import type { NextResponse } from '../contracts/http';
import type { createPlanningService } from './planning-service';

export type RouterNextInput = {
  steeringText?: string;
  narrationAllowed: boolean;
  weather?: string;
  recentTrackIds: string[];
};

export function createRouter(deps: {
  planningService: ReturnType<typeof createPlanningService>;
  loadStoryline: () => { label: string; dominantDriver: 'music' | 'environment' | 'request' | 'mixed' };
  saveSegment: (decision: ModelDecision) => void;
  loadSegment: () => ModelDecision | undefined;
}) {
  return {
    async next(input: RouterNextInput): Promise<NextResponse> {
      const storyline = deps.loadStoryline();

      const decision = await deps.planningService.plan({
        storylineLabel: storyline.label,
        dominantDriver: storyline.dominantDriver,
        steeringText: input.steeringText,
        narrationAllowed: input.narrationAllowed,
        weather: input.weather,
        recentTrackIds: input.recentTrackIds
      });

      deps.saveSegment(decision);

      return decisionToResponse(decision);
    },

    getLastSegment(): NextResponse | undefined {
      const segment = deps.loadSegment();
      if (!segment) return undefined;
      return decisionToResponse(segment);
    }
  };
}

function decisionToResponse(decision: ModelDecision): NextResponse {
  return {
    storylineLabel: decision.storyline.label,
    dominantDriver: decision.storyline.dominantDriver,
    steeringStatus: decision.steering.active ? decision.steering.status : undefined,
    narration: {
      shouldSpeak: decision.narration.shouldSpeak,
      text: decision.narration.text,
      grounding: decision.narration.grounding
    },
    tracks: decision.play.map((t) => ({
      trackId: t.trackId,
      title: t.title,
      artist: t.artist,
      searchHint: t.searchHint,
      why: t.why
    }))
  };
}
