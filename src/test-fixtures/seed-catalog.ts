import type { CatalogTrack } from '../contracts/catalog';

export const seedCatalog: CatalogTrack[] = [
  {
    id: 'seed-rain-1',
    title: 'Only Love Can Break Your Heart',
    artist: 'Neil Young',
    genres: ['folk rock'],
    moods: ['chill', 'rainy'],
    tags: ['rain', 'soft', 'afternoon'],
    era: '1970s',
    lyricsSnippet: 'Only love can break your heart',
    searchHint: 'Neil Young Only Love Can Break Your Heart'
  },
  {
    id: 'seed-commute-1',
    title: 'Nightcall',
    artist: 'Kavinsky',
    genres: ['synthwave'],
    moods: ['drive', 'night'],
    tags: ['commute', 'city', 'sunset'],
    era: '2010s',
    lyricsSnippet: 'I am giving you a night call',
    searchHint: 'Kavinsky Nightcall'
  }
];
