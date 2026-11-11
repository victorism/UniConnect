import 'dotenv/config';

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
  return v;
}

const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32 || jwtSecret.startsWith('change-me')) {
  throw new Error('JWT_SECRET must be a long random string (32+ characters). See .env.example.');
}

const port = Number(process.env.PORT ?? 4000);

export const config = {
  databaseUrl: required('DATABASE_URL'),
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  port,
  publicUrl: (process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, ''),
  corsOrigins: (process.env.CORS_ORIGINS ?? '*').split(',').map((s) => s.trim()).filter(Boolean),
  googleClientIds: (process.env.GOOGLE_CLIENT_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
  // LiveKit (video calls). LIVEKIT_URL is the wss:// address apps connect to.
  livekit: {
    url: process.env.LIVEKIT_URL ?? '',
    apiKey: process.env.LIVEKIT_API_KEY ?? '',
    apiSecret: process.env.LIVEKIT_API_SECRET ?? '',
  },
  // Where the built web app lives (mobile/dist). When set, the API also serves the website.
  webDist: process.env.WEB_DIST ?? '',
  // Public address of the website, used for links that open the web app (e.g. joining a call from a phone).
  webUrl: (process.env.WEB_URL ?? process.env.PUBLIC_URL ?? `http://localhost:${port}`).replace(/\/$/, ''),
  statusLifetimeMs: 24 * 60 * 60 * 1000,
  trendingWindowMs: 24 * 60 * 60 * 1000,
};
