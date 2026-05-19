export type CatalogTrack = {
  id: string;
  title: string;
  artist: string;
  genres: string[];
  moods: string[];
  tags: string[];
  era?: string;
  lyricsSnippet?: string;
  searchHint: string;
};

export type PlannedTrack = {
  trackId: string;
  title: string;
  artist: string;
  searchHint: string;
  why: string;
};
