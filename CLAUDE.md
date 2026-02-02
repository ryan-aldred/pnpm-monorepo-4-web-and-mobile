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

| Command                  | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `pnpm dev`               | Run all apps (core, web, expo)                         |
| `pnpm dev:web`           | Run web app with dependencies                          |
| `pnpm dev:expo`          | Run expo app with dependencies                         |
| `pnpm build`             | Build all packages and apps                            |
| `pnpm build:web`         | Build web app                                          |
| `pnpm build:expo`        | Build expo app                                         |
| `pnpm build:packages`    | Build all packages                                     |
| `pnpm test`              | Run all tests                                          |
| `pnpm test:web`          | Run web tests                                          |
| `pnpm test:expo`         | Run expo tests                                         |
| `pnpm lint`              | Lint all packages                                      |
| `pnpm type-check`        | Type check all packages                                |
| `pnpm db:generate`       | Generate Drizzle migrations                            |
| `pnpm db:migrate:local`  | Apply migrations to local D1                           |
| `pnpm db:migrate:remote` | Apply migrations to remote D1                          |
| `pnpm db:studio`         | Open Drizzle Studio                                    |
| `pnpm wrangler <args>`   | Run wrangler commands                                  |
| `pnpm deploy:web`        | Deploy web app to Cloudflare                           |
| `pnpm i18n:extract`      | Extract new strings from code to .po files             |
| `pnpm i18n:translate`    | AI translate missing strings (needs ANTHROPIC_API_KEY) |
| `pnpm i18n:compile`      | Compile .po files to runtime .mjs format               |
| `pnpm i18n:sync`         | Extract + translate + compile in sequence              |

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '~/components/ui/card';
import { Alert, AlertDescription } from '~/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
```

#### Available shadcn Components

| Component | File         | Purpose                                                                       |
| --------- | ------------ | ----------------------------------------------------------------------------- |
| `Button`  | `button.tsx` | Buttons with variants (default, destructive, outline, secondary, ghost, link) |
| `Input`   | `input.tsx`  | Text inputs                                                                   |
| `Label`   | `label.tsx`  | Form labels                                                                   |
| `Card`    | `card.tsx`   | Card container with Header, Title, Description, Content, Footer               |
| `Alert`   | `alert.tsx`  | Alert messages with variants (default, destructive)                           |
| `Select`  | `select.tsx` | Dropdown select built on Radix UI                                             |

#### Adding New shadcn Components

1. Copy component from [shadcn/ui](https://ui.shadcn.com/docs/components)
2. Create file in `apps/web/app/components/ui/`
3. Update imports to use `~/lib/utils` for the `cn` utility
4. Install any required Radix dependencies

#### Utility Function

The `cn()` utility combines `clsx` and `tailwind-merge` for conditional class names:

```tsx
import { cn } from '~/lib/utils';

<div className={cn('base-class', isActive && 'active-class', className)} />;
```

### Guidelines for New Features

1. **Expo**: Use Gluestack UI components from `@gluestack-ui/themed`
2. **Web**: Use shadcn/ui components from `~/components/ui/`
3. **Don't mix**: Each platform has its own component library
4. **Expo styling**: Use Gluestack's token-based props (`bg="$primary500"`, `p="$4"`)
5. **Web styling**: Use Tailwind CSS classes and shadcn variants

## Light/Dark Mode (Theming)

Both apps support light/dark mode with system preference detection and user toggle.

### Architecture

| App  | Provider                      | Persistence    | Hook         |
| ---- | ----------------------------- | -------------- | ------------ |
| Web  | `~/theme` (`ThemeProvider`)   | `localStorage` | `useTheme()` |
| Expo | `lib/theme` (`ThemeProvider`) | `AsyncStorage` | `useTheme()` |

The `useTheme()` hook returns:

- `theme`: Current setting (`'light'` | `'dark'` | `'system'`)
- `resolvedTheme`: Actual theme being displayed (`'light'` | `'dark'`)
- `setTheme(theme)`: Function to change theme
- `isDark`: Boolean (Expo only)

### Web App - Tailwind Semantic Classes

**IMPORTANT**: Always use semantic Tailwind classes instead of hardcoded colors. This ensures automatic dark mode support.

```tsx
// CORRECT - uses CSS variables that adapt to theme
<div className="bg-background text-foreground" />
<div className="border-border" />
<div className="text-muted-foreground" />
<div className="hover:bg-accent hover:text-accent-foreground" />

// WRONG - hardcoded colors don't adapt to dark mode
<div className="bg-white text-gray-900" />
<div className="border-gray-200" />
<div className="text-gray-600" />
<div className="hover:bg-gray-100" />
```

#### Available Semantic Classes

| Class                     | Light Mode | Dark Mode  | Use For                  |
| ------------------------- | ---------- | ---------- | ------------------------ |
| `bg-background`           | White      | Dark gray  | Page/section backgrounds |
| `text-foreground`         | Near black | Near white | Primary text             |
| `text-muted-foreground`   | Gray       | Light gray | Secondary text           |
| `bg-card`                 | White      | Dark gray  | Card backgrounds         |
| `border-border`           | Light gray | Dark gray  | Borders                  |
| `bg-accent`               | Light gray | Dark gray  | Hover states             |
| `text-accent-foreground`  | Near black | Near white | Text on accent bg        |
| `bg-primary`              | Blue       | Blue       | Primary buttons          |
| `text-primary-foreground` | White      | Dark       | Text on primary bg       |
| `bg-destructive`          | Red        | Dark red   | Destructive actions      |
| `bg-popover`              | White      | Dark gray  | Dropdowns, modals        |

### Expo App - Gluestack colorMode

The `GluestackUIProvider` receives `colorMode` from the theme context. Gluestack components automatically adapt.

For custom styling, use Gluestack's theme-aware tokens or the `useTheme()` hook:

```tsx
import { useTheme } from '../lib/theme';

function MyComponent() {
  const { isDark } = useTheme();

  return (
    <Box bg={isDark ? '$backgroundDark900' : '$backgroundLight0'}>
      {/* content */}
    </Box>
  );
}
```

### Adding Theme Toggle to New Screens

The theme toggle is already in the header for both apps. If you need to add it elsewhere:

```tsx
// Web
import { ThemeToggle } from '~/components/ThemeToggle';

// Expo
import { ThemeToggle } from '../lib/components/ThemeToggle';
```

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

| Location                                         | Purpose                                     |
| ------------------------------------------------ | ------------------------------------------- |
| `packages/i18n/src/locales/{locale}/messages.po` | Common translations (auth, errors, actions) |
| `apps/web/app/locales/{locale}/messages.po`      | Web-specific translations                   |
| `apps/expo/locales/{locale}/messages.po`         | Mobile-specific translations                |

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

## Error Boundaries

Both apps have error boundaries for graceful error handling with i18n support and dark mode styling.

### Web App (`apps/web`)

Error boundaries use React Router's error handling pattern. Components are in `apps/web/app/components/error/`.

| Component            | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `RootErrorBoundary`  | Full-page error for root layout (no hooks needed) |
| `RouteErrorBoundary` | Inline error for individual routes (uses hooks)   |

**Adding to new routes:**

```tsx
// In any route file (e.g., apps/web/app/routes/my-route.tsx)
export { RouteErrorBoundary as ErrorBoundary } from '~/components/error';
```

The root error boundary is already exported from `apps/web/app/root.tsx`.

**Features:**

- Error classification (404, 401/403, network, unexpected)
- i18n translations via `getI18nInstance(DEFAULT_LOCALE)` (root) or `useI18n()` (route)
- Collapsible error details in development (`import.meta.env.DEV`)
- Recovery actions: Try Again, Go Home, Go Back

### Expo App (`apps/expo`)

Error boundaries use expo-router's `ErrorBoundary` export pattern. Components are in `apps/expo/lib/components/`.

| Component             | Purpose                                                      |
| --------------------- | ------------------------------------------------------------ |
| `RootErrorBoundary`   | Minimal error screen (no providers, uses React Native)       |
| `ExpoErrorBoundary`   | Full-featured error screen (requires I18n + Theme providers) |
| `ErrorBoundary`       | Class-based wrapper for custom error handling                |
| `ErrorFallbackScreen` | Reusable error UI component                                  |

**Adding to new layouts:**

```tsx
// Root layout (no provider access) - apps/expo/app/_layout.tsx
export { RootErrorBoundary as ErrorBoundary } from '../lib/components/RootErrorBoundary';

// Nested layouts (has provider access) - apps/expo/app/(auth)/_layout.tsx
export { ExpoErrorBoundary as ErrorBoundary } from '../../lib/components/ExpoErrorBoundary';
```

**Features:**

- Gluestack UI styling with dark mode support
- i18n translations via `useLingui()`
- Collapsible error details in development (`__DEV__`)
- Recovery actions: Try Again, Go Home

### Error Translation Keys

All error messages are in `packages/i18n/src/locales/{locale}/messages.po`:

| Key                          | English                                              |
| ---------------------------- | ---------------------------------------------------- |
| `error.unexpected.title`     | Something went wrong                                 |
| `error.unexpected.message`   | An unexpected error occurred. Please try again.      |
| `error.notFound.title`       | Page not found                                       |
| `error.notFound.message`     | The page you're looking for doesn't exist.           |
| `error.network.title`        | Connection error                                     |
| `error.network.message`      | Please check your internet connection and try again. |
| `error.unauthorized.title`   | Access denied                                        |
| `error.unauthorized.message` | You don't have permission to view this page.         |
| `error.action.tryAgain`      | Try Again                                            |
| `error.action.goHome`        | Go to Home                                           |
| `error.action.goBack`        | Go Back                                              |
| `error.details.title`        | Error Details                                        |

## Form Validation (Valibot)

All schema validations use [Valibot](https://valibot.dev/) in `packages/core/src/validation/`. Schemas are shared across web and mobile apps.

### File Structure

```
packages/core/src/validation/
├── index.ts              # Re-exports everything
├── types.ts              # TypeScript types (FieldError, ValidationResult, FieldErrors)
├── schemas/
│   ├── index.ts          # Re-exports all schemas
│   ├── auth.ts           # Login, Register, Email, Password schemas
│   └── user.ts           # CreateUser, UpdateUser schemas
└── utils/
    ├── index.ts          # Re-exports all utils
    ├── errors.ts         # validate(), errorsToMap(), getFieldError()
    ├── i18n.ts           # translateErrors(), translateError()
    └── api.ts            # validateRequest() for API routes
```

### Creating Schemas

Use i18n keys for error messages (not hardcoded strings):

```tsx
import * as v from 'valibot';

// Basic field schema with i18n error messages
export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('validation.email.required'),
  v.email('validation.email.invalid')
);

// Schema with multiple validations
export const StrongPasswordSchema = v.pipe(
  v.string(),
  v.nonEmpty('validation.password.required'),
  v.minLength(8, 'validation.password.minLength'),
  v.regex(/[a-z]/, 'validation.password.lowercase'),
  v.regex(/[A-Z]/, 'validation.password.uppercase'),
  v.regex(/[0-9]/, 'validation.password.number')
);

// Object schema
export const LoginSchema = v.object({
  email: EmailSchema,
  password: PasswordSchema,
});

// Cross-field validation (e.g., confirmPassword)
export const RegisterSchema = v.pipe(
  v.object({
    name: NameSchema,
    email: EmailSchema,
    password: StrongPasswordSchema,
    confirmPassword: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['confirmPassword']],
      (input) => input.password === input.confirmPassword,
      'validation.password.mismatch'
    ),
    ['confirmPassword']
  )
);

// Infer TypeScript types from schemas
export type LoginInput = v.InferInput<typeof LoginSchema>;
```

### Using Validation in Components

```tsx
import {
  LoginSchema,
  validate,
  errorsToMap,
  type FieldErrors,
} from '@monorepo/core/validation';

const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setFieldErrors({});

  const result = validate(LoginSchema, { email, password });
  if (!result.success) {
    setFieldErrors(errorsToMap(result.errors!));
    return;
  }

  // result.data is typed as LoginInput
  await signIn(result.data);
};
```

### API Route Validation

```tsx
import { validateRequest, LoginSchema } from '@monorepo/core/validation';

export async function action({ request }: ActionFunctionArgs) {
  const result = await validateRequest(LoginSchema, request);

  if (!result.success) {
    return result.response; // Returns 400 with validation errors
  }

  // result.data is typed and validated
  return handleLogin(result.data);
}
```

### i18n Integration

Validation error messages are i18n keys. Add translations to `packages/i18n/src/locales/{locale}/messages.po`:

```po
msgid "validation.email.required"
msgstr "Email is required"

msgid "validation.email.invalid"
msgstr "Please enter a valid email address"
```

To translate errors for display:

```tsx
import { translateErrors } from '@monorepo/core/validation';
import { useI18n } from '~/i18n';

const i18n = useI18n();
const translatedErrors = translateErrors(fieldErrors, (key) => i18n._(key));
```

### Adding New Schemas

1. Create schema in `packages/core/src/validation/schemas/` (or add to existing file)
2. Export from `packages/core/src/validation/schemas/index.ts`
3. Add i18n keys to `packages/i18n/src/locales/en/messages.po`
4. Run `pnpm i18n:translate && pnpm i18n:compile`

### Common Valibot Patterns

```tsx
import * as v from 'valibot';

// Optional fields
v.optional(EmailSchema);

// Nullable
v.nullable(v.string());

// Arrays
v.array(v.string());

// Enums
v.picklist(['admin', 'user', 'guest']);

// Numbers
v.pipe(v.number(), v.minValue(0), v.maxValue(100));

// Dates
v.pipe(v.string(), v.isoDate());

// Custom validation
v.pipe(
  v.string(),
  v.custom((input) => myCustomCheck(input), 'validation.custom.error')
);
```

## SEO Metadata (Web App)

The web app has a comprehensive metadata framework for SEO, OpenGraph, Twitter Cards, and JSON-LD structured data.

### File Structure

```
apps/web/app/lib/meta/
├── index.ts           # Re-exports all utilities
├── types.ts           # TypeScript interfaces
├── config.ts          # Site-wide defaults (siteName, siteUrl, etc.)
├── create-meta.ts     # Main createMeta() helper
└── structured-data.ts # JSON-LD schema helpers
```

### Basic Usage

```tsx
import { createMeta } from '~/lib/meta';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () =>
  createMeta({
    title: 'About Us',
    description: 'Learn more about our company',
    canonical: '/about',
  });
```

This generates: title (with site name template), description, OpenGraph tags, Twitter Card tags, and uses the default OG image.

### MetaConfig Options

| Option            | Type                              | Description                                |
| ----------------- | --------------------------------- | ------------------------------------------ |
| `title`           | `string`                          | Page title (templated with site name)      |
| `description`     | `string`                          | Meta description                           |
| `canonical`       | `string`                          | Canonical URL path (relative)              |
| `ogType`          | `'website' \| 'article'`          | OpenGraph type (default: `'website'`)      |
| `ogImage`         | `string \| OgImage`               | OG image URL or object with dimensions     |
| `twitterCard`     | `'summary' \| 'summary_large_image'` | Twitter card type                       |
| `robots`          | `RobotsConfig \| string`          | Robots directives                          |
| `article`         | `ArticleMeta`                     | Article metadata (when ogType is article)  |
| `noTitleTemplate` | `boolean`                         | Disable "Title \| Site Name" template      |
| `custom`          | `MetaDescriptor[]`                | Additional custom meta tags                |

### Robots Configuration

```tsx
// Object form (recommended)
createMeta({
  robots: { index: false, follow: true },
});

// String form
createMeta({
  robots: 'noindex, nofollow',
});
```

### Article Metadata (Blog Posts)

```tsx
createMeta({
  title: 'How to Build a Monorepo',
  description: 'A guide to monorepo architecture',
  ogType: 'article',
  article: {
    publishedTime: '2024-01-15T10:00:00Z',
    modifiedTime: '2024-01-20T15:30:00Z',
    author: 'John Doe',
    section: 'Engineering',
    tags: ['monorepo', 'typescript', 'react'],
  },
});
```

### JSON-LD Structured Data

Use the `JsonLd` component with schema helpers:

```tsx
import { createMeta, createWebSiteSchema, createWebPageSchema } from '~/lib/meta';
import { JsonLd } from '~/components/JsonLd';

// Home page with WebSite schema
export default function Home() {
  return (
    <>
      <JsonLd schema={createWebSiteSchema()} />
      {/* content */}
    </>
  );
}

// Generic page with WebPage schema
export default function About() {
  return (
    <>
      <JsonLd schema={createWebPageSchema({
        name: 'About Us',
        path: '/about',
        description: 'Learn about our company',
      })} />
      {/* content */}
    </>
  );
}
```

#### Available Schema Helpers

| Function                  | Use Case                    |
| ------------------------- | --------------------------- |
| `createWebSiteSchema()`   | Home page                   |
| `createWebPageSchema()`   | Generic pages               |
| `createArticleSchema()`   | Blog posts                  |
| `createBreadcrumbSchema()`| Navigation breadcrumbs      |

### Canonical Links

For the route's `links` export:

```tsx
import { createCanonicalLink } from '~/lib/meta';

export const links = () => [createCanonicalLink('/about')];
```

### Adding Meta to New Routes

1. Import `createMeta` from `~/lib/meta`
2. Export a `meta` function that calls `createMeta()`
3. Optionally add JSON-LD with the `JsonLd` component

```tsx
// Minimal route with meta
import { createMeta } from '~/lib/meta';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () =>
  createMeta({
    title: 'New Page',
    description: 'Description for SEO',
  });

export default function NewPage() {
  return <div>Content</div>;
}
```

### Site Configuration

Edit `apps/web/app/lib/meta/config.ts` to change site-wide defaults:

- `siteName` - Site name for OG tags and title template
- `siteUrl` - Base URL (reads from `SITE_URL` env var)
- `defaultImage` - Default OG image
- `defaultDescription` - Fallback description
- `twitterHandle` - Twitter @handle for twitter:site
- `titleTemplate` - Title format (default: `'%s | Site Name'`)

### Sitemap

The sitemap is at `/sitemap.xml` (route: `apps/web/app/routes/sitemap[.]xml.ts`).

To add new static URLs, edit the `staticUrls` array. For dynamic URLs, fetch from database in the loader.
