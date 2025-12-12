# Quick Setup Guide

## 1. Prerequisites

Ensure you have the following installed:

```bash
# Check Node.js version (need >= 20.0.0)
node --version

# Check pnpm version (need >= 9.0.0)
pnpm --version

# If pnpm is not installed:
npm install -g pnpm
```

## 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for:
- Root workspace
- Web app (React Router 7)
- Expo app (React Native)
- All shared packages (ui, core, types, config)

## 3. Configure Expo API URL

For development with simulators/emulators (default):
```bash
cp apps/expo/.env.example apps/expo/.env
# File will have: EXPO_PUBLIC_API_URL=http://localhost:5173
```

For development with physical devices:
```bash
# Find your local IP address
# macOS/Linux: ifconfig | grep "inet "
# Windows: ipconfig

# Create .env file
echo "EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5173" > apps/expo/.env
```

## 4. Start Development

Open two terminal windows:

**Terminal 1 - Web App:**
```bash
pnpm dev:web
```
- Opens at http://localhost:5173
- Serves both the web UI and API for Expo

**Terminal 2 - Expo App:**
```bash
pnpm dev:expo
```
- Opens Expo DevTools
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code for physical device

Or start both at once:
```bash
pnpm dev
```

## 5. Verify Setup

### Web App
1. Visit http://localhost:5173
2. You should see the welcome screen
3. API endpoint available at http://localhost:5173/api/users

### Expo App
1. Open in simulator/device
2. You should see the Expo welcome screen
3. App connects to web API automatically

### Type Checking
```bash
pnpm type-check
```
Should complete with no errors.

## 6. Next Steps

- Read [README.md](./README.md) for architecture details
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow
- Start building shared components in `packages/ui/`
- Add business logic in `packages/core/`
- Create API routes in `apps/web/app/routes/api/`

## Troubleshooting

### Port Already in Use
If port 5173 is in use, the web app will try the next available port. Update `EXPO_PUBLIC_API_URL` accordingly.

### Expo Can't Connect to API
- Ensure web app is running (Terminal 1)
- For physical devices, use local IP instead of localhost
- Check firewall settings

### Metro Bundler Issues
```bash
cd apps/expo
pnpm dev --clear
```

### Dependency Issues
```bash
rm -rf node_modules
pnpm install
```

### TypeScript Errors
```bash
pnpm type-check
```

## What Was Created?

### Apps
- ✅ React Router 7 web app with Vite
- ✅ Expo mobile app with Expo Router
- ✅ Example API endpoint (`/api/users`)
- ✅ Example pages for both platforms

### Shared Packages
- ✅ `@monorepo/ui` - Component library (Button, Card, primitives)
- ✅ `@monorepo/core` - API client, hooks (useData, useAuth), utilities
- ✅ `@monorepo/types` - Shared TypeScript types
- ✅ `@monorepo/config-*` - ESLint, TypeScript, Prettier configs

### Configuration
- ✅ pnpm workspace setup
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ NativeWind (Tailwind for React Native)
- ✅ Turborepo for build caching
- ✅ Metro config for monorepo support

## Development Commands

```bash
# Start both apps
pnpm dev

# Start individually
pnpm dev:web
pnpm dev:expo

# Build
pnpm build          # Build all
pnpm build:web      # Build web only
pnpm build:expo     # Build Expo only

# Code quality
pnpm type-check     # Check TypeScript
pnpm lint           # Lint code
pnpm format         # Format with Prettier

# Clean
pnpm clean          # Remove all node_modules and build artifacts
```

## Project Structure Summary

```
expo-rr7-prototype/
├── apps/
│   ├── expo/           # Mobile app (port 8081)
│   └── web/            # Web app + API (port 5173)
├── packages/
│   ├── ui/             # Shared components
│   ├── core/           # Business logic
│   ├── types/          # TypeScript types
│   └── config/         # Shared configs
└── [config files]      # Root configuration
```

You're all set! Start building your cross-platform app. 🚀
