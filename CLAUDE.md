# Claude Code Instructions

## Running Commands

Always prefer root-level pnpm scripts over `--filter` commands:

```bash
# Preferred
pnpm dev:web
pnpm build:web
pnpm test:web
pnpm db:generate
pnpm db:migrate:local
pnpm wrangler secret put AUTH_SECRET

# Avoid
pnpm --filter @monorepo/web dev
pnpm --filter @monorepo/database db:generate
```

## Available Root Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Run all apps (core, web, expo) |
| `pnpm dev:web` | Run web app with dependencies |
| `pnpm dev:expo` | Run expo app with dependencies |
| `pnpm build` | Build all packages and apps |
| `pnpm build:web` | Build web app |
| `pnpm build:expo` | Build expo app |
| `pnpm build:packages` | Build all packages |
| `pnpm test` | Run all tests |
| `pnpm test:web` | Run web tests |
| `pnpm test:expo` | Run expo tests |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | Type check all packages |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate:local` | Apply migrations to local D1 |
| `pnpm db:migrate:remote` | Apply migrations to remote D1 |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm wrangler <args>` | Run wrangler commands |
| `pnpm deploy:web` | Deploy web app to Cloudflare |

## Project Structure

- `apps/web` - React Router 7 web app (Cloudflare Workers)
- `apps/expo` - Expo/React Native mobile app
- `packages/core` - Shared business logic and hooks
- `packages/database` - Drizzle schema and database utilities
- `packages/ui` - Shared UI components
- `packages/types` - Shared TypeScript types
