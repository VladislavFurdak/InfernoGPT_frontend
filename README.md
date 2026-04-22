# InfernoGPT

A Next.js chat dashboard that talks to a research agent backend and persists conversations in Supabase. Supports streaming research runs, Markdown + LaTeX rendering, code highlighting, and a simple admin/user auth model.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **Supabase** (Postgres) for users, chats, and messages
- **Tailwind CSS 4** for styling
- **bcryptjs** for password hashing
- **react-markdown** + `rehype-highlight` / `rehype-raw` / `remark-gfm` + **MathJax** for chat content
- **Vitest** for tests

## Prerequisites

- Node.js 20+
- A Supabase project (URL, anon key, service-role key)
- A running research agent exposing `POST /research`, `GET /research/:id`, etc.

## Environment

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL="https://<your-project>.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="<anon-key>"
SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"   # only needed for migrations
AGENT_API_URL="https://<agent-host>"
AGENT_API_TOKEN="<agent-bearer-token>"
```

`.env.local` is gitignored. Never commit real secrets.

### One-time Supabase setup

The migration runner uses a Postgres RPC. Run this once in the Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION exec_sql(query TEXT)
RETURNS VOID AS $$ BEGIN EXECUTE query; END; $$
LANGUAGE plpgsql SECURITY DEFINER;
```

## Install & run

```bash
npm install
npm run migrate      # apply SQL migrations from supabase/migrations
npm run dev          # start Next.js on http://localhost:3000
```

## Scripts

| Script            | What it does                                                     |
| ----------------- | ---------------------------------------------------------------- |
| `npm run dev`     | Next.js dev server                                               |
| `npm run build`   | Runs migrations, then builds for production                      |
| `npm run start`   | Starts the production build                                      |
| `npm run migrate` | Applies `supabase/migrations/*.sql` and records them             |
| `npm run lint`    | ESLint                                                           |
| `npm run test`    | Vitest (one-shot)                                                |
| `npm test:watch`  | Vitest watch mode                                                |

## Project layout

```
src/
  app/
    layout.jsx, page.jsx             # root shell + home
    login/, addUser/                 # auth pages
    api/
      auth/login/                    # POST — email+password, returns token
      admin/users/                   # admin user management
      chats/                         # CRUD for chats and messages
      research/[runId]/              # create run, poll, stream SSE, dump
      health/capacity/               # backend capacity probe
  components/
    chat/                            # ChatArea, ChatFeed, messages, input
    sidebar/                         # history, profile
    ui/                              # shared primitives
  context/                           # ChatContext
  lib/
    agent.js                         # server-side agent URL + auth header
    supabase.js                      # Supabase client factory
scripts/migrate.mjs                  # SQL migration runner
supabase/migrations/                 # versioned SQL files
```

## Authentication

Two login paths in `src/app/api/auth/login/route.js`:

1. **Admin** — hardcoded email `admin`. The admin password constant in the route file is currently empty, which means admin login is effectively disabled (the `!password` guard rejects empty passwords before the admin check). Move this to an env var (e.g. `ADMIN_PASSWORD`) before enabling.
2. **Regular user** — looked up in the `app_users` table; password checked with bcrypt.

Both paths return a base64-encoded JSON token with `{ userId, email, role, exp }`. This token is **not cryptographically signed** — replace with a signed JWT before production.

## Research agent

The frontend never talks to the agent directly. All calls go through Next.js API routes under `src/app/api/research/...`, which attach `Authorization: Bearer ${AGENT_API_TOKEN}` server-side (see [src/lib/agent.js](src/lib/agent.js)). The token never reaches the browser.

## Security notes

- Keep `.env.local`, `.claude/`, and any `*.key`/`*.pem` files out of git (already gitignored).
- Rotate `AGENT_API_TOKEN` and the Supabase anon key if they have been exposed.
- The session token scheme is not signed — treat it as a placeholder and swap for a real JWT implementation before shipping.
