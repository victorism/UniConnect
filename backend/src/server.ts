import http from 'node:http';
import { and, eq, isNotNull, lt } from 'drizzle-orm';
import { config } from './config.js';
import { db, pool, schema } from './db/index.js';
import { createApp } from './app.js';
import { removeFile } from './lib/uploads.js';
import { attachRealtime } from './realtime.js';
import { endStaleSessions } from './routes/live.js';

const app = createApp();
const server = http.createServer(app);
attachRealtime(server);

// Statuses stop showing the moment they expire; this removes them and their files.
async function deleteExpiredStatuses() {
  try {
    const expired = await db
      .delete(schema.posts)
      .where(and(eq(schema.posts.kind, 'STATUS'), isNotNull(schema.posts.expiresAt), lt(schema.posts.expiresAt, new Date())))
      .returning({ mediaUrl: schema.posts.mediaUrl });
    expired.forEach((p) => removeFile(p.mediaUrl));
    if (expired.length) console.log(`Removed ${expired.length} expired status(es).`);
  } catch (e) {
    console.error('Status cleanup failed', e);
  }
}
const cleanup = setInterval(() => {
  deleteExpiredStatuses();
  endStaleSessions().catch((e) => console.error('Live cleanup failed', e));
}, 10 * 60 * 1000);
deleteExpiredStatuses();

server.listen(config.port, () => {
  console.log(`UniConnect API listening on ${config.publicUrl} (port ${config.port})`);
});

function shutdown() {
  clearInterval(cleanup);
  server.close(() => pool.end().then(() => process.exit(0)));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
