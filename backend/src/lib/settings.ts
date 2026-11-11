// App-wide settings the admins can change from the console.

import { db, schema } from '../db/index.js';

export type Settings = {
  signupsOpen: boolean; // new accounts can be created
  liveHostPolicy: 'ANYONE' | 'VERIFIED'; // who can start live sessions
  communityCreatePolicy: 'ANYONE' | 'VERIFIED'; // who can create communities
  announcement: string; // shown at the top of everyone's Home ('' for none)
};

export const DEFAULT_SETTINGS: Settings = {
  signupsOpen: true,
  liveHostPolicy: 'ANYONE',
  communityCreatePolicy: 'ANYONE',
  announcement: '',
};

let cache: { value: Settings; at: number } | null = null;

export async function getSettings(): Promise<Settings> {
  if (cache && Date.now() - cache.at < 10_000) return cache.value;
  const rows = await db.select().from(schema.settings);
  const value = { ...DEFAULT_SETTINGS };
  for (const r of rows) if (r.key in value) (value as Record<string, unknown>)[r.key] = r.value;
  cache = { value, at: Date.now() };
  return value;
}

export async function saveSettings(patch: Partial<Settings>): Promise<Settings> {
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    await db
      .insert(schema.settings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.settings.key, set: { value, updatedAt: new Date() } });
  }
  cache = null;
  return getSettings();
}
