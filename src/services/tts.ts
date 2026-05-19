export async function synthesizeNarration(text: string) {
  return {
    text,
    audioPath: `/tmp/${Date.now()}.mp3`
  };
}
