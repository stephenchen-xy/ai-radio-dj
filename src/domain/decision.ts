export function chooseDominantDriver(input: {
  weatherStrength: number;
  musicFlowStrength: number;
  requestStrength: number;
}): 'music' | 'environment' | 'request' | 'mixed' {
  if (input.requestStrength >= 0.85) return 'request';
  if (Math.abs(input.weatherStrength - input.musicFlowStrength) <= 0.1) return 'mixed';
  return input.weatherStrength > input.musicFlowStrength ? 'environment' : 'music';
}
