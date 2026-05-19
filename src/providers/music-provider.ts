import type { CatalogTrack } from '../contracts/catalog';

export type RecommendationInput = {
  dominantDriver: 'music' | 'environment' | 'request' | 'mixed';
  listenerRequest?: string;
  weather?: string;
  daypart?: string;
  locationClass?: string;
  recentTrackIds: string[];
};

export interface MusicProvider {
  searchTracks(query: string): Promise<CatalogTrack[]>;
  resolveTrack(id: string): Promise<CatalogTrack | undefined>;
  recommendNextTracks(input: RecommendationInput): Promise<CatalogTrack[]>;
  buildSearchHint(track: CatalogTrack): string;
}
