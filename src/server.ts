import Fastify from 'fastify';

export async function createServer() {
  const app = Fastify();

  app.get('/api/now', async () => {
    return {
      currentTrackId: undefined,
      storylineLabel: 'bootstrap',
      shouldSpeak: false
    };
  });

  app.get('/api/next', async () => {
    return { tracks: [] };
  });

  app.post('/api/request', async (request) => {
    const body = request.body as { text?: string };
    return { accepted: Boolean(body?.text) };
  });

  return app;
}
