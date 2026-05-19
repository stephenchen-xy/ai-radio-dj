import type { CatalogTrack } from '../contracts/catalog';
import type { MusicProvider, RecommendationInput } from './music-provider';

export function createSeedCatalogProvider(catalog: CatalogTrack[]): MusicProvider {
  return {
    async searchTracks(query: string) {
      const q = query.toLowerCase();
      return catalog.filter((track) =>
        [track.title, track.artist, ...track.genres, ...track.moods, ...track.tags]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    },
    async resolveTrack(id: string) {
      return catalog.find((track) => track.id === id);
    },
    async recommendNextTracks(input: RecommendationInput) {
      const request = input.listenerRequest?.toLowerCase() ?? '';
      return catalog
        .filter((track) => !input.recentTrackIds.includes(track.id))
        .map((track) => ({
          track,
          score:
            (request && track.moods.some((m) => request.includes(m)) ? 3 : 0) +
            (input.weather && track.tags.includes(input.weather.toLowerCase()) ? 2 : 0) +
            (input.dominantDriver === 'request' && request ? 2 : 0)
        }))
        .sort((a, b) => b.score - a.score)
        .map(({ track }) => track);
    },
    buildSearchHint(track: CatalogTrack) {
      return track.searchHint;
    }
  };
}
