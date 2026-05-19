export type SignalSnapshot = {
  weather?: string;
  daypart?: 'morning' | 'afternoon' | 'evening' | 'night';
  locationClass?: 'home' | 'commute' | 'gym' | 'cafe' | 'unknown';
  activity?: string;
  currentTrackId?: string;
  recentTrackIds: string[];
  listenerRequest?: string;
};
