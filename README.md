# Expo + React Router 7 Monorepo

A production-ready monorepo setup with Expo (React Native) and React Router 7 (web) sharing components, business logic, and types.

## Architecture

- **Web App**: React Router 7 powered by Vite (SSR + API server)
- **Mobile App**: Expo with React Native and Expo Router
- **Shared Packages**:
  - `@monorepo/ui`: Cross-platform component library with NativeWind
  - `@monorepo/core`: Business logic, API client, hooks, and utilities
  - `@monorepo/types`: Shared TypeScript types
  - `@monorepo/config-*`: Shared ESLint, TypeScript, and Prettier configs

## Key Features

- 60-80% code reuse across platforms
- TypeScript strict mode for maximum type safety
- NativeWind (Tailwind CSS for React Native)
- Platform-specific components via `.native.tsx` pattern
- React Router 7 serves as both web app and API server
- Hot reload across all workspace packages
- pnpm workspace for fast, efficient dependency management

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Expo CLI (install globally: `npm install -g expo-cli`)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the root and all workspace packages.

### 2. Build Core Package

The web app requires the core package to be built for SSR to work:

```bash
pnpm --filter @monorepo/core build
```

### 3. Start Development Servers

#### Start both apps simultaneously:
```bash
pnpm dev
```

#### Or start them individually:

**Web app** (React Router 7):
```bash
pnpm dev:web
# Runs on http://localhost:5173
```

**Mobile app** (Expo):
```bash
pnpm dev:expo
# Opens Expo DevTools
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR code for physical device
```

### 4. Configure API URL for Expo

For **simulators/emulators**, the default localhost URL works:
```bash
# apps/expo/.env
EXPO_PUBLIC_API_URL=http://localhost:5173
```

For **physical devices**, use your computer's local IP:
```bash
# Find your local IP:
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig

# Then update .env:
EXPO_PUBLIC_API_URL=http://192.168.1.100:5173
```

### 5. Development Workflow with Package Building

When working on the `@monorepo/core` package, you need to rebuild it for changes to appear in the web app's SSR. This is because React Router 7's SSR runs code in Node.js, which requires proper ES modules with file extensions.

**Recommended workflow:**

Option 1: Build on change (recommended)
```bash
# In one terminal
pnpm --filter @monorepo/core dev

# In another terminal
pnpm dev:web
```

Option 2: Manual rebuild after changes
```bash
pnpm --filter @monorepo/core build
# Then restart web dev server
```

**Why is this needed?**
- React Router 7 SSR loads workspace packages directly via Node.js ESM
- Node.js ESM requires explicit `.js` extensions in imports
- TypeScript doesn't transpile source files, so we build to `dist/` with proper extensions
- The built package maintains full type safety via `.d.ts` files
- Tree-shaking and individual imports still work perfectly

**What gets built:**
- Source: `packages/core/src/**/*.ts`
- Output: `packages/core/dist/**/*.js` + `.d.ts` + `.js.map`
- You keep full TypeScript autocomplete and type checking
- Import paths remain the same: `import { getUsers } from '@monorepo/core/data'`

## Project Structure

```
expo-rr7-prototype/
├── apps/
│   ├── expo/                    # React Native mobile app
│   │   ├── app/                 # Expo Router pages
│   │   ├── metro.config.js      # Critical monorepo config
│   │   └── package.json
│   └── web/                     # React Router 7 web app
│       ├── app/
│       │   ├── routes/          # Pages and API routes
│       │   │   └── api/         # API endpoints for Expo
│       │   └── root.tsx
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   ├── ui/                      # Shared component library
│   │   └── src/
│   │       ├── components/
│   │       │   └── Button/
│   │       │       ├── Button.tsx        # Web version
│   │       │       ├── Button.native.tsx # Native version
│   │       │       └── types.ts          # Shared types
│   │       └── primitives/      # View, Text primitives
│   ├── core/                    # Business logic
│   │   └── src/
│   │       ├── api/             # API client for Expo
│   │       ├── hooks/           # Shared React hooks
│   │       └── utils/           # Utilities & validation
│   ├── types/                   # Shared TypeScript types
│   └── config/                  # Shared configs
│       ├── typescript/
│       ├── eslint/
│       └── prettier/
├── pnpm-workspace.yaml
└── package.json
```

## How It Works

### Platform-Specific Components

Components can have platform-specific implementations:

```typescript
// packages/ui/src/components/Button/Button.tsx (Web)
export function Button({ onPress, children }) {
  return <button onClick={onPress}>{children}</button>;
}

// packages/ui/src/components/Button/Button.native.tsx (Native)
export function Button({ onPress, children }) {
  return <Pressable onPress={onPress}><Text>{children}</Text></Pressable>;
}

// Both platforms import the same way:
import { Button } from '@monorepo/ui';
```

Metro (Expo) automatically picks `.native.tsx`, Vite (web) picks `.tsx`.

### API Communication

**Web app** (React Router 7):
- Uses loaders and actions directly (no HTTP)
- Accesses database or services directly

**Expo app**:
- Makes HTTP requests to React Router 7 API
- Uses shared `apiClient` from `@monorepo/core`

```typescript
// Web: apps/web/app/routes/api/users.ts
export async function loader() {
  const users = await db.users.findMany();
  return Response.json(users);
}

// Expo: apps/expo/app/index.tsx
import { useData } from '@monorepo/core';

function HomeScreen() {
  const { data, loading } = useData<User[]>('/api/users');
  // ...
}
```

### Styling with NativeWind

Use Tailwind classes that work on both platforms:

```tsx
// Works on web AND native!
<View className="flex-1 bg-blue-500 p-4">
  <Text className="text-white font-bold">Hello World</Text>
</View>
```

## Available Scripts

### Root Level

- `pnpm dev` - Start both web and Expo apps
- `pnpm dev:web` - Start web app only
- `pnpm dev:expo` - Start Expo app only
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean all node_modules and build artifacts

### Web App (apps/web)

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint code
- `pnpm type-check` - Check TypeScript types

### Expo App (apps/expo)

- `pnpm dev` - Start Expo dev server
- `pnpm ios` - Start on iOS simulator
- `pnpm android` - Start on Android emulator
- `pnpm web` - Start Expo web version
- `pnpm lint` - Lint code
- `pnpm type-check` - Check TypeScript types

### Core Package (packages/core)

- `pnpm build` - Build package (required for web SSR)
- `pnpm dev` - Build package in watch mode
- `pnpm type-check` - Check TypeScript types
- `pnpm test` - Run tests with Vitest

## Adding New Packages

To add a dependency to a specific workspace:

```bash
# Add to web app
pnpm --filter @monorepo/web add react-query

# Add to Expo app
pnpm --filter @monorepo/expo add @react-native-async-storage/async-storage

# Add to shared UI package
pnpm --filter @monorepo/ui add clsx

# Add to root (dev dependency)
pnpm add -D -w eslint
```

## Creating New Shared Components

1. Create component files in `packages/ui/src/components/YourComponent/`
2. Add platform-specific implementations if needed (`.tsx` and `.native.tsx`)
3. Export from `packages/ui/src/components/YourComponent/index.ts`
4. Add to `packages/ui/src/index.ts`
5. Import in apps: `import { YourComponent } from '@monorepo/ui'`

## Troubleshooting

### Metro can't find workspace packages

Ensure `apps/expo/metro.config.js` has correct monorepo root path:
```js
const monorepoRoot = path.resolve(projectRoot, '../..');
config.watchFolders = [monorepoRoot];
```

### Type conflicts between react-native and react-dom

This is normal. Each app has its own `tsconfig.json` with proper `lib` settings.

### Expo can't reach API on physical device

Use your computer's local IP instead of `localhost` in `EXPO_PUBLIC_API_URL`.

### Styles look different on web vs native

Some Tailwind features work differently on native. Use platform-specific files for complex styling.

### "Cannot find module" errors in web app SSR

If you see errors like `Cannot find module '/packages/core/src/data/users'`:
1. Make sure you've built the core package: `pnpm --filter @monorepo/core build`
2. For active development, run the build in watch mode: `pnpm --filter @monorepo/core dev`
3. Check that `packages/core/dist/` exists and contains `.js` files
4. Clear Vite cache: `rm -rf apps/web/.react-router apps/web/node_modules/.vite`

## Production Build

### Build All

```bash
# Build packages first
pnpm --filter @monorepo/core build

# Then build web app
pnpm build:web
# Output: apps/web/build/
# Deploy to: Vercel, Railway, Fly.io, etc.
```

### Expo App

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
cd apps/expo
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Web**: React Router 7 + Vite
- **Mobile**: Expo + React Native
- **Styling**: NativeWind (Tailwind CSS)
- **Language**: TypeScript (strict mode)
- **State**: Zustand
- **Linting**: ESLint + Prettier

## License

MIT
