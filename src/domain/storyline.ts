import type { SignalSnapshot } from './signals';

export type StorylineState = {
  mainlineLabel: string;
  currentSegmentLabel: string;
  dominantDriver: 'music' | 'environment' | 'request' | 'mixed';
  confidence: number;
  lastNarrationAt?: string;
  lastSignals?: SignalSnapshot;
};
