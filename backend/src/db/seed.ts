// Loads NSUK faculties and departments. Safe to run more than once.
import { sql } from 'drizzle-orm';
import { db, pool, schema } from './index.js';
import { FACULTIES } from './faculties.js';

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  for (const f of FACULTIES) {
    const [faculty] = await db
      .insert(schema.faculties)
      .values({ name: f.name, slug: slugify(f.name), campus: f.campus ?? null })
      .onConflictDoUpdate({ target: schema.faculties.name, set: { campus: f.campus ?? null } })
      .returning();
    await db
      .insert(schema.departments)
      .values(f.departments.map((name) => ({ name, facultyId: faculty.id })))
      .onConflictDoNothing();
  }
  const [{ f }] = await db.select({ f: sql<number>`count(*)::int` }).from(schema.faculties);
  const [{ d }] = await db.select({ d: sql<number>`count(*)::int` }).from(schema.departments);
  console.log(`Faculties: ${f}, departments: ${d}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
