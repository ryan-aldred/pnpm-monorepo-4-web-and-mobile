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

## UI Components

This project uses different UI libraries for each platform due to SSR compatibility requirements.

### Expo App (`apps/expo`) - Gluestack UI

Uses `@gluestack-ui/themed` for React Native components. Import from:

```tsx
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  ButtonText,
  Input,
  InputField,
  Pressable,
  Modal,
  // ... etc
} from '@gluestack-ui/themed';
```

The app is wrapped with `GluestackUIProvider` in `app/_layout.tsx`.

### Web App (`apps/web`) - shadcn/ui

Uses **shadcn/ui** components built on Radix UI primitives with Tailwind CSS. Components are located in `apps/web/app/components/ui/`.

```tsx
// Import individual components
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
```

#### Available shadcn Components

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `button.tsx` | Buttons with variants (default, destructive, outline, secondary, ghost, link) |
| `Input` | `input.tsx` | Text inputs |
| `Label` | `label.tsx` | Form labels |
| `Card` | `card.tsx` | Card container with Header, Title, Description, Content, Footer |
| `Alert` | `alert.tsx` | Alert messages with variants (default, destructive) |
| `Select` | `select.tsx` | Dropdown select built on Radix UI |

#### Adding New shadcn Components

1. Copy component from [shadcn/ui](https://ui.shadcn.com/docs/components)
2. Create file in `apps/web/app/components/ui/`
3. Update imports to use `~/lib/utils` for the `cn` utility
4. Install any required Radix dependencies

#### Utility Function

The `cn()` utility combines `clsx` and `tailwind-merge` for conditional class names:

```tsx
import { cn } from '~/lib/utils';

<div className={cn("base-class", isActive && "active-class", className)} />
```

### Guidelines for New Features

1. **Expo**: Use Gluestack UI components from `@gluestack-ui/themed`
2. **Web**: Use shadcn/ui components from `~/components/ui/`
3. **Don't mix**: Each platform has its own component library
4. **Expo styling**: Use Gluestack's token-based props (`bg="$primary500"`, `p="$4"`)
5. **Web styling**: Use Tailwind CSS classes and shadcn variants

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
