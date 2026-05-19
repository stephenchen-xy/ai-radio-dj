import type { CatalogTrack } from '../contracts/catalog';
import type { ModelDecision } from '../contracts/model';

export function buildFallbackSegment(input: {
  candidates: CatalogTrack[];
  storylineLabel: string;
  dominantDriver: 'music' | 'environment' | 'request' | 'mixed';
  steeringText?: string;
  shouldSpeak: boolean;
}): ModelDecision {
  const selected = input.candidates.slice(0, 4);

  return {
    storyline: {
      label: input.storylineLabel,
      salientSignals: input.steeringText ? ['listener_request', 'provider_candidates'] : ['provider_candidates'],
      dominantDriver: input.dominantDriver
    },
    play: selected.map((track) => ({
      trackId: track.id,
      title: track.title,
      artist: track.artist,
      searchHint: track.searchHint,
      why: [
        track.moods[0],
        track.tags[0],
        input.steeringText ? `request: ${input.steeringText}` : undefined
      ].filter(Boolean).join(' | ')
    })),
    narration: input.shouldSpeak
      ? {
          shouldSpeak: true,
          text: input.steeringText ? 'Next few tracks lean a little further that way.' : 'Keeping this next stretch steady.',
          grounding: input.steeringText ? ['listener request', 'seed tags'] : ['seed tags']
        }
      : {
          shouldSpeak: false,
          text: '',
          grounding: []
        },
    steering: {
      active: Boolean(input.steeringText),
      type: 'soft',
      status: input.steeringText ? 'continuing' : 'expired'
    }
  };
}
