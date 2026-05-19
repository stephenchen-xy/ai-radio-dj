export type SoftSteeringState = {
  requestText: string;
  status: 'new' | 'continuing' | 'decaying' | 'expired' | 'promoted';
  startedAt: string;
  minWindowTracks: number;
  maxWindowTracks: number;
  consumedTracks: number;
};

export function applySoftSteering(
  current: SoftSteeringState | undefined,
  requestText: string
): SoftSteeringState {
  return {
    requestText,
    status: current ? 'continuing' : 'new',
    startedAt: new Date().toISOString(),
    minWindowTracks: 2,
    maxWindowTracks: 6,
    consumedTracks: 0
  };
}

export function tickSteering(
  current: SoftSteeringState | undefined,
  outcome: { moodLanded: boolean; promote: boolean }
): SoftSteeringState | undefined {
  if (!current) return undefined;
  if (outcome.promote) return { ...current, status: 'promoted' };
  if (current.consumedTracks >= current.maxWindowTracks) return undefined;
  if (current.consumedTracks >= current.minWindowTracks && outcome.moodLanded) {
    return { ...current, status: 'decaying' };
  }
  return { ...current, status: 'continuing' };
}
