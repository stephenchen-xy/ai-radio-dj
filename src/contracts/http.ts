export type NowResponse = {
  currentTrackId?: string;
  storylineLabel: string;
  shouldSpeak: boolean;
};

export type RequestPayload = {
  text: string;
};
