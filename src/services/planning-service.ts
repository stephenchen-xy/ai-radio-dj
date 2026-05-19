import type { ModelDecision } from '../contracts/model';
import { buildFallbackSegment } from '../domain/fallback-planner';
import type { MusicProvider } from '../providers/music-provider';
import { validatePlannedDecision, type PlanWithModel } from './model-adapter';

export function createPlanningService(input: {
  provider: MusicProvider;
  planWithModel: PlanWithModel;
}) {
  return {
    async plan(args: {
      storylineLabel: string;
      dominantDriver: 'music' | 'environment' | 'request' | 'mixed';
      steeringText?: string;
      narrationAllowed: boolean;
      weather?: string;
      recentTrackIds: string[];
    }): Promise<ModelDecision> {
      const candidates = await input.provider.recommendNextTracks({
        dominantDriver: args.dominantDriver,
        listenerRequest: args.steeringText,
        weather: args.weather,
        recentTrackIds: args.recentTrackIds
      });

      try {
        return await validatePlannedDecision(input.planWithModel, {
          ...args,
          candidates
        });
      } catch {
        return buildFallbackSegment({
          candidates,
          storylineLabel: args.storylineLabel,
          dominantDriver: args.dominantDriver,
          steeringText: args.steeringText,
          shouldSpeak: args.narrationAllowed
        });
      }
    }
  };
}
