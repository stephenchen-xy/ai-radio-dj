export type NowResponse = {
  currentTrackId?: string;
  storylineLabel: string;
  shouldSpeak: boolean;
};

export type RequestPayload = {
  text: string;
};

export type NextResponse = {
  storylineLabel: string;
  dominantDriver: 'music' | 'environment' | 'request' | 'mixed';
  steeringStatus?: 'new' | 'continuing' | 'decaying' | 'expired' | 'promoted';
  narration: {
    shouldSpeak: boolean;
    text: string;
    grounding: string[];
  };
  tracks: Array<{
    trackId: string;
    title: string;
    artist: string;
    searchHint: string;
    why: string;
  }>;
};
