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
  },
  {
    id: 'seed-focus-1',
    title: 'Nuvole Bianche',
    artist: 'Ludovico Einaudi',
    genres: ['modern classical'],
    moods: ['chill', 'focus'],
    tags: ['focus', 'soft', 'afternoon'],
    era: '2000s',
    lyricsSnippet: '',
    searchHint: 'Ludovico Einaudi Nuvole Bianche'
  },
  {
    id: 'seed-gym-1',
    title: 'Stronger',
    artist: 'Kanye West',
    genres: ['hip hop'],
    moods: ['energy', 'push'],
    tags: ['gym', 'push', 'morning'],
    era: '2000s',
    lyricsSnippet: "That that don't kill me can only make me stronger",
    searchHint: 'Kanye West Stronger'
  }
];
