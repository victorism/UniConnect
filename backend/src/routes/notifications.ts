import { Router } from 'express';
import { and, desc, eq, isNull, lt, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { me, requireAuth } from '../lib/auth.js';
import { idParam, parse } from '../lib/http.js';

const { notifications, users, posts, communities } = schema;
export const notificationsRouter = Router();
notificationsRouter.use(requireAuth);

notificationsRouter.get('/', async (req, res) => {
  const q = parse(z.object({ before: z.iso.datetime().optional() }), req.query);
  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      text: notifications.text,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
      postId: notifications.postId,
      communityId: notifications.communityId,
      liveSessionId: notifications.liveSessionId,
      postText: posts.text,
      communityName: communities.name,
      actor: { id: users.id, fullName: users.fullName, username: users.username, avatarUrl: users.avatarUrl },
    })
    .from(notifications)
    .leftJoin(users, eq(users.id, notifications.actorId))
    .leftJoin(posts, eq(posts.id, notifications.postId))
    .leftJoin(communities, eq(communities.id, notifications.communityId))
    .where(and(eq(notifications.userId, me(req).id), q.before ? lt(notifications.createdAt, new Date(q.before)) : undefined))
    .orderBy(desc(notifications.createdAt))
    .limit(40);
  res.json({
    notifications: rows.map((r) => ({
      ...r,
      postText: r.postText ? r.postText.slice(0, 80) : null,
      actor: r.actor?.id ? r.actor : null,
      readAt: r.readAt?.toISOString() ?? null,
      createdAt: r.createdAt.toISOString(),
    })),
    nextCursor: rows.length === 40 ? rows[rows.length - 1].createdAt.toISOString() : null,
  });
});

notificationsRouter.get('/unread-count', async (req, res) => {
  const [{ n }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, me(req).id), isNull(notifications.readAt)));
  res.json({ unread: n });
});

notificationsRouter.post('/read-all', async (req, res) => {
  await db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.userId, me(req).id), isNull(notifications.readAt)));
  res.json({ ok: true });
});

notificationsRouter.post('/:id/read', async (req, res) => {
  await db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, idParam(req)), eq(notifications.userId, me(req).id)));
  res.json({ ok: true });
});
