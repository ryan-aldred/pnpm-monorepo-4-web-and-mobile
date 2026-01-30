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
| `pnpm i18n:extract` | Extract new strings from code to .po files |
| `pnpm i18n:translate` | AI translate missing strings (needs ANTHROPIC_API_KEY) |
| `pnpm i18n:compile` | Compile .po files to runtime .mjs format |
| `pnpm i18n:sync` | Extract + translate + compile in sequence |

## Project Structure

- `apps/web` - React Router 7 web app (Cloudflare Workers)
- `apps/expo` - Expo/React Native mobile app
- `packages/core` - Shared business logic and hooks
- `packages/database` - Drizzle schema and database utilities
- `packages/ui` - Shared UI components
- `packages/types` - Shared TypeScript types
- `packages/i18n` - Shared i18n utilities and common translations

## Internationalization (i18n)

### Architecture

```
.po files (source of truth)
    ↓
scripts/compile-i18n.ts (compiles to string-keyed .mjs)
    ↓
apps/web/app/i18n/setup.ts (loads and merges translations)
    ↓
Custom I18nProvider (React Context in apps/web/app/i18n/provider.tsx)
```

### Translation Files

| Location | Purpose |
|----------|---------|
| `packages/i18n/src/locales/{locale}/messages.po` | Common translations (auth, errors, actions) |
| `apps/web/app/locales/{locale}/messages.po` | Web-specific translations |
| `apps/expo/locales/{locale}/messages.po` | Mobile-specific translations |

### Adding New Translations

1. Use in code: `i18n._("New string here")`
2. Run `pnpm i18n:extract` to add to .po files
3. Run `pnpm i18n:translate` to AI translate (or manually edit .po files)
4. Run `pnpm i18n:compile` to generate runtime files

### Supported Locales

- `en` - English (source)
- `es` - Spanish
- `fr` - French

### GitHub Automation

The `.github/workflows/i18n-translate.yml` workflow automatically:
1. Extracts new strings on push to main
2. AI translates missing strings using Claude
3. Creates a PR for review

Requires `ANTHROPIC_API_KEY` in GitHub repo secrets
