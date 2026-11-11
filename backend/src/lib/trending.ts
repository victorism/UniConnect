// Trending score for a post during its first 24 hours.
//
// Each kind of engagement is weighted by how much effort it takes, then the
// total is divided by the post's age so newer activity outranks older activity
// (the same "gravity" idea Hacker News uses). Posts leave trending at 24 hours.

export const WEIGHTS = { views: 1, clicks: 2, likes: 2, replies: 3, comments: 4, shares: 5 } as const;
const GRAVITY = 1.5;

export type Engagement = { views: number; clicks: number; likes: number; comments: number; replies: number; shares: number };

export function trendingScore(e: Engagement, createdAt: Date, now = Date.now()): number {
  const points =
    e.views * WEIGHTS.views +
    e.clicks * WEIGHTS.clicks +
    e.likes * WEIGHTS.likes +
    e.replies * WEIGHTS.replies +
    e.comments * WEIGHTS.comments +
    e.shares * WEIGHTS.shares;
  const hours = Math.max(0, (now - createdAt.getTime()) / 3_600_000);
  return points / Math.pow(hours + 2, GRAVITY);
}
