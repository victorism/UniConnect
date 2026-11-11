import { Router } from 'express';
import { asc } from 'drizzle-orm';
import { config } from '../config.js';
import { db, schema } from '../db/index.js';
import { livekitConfigured } from '../lib/livekit.js';
import { getSettings } from '../lib/settings.js';

export const metaRouter = Router();

// Faculties with their departments, for the sign-up form. Public.
metaRouter.get('/faculties', async (_req, res) => {
  const [facs, depts] = await Promise.all([
    db.select().from(schema.faculties).orderBy(asc(schema.faculties.name)),
    db.select().from(schema.departments).orderBy(asc(schema.departments.name)),
  ]);
  res.set('Cache-Control', 'public, max-age=3600');
  res.json({
    faculties: facs.map((f) => ({
      id: f.id,
      name: f.name,
      campus: f.campus,
      departments: depts.filter((d) => d.facultyId === f.id).map((d) => ({ id: d.id, name: d.name })),
    })),
  });
});

// Tells the app which sign-in options this server has turned on.
metaRouter.get('/config', async (_req, res) => {
  const settings = await getSettings();
  res.json({
    googleSignIn: config.googleClientIds.length > 0,
    liveVideo: livekitConfigured(),
    signupsOpen: settings.signupsOpen,
    announcement: settings.announcement || null,
    statusHours: 24,
    trendingHours: 24,
  });
});
