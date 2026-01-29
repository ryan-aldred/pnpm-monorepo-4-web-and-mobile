# Contributing Guide

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Start development:**
   ```bash
   pnpm dev
   ```

## Development Workflow

### Running Apps

- **Both apps:** `pnpm dev`
- **Web only:** `pnpm dev:web`
- **Expo only:** `pnpm dev:expo`

### Code Quality

Before committing, ensure your code passes all checks:

```bash
# Type check
pnpm type-check

# Lint code
pnpm lint

# Format code
pnpm format
```

### Adding Dependencies

#### To workspace packages:

```bash
# Add to UI package
pnpm --filter @monorepo/ui add package-name

# Add to core package
pnpm --filter @monorepo/core add package-name

# Add dev dependency to root
pnpm add -D -w package-name
```

#### To apps:

```bash
# Add to web app
pnpm --filter @monorepo/web add package-name

# Add to Expo app
pnpm --filter @monorepo/expo add package-name
```

## Project Structure

### Apps

- `apps/web/` - React Router 7 web application
- `apps/expo/` - Expo React Native mobile application

### Shared Packages

- `packages/ui/` - Cross-platform UI component library
- `packages/core/` - Business logic, API client, hooks
- `packages/types/` - Shared TypeScript types
- `packages/config/` - Shared configurations

## Creating New Components

### 1. Create Component Files

```bash
packages/ui/src/components/YourComponent/
├── YourComponent.tsx        # Web implementation
├── YourComponent.native.tsx # Native implementation (if needed)
├── types.ts                 # Shared types
└── index.ts                 # Exports
```

### 2. Web Implementation (`YourComponent.tsx`)

```typescript
import type { YourComponentProps } from './types';

export function YourComponent({ ...props }: YourComponentProps) {
  return <button {...props}>Web version</button>;
}
```

### 3. Native Implementation (`YourComponent.native.tsx`)

```typescript
import { Pressable } from 'react-native';
import type { YourComponentProps } from './types';

export function YourComponent({ ...props }: YourComponentProps) {
  return <Pressable {...props}>Native version</Pressable>;
}
```

### 4. Export (`index.ts`)

```typescript
export { YourComponent } from './YourComponent';
export type { YourComponentProps } from './types';
```

### 5. Add to Main Export

```typescript
// packages/ui/src/index.ts
export * from './components/YourComponent';
```

## When to Create Platform-Specific Files

### Create `.native.tsx` when:

- Using platform-specific APIs (DOM vs React Native)
- Different component structures needed
- Performance optimizations required

### Share single `.tsx` when:

- Using shared primitives (`View`, `Text` from `@monorepo/ui`)
- Pure logic components
- Simple layout components

## API Routes

API routes for the Expo app should be created in:

```
apps/web/app/routes/api/
```

Example:

```typescript
// apps/web/app/routes/api/example.ts
import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request }: LoaderFunctionArgs) {
  const data = { message: 'Hello from API' };
  return Response.json(data);
}
```

## Styling with NativeWind

Use Tailwind classes that work on both platforms:

```tsx
<View className="flex-1 p-4 bg-blue-500">
  <Text className="text-white font-bold">Styled Text</Text>
</View>
```

### Platform Differences

Some Tailwind features work differently:

- **Hover states:** Limited support on native
- **Gradients:** Use different approaches per platform
- **Shadows:** Different implementations (shadow vs elevation)

## Testing Locally

### Web App

```bash
cd apps/web
pnpm dev
# Visit http://localhost:5173
```

### Expo App

```bash
cd apps/expo
pnpm dev
# Press 'i' for iOS, 'a' for Android
```

For physical devices, update the API URL:

```bash
# apps/expo/.env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5173
```

## Common Issues

### Metro can't find workspace packages

- Check `apps/expo/metro.config.js` watchFolders configuration
- Try clearing Metro cache: `pnpm dev:expo --clear`

### Type errors in NativeWind

- Ensure `nativewind-env.d.ts` exists
- Check `tsconfig.json` includes `"types": ["nativewind/types"]`

### Dependency conflicts

- Run `pnpm install` at root to sync all workspaces
- Check for version mismatches in package.json files

## Code Style

- Use TypeScript strict mode (already configured)
- Prefer functional components and hooks
- Use `const` over `let` when possible
- Export types and interfaces explicitly
- Write clear, descriptive variable names

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Run quality checks: `pnpm type-check && pnpm lint`
4. Format code: `pnpm format`
5. Commit with clear message: `git commit -m "feat: add new feature"`
6. Push and create PR: `git push origin feature/your-feature`

## Questions?

- Check the main README.md for architecture details
- Review existing components for examples
- Ask questions in issues or discussions
