import type { NextFunction, Request, Response } from 'express';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { config } from '../config.js';
import { db, schema } from '../db/index.js';
import type { User } from '../db/schema.js';
import { HttpError, unauthorized } from './http.js';

// `mfa` is true when this login passed the authenticator-app code (needed for the admin console).
type TokenPayload = { sub: string; v: number; mfa?: boolean };

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
      mfa?: boolean;
    }
  }
}

export function signToken(user: Pick<User, 'id' | 'tokenVersion'>, opts: { mfa?: boolean } = {}): string {
  const payload: TokenPayload = { sub: user.id, v: user.tokenVersion, ...(opts.mfa ? { mfa: true } : {}) };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] });
}

export type Session = { user: User; mfa: boolean };

/** Returns the session a token belongs to, or null if it is invalid, expired, revoked or suspended. */
export async function sessionFromToken(token: string | undefined | null): Promise<Session | null> {
  if (!token) return null;
  let payload: TokenPayload;
  try {
    payload = jwt.verify(token, config.jwtSecret) as unknown as TokenPayload;
  } catch {
    return null;
  }
  if (typeof payload.sub !== 'string' || !/^[0-9a-f-]{36}$/i.test(payload.sub)) return null;
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, payload.sub) });
  if (!user || user.tokenVersion !== payload.v || user.suspendedAt) return null;
  return { user, mfa: !!payload.mfa };
}

export async function userFromToken(token: string | undefined | null): Promise<User | null> {
  return (await sessionFromToken(token))?.user ?? null;
}

function bearer(req: Request): string | undefined {
  const h = req.headers.authorization;
  return h?.startsWith('Bearer ') ? h.slice(7) : undefined;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const s = await sessionFromToken(bearer(req));
  if (!s) return next(unauthorized());
  req.user = s.user;
  req.mfa = s.mfa;
  next();
}

/** Like requireAuth but lets anonymous requests through (req.user stays undefined). */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const s = await sessionFromToken(bearer(req));
  if (s) {
    req.user = s.user;
    req.mfa = s.mfa;
  }
  next();
}

export const me = (req: Request): User => {
  if (!req.user) throw unauthorized();
  return req.user;
};

export const suspendedError = (u: Pick<User, 'suspendReason'>) =>
  new HttpError(403, `Your account has been suspended${u.suspendReason ? `: ${u.suspendReason}` : ''}. Contact the UniConnect admins.`);
