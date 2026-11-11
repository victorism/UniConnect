import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { me, requireAuth } from '../lib/auth.js';
import { badRequest, notFound, parse } from '../lib/http.js';

export const REPORT_REASONS = {
  SPAM: 'Spam or scam',
  HARASSMENT: 'Harassment or bullying',
  HATE: 'Hate speech',
  NUDITY: 'Nudity or sexual content',
  VIOLENCE: 'Violence or threats',
  FALSE_INFO: 'False information',
  IMPERSONATION: 'Pretending to be someone else',
  EXAM_MALPRACTICE: 'Exam malpractice',
  OTHER: 'Something else',
} as const;

export const reportsRouter = Router();
reportsRouter.use(requireAuth);

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 30, keyGenerator: (req) => req.user?.id ?? 'anon' });

reportsRouter.get('/reasons', (_req, res) => {
  res.json({ reasons: Object.entries(REPORT_REASONS).map(([id, label]) => ({ id, label })) });
});

reportsRouter.post('/', limiter, async (req, res) => {
  const body = parse(
    z
      .object({
        postId: z.uuid().optional(),
        commentId: z.uuid().optional(),
        reason: z.enum(Object.keys(REPORT_REASONS) as [keyof typeof REPORT_REASONS]),
        details: z.string().trim().max(500).optional(),
      })
      .refine((b) => !!b.postId !== !!b.commentId, 'Report one post or one comment.'),
    req.body,
  );
  const user = me(req);
  if (body.postId) {
    const post = await db.query.posts.findFirst({ where: eq(schema.posts.id, body.postId), columns: { authorId: true } });
    if (!post) throw notFound('That post no longer exists.');
    if (post.authorId === user.id) throw badRequest("You can't report your own post.");
  } else {
    const c = await db.query.comments.findFirst({ where: eq(schema.comments.id, body.commentId!), columns: { authorId: true } });
    if (!c) throw notFound('That comment no longer exists.');
    if (c.authorId === user.id) throw badRequest("You can't report your own comment.");
  }
  const existing = await db.query.reports.findFirst({
    where: and(
      eq(schema.reports.reporterId, user.id),
      eq(schema.reports.status, 'OPEN'),
      body.postId ? eq(schema.reports.postId, body.postId) : eq(schema.reports.commentId, body.commentId!),
    ),
    columns: { id: true },
  });
  if (!existing) {
    await db.insert(schema.reports).values({
      reporterId: user.id,
      postId: body.postId ?? null,
      commentId: body.commentId ?? null,
      reason: body.reason,
      details: body.details || null,
    });
  }
  res.status(201).json({ ok: true, message: 'Thanks. Our admins will review this.' });
});
