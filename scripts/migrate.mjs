/**
 * migrate.mjs — Runs SQL migrations against Supabase.
 *
 * Uses exec_sql(query TEXT) Postgres function via RPC for all operations.
 * Tracks applied migrations in `_migrations` table.
 *
 * Requires env vars:
 *   SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * One-time setup — run in Supabase SQL Editor:
 *   CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
 *   RETURNS VOID AS $$ BEGIN EXECUTE query; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
 */
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, '..', 'supabase', 'migrations');

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.warn('[migrate] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — skipping.');
  process.exit(0);
}

async function execSql(sql) {
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`SQL failed (${res.status}): ${body}`);
  }
}

async function main() {
  console.log('[migrate] Starting database migrations...');

  // Ensure _migrations table
  await execSql(
    `CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ DEFAULT NOW()
    )`
  );

  // Read migration files
  let files;
  try {
    files = (await readdir(MIGRATIONS_DIR)).filter(f => f.endsWith('.sql')).sort();
  } catch {
    console.log('[migrate] No migrations directory — skipping.');
    return;
  }

  if (files.length === 0) {
    console.log('[migrate] No migration files found.');
    return;
  }

  for (const file of files) {
    const safeName = file.replace(/'/g, "''");

    // Step 1: Run migration SQL (idempotent — uses IF NOT EXISTS)
    const sql = await readFile(join(MIGRATIONS_DIR, file), 'utf-8');
    console.log(`[migrate] Applying: ${file}`);
    await execSql(sql);

    // Step 2: Record migration (ON CONFLICT = already applied, skip)
    await execSql(
      `INSERT INTO _migrations (name) VALUES ('${safeName}') ON CONFLICT (name) DO NOTHING`
    );

    console.log(`[migrate] Done: ${file}`);
  }

  console.log('[migrate] All migrations up to date.');
}

main().catch(err => {
  console.error('[migrate] Fatal:', err.message);
  process.exit(1);
});
