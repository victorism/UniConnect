import type { NextFunction, Request, Response } from 'express';
import { z, ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message);
  }
}

export const badRequest = (msg: string, details?: unknown) => new HttpError(400, msg, details);
export const unauthorized = (msg = 'Please log in.') => new HttpError(401, msg);
export const forbidden = (msg = 'You are not allowed to do that.') => new HttpError(403, msg);
export const notFound = (msg = 'Not found.') => new HttpError(404, msg);
export const conflict = (msg: string) => new HttpError(409, msg);

/** Parses and validates input; throws a 400 with field messages when invalid. */
export function parse<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.') || '_';
      if (!fields[key]) fields[key] = issue.message;
    }
    throw badRequest(Object.values(fields)[0] ?? 'Invalid input.', { fields });
  }
  return result.data;
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'Invalid input.', details: err.issues });
  }
  // Multer limit errors and similar carry a code.
  const code = (err as { code?: string })?.code;
  if (code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'That file is too large.' });
  if (code && code.startsWith('LIMIT_')) return res.status(400).json({ error: (err as Error).message });
  console.error(err);
  return res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
}

/** Reads a uuid route param, rejecting malformed ids before they reach the database. */
export function idParam(req: Request, name = 'id'): string {
  const v = req.params[name];
  const id = Array.isArray(v) ? v[0] : v;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) throw notFound();
  return id;
}
