// Applies the SQL migrations in ./drizzle to the database in DATABASE_URL.
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './index.js';

migrate(db, { migrationsFolder: 'drizzle' })
  .then(() => console.log('Database is up to date.'))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
