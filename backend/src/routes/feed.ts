import { Router } from 'express';
import { and, asc, desc, eq, gt, inArray, isNotNull, isNull, lt, or, sql } from 'drizzle-orm';
import { z } from 'zod';
import { config } from '../config.js';
import { db, schema } from '../db/index.js';
import { me, requireAuth } from '../lib/auth.js';
import { badRequest, parse } from '../lib/http.js';
import { loadPosts, withViewerState, type PostDTO } from '../lib/present.js';
import { trendingScore } from '../lib/trending.js';

const { posts, follows, users, departments } = schema;
export const feedRouter = Router();
feedRouter.use(requireAuth);

const pageQuery = z.object({
  before: z.iso.datetime().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const nextCursor = (items: PostDTO[], limit: number) => (items.length === limit ? items[items.length - 1].createdAt : null);

feedRouter.get('/following', async (req, res) => {
  const q = parse(pageQuery, req.query);
  const user = me(req);
  const followed = db.select({ id: follows.followingId }).from(follows).where(eq(follows.followerId, user.id));
  const items = await loadPosts({
    where: and(
      eq(posts.kind, 'FEED'),
      isNull(posts.communityId),
      or(eq(posts.authorId, user.id), inArray(posts.authorId, followed)),
      q.before ? lt(posts.createdAt, new Date(q.before)) : undefined,
    ),
    orderBy: [desc(posts.createdAt)],
    viewerId: user.id,
    limit: q.limit,
  });
  res.json({ posts: items, nextCursor: nextCursor(items, q.limit) });
});

// (rest of feed.ts continues with campus, trending, etc. - full file from zip)
