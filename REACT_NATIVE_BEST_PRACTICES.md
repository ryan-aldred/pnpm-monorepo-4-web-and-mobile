# React Native & Expo Best Practices for TypeScript Web Developers

A comprehensive guide for React web developers transitioning to React Native with Expo, using TypeScript.

## Table of Contents

1. [Mindset Shift: Web vs Native](#mindset-shift-web-vs-native)
2. [Project Setup & Configuration](#project-setup--configuration)
3. [Component Development](#component-development)
4. [Styling Best Practices](#styling-best-practices)
5. [Navigation](#navigation)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Performance Optimization](#performance-optimization)
9. [Platform-Specific Code](#platform-specific-code)
10. [Testing](#testing)
11. [Common Pitfalls](#common-pitfalls)
12. [TypeScript Patterns](#typescript-patterns)

---

## Mindset Shift: Web vs Native

### Key Differences from React Web

**Component Model**

- **Web**: DOM elements (`<div>`, `<span>`, `<button>`)
- **Native**: React Native components (`<View>`, `<Text>`, `<Pressable>`)
- **No HTML**: You cannot use any HTML elements in React Native

**Styling**

- **Web**: CSS files, CSS-in-JS, Tailwind via className
- **Native**: StyleSheet API, inline styles only (no external CSS files)
- **With NativeWind**: Tailwind-like classes work on both platforms
- **Flexbox only**: Default layout is flexbox (no CSS Grid)
- **Units**: No `px`, `rem`, `em` - use density-independent pixels (numbers)

**Event Handling**

- **Web**: `onClick`, `onChange`, `onSubmit`
- **Native**: `onPress`, `onChangeText`, no form submission

**Browser APIs Don't Exist**

- No `window`, `document`, `localStorage`, `sessionStorage`
- Use Expo/React Native equivalents: `AsyncStorage`, `SecureStore`, `Linking`

**Navigation**

- **Web**: React Router, URL-based routing
- **Native**: Stack-based navigation (Expo Router, React Navigation)

---

## Project Setup & Configuration

### TypeScript Configuration

**Strict Mode is Essential**

```json
// packages/config-typescript/base.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Expo-Specific TypeScript**

```json
// apps/expo/tsconfig.json
{
  "extends": "@monorepo/config-typescript/expo.json",
  "compilerOptions": {
    "jsx": "react-native",
    "lib": ["ES2020"],
    "types": ["expo/types", "expo-router/types"]
  }
}
```

### Environment Variables

**Web**: Use `import.meta.env.VITE_*`

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Expo**: Use `process.env.EXPO_PUBLIC_*`

```typescript
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

**Best Practice**: Create platform-specific config files

```typescript
// packages/core/src/config/config.native.ts
export const config = {
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5173',
};

// packages/core/src/config/config.ts (web)
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5173',
};
```

### Metro Bundler Configuration (Critical for Monorepos)

```javascript
// apps/expo/metro.config.js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all workspace packages
config.watchFolders = [monorepoRoot];

// Support .native.tsx resolution
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'mjs'];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Resolve workspace packages
  if (moduleName.startsWith('@monorepo/')) {
    const packageName = moduleName.split('/')[1];
    const packagePath = path.join(monorepoRoot, 'packages', packageName);

    return context.resolveRequest(context, packagePath, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
```

---

## Component Development

### Use Primitives, Not DOM Elements

**Bad (won't work)**

```tsx
// ❌ This will crash in React Native
function MyComponent() {
  return (
    <div className="container">
      <h1>Hello</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
```

**Good**

```tsx
// ✅ Use React Native primitives
import { View, Text, Pressable } from 'react-native';

function MyComponent() {
  return (
    <View className="container">
      <Text className="text-2xl font-bold">Hello</Text>
      <Pressable onPress={handleClick}>
        <Text>Click me</Text>
      </Pressable>
    </View>
  );
}
```

**Best Practice**: Create shared primitives

```typescript
// packages/ui/src/primitives/View.tsx
export { View } from 'react-native';

// packages/ui/src/primitives/Text.tsx
export { Text } from 'react-native';

// Import everywhere
import { View, Text } from '@monorepo/ui/primitives';
```

### Platform-Specific Components

Use the `.native.tsx` pattern for platform-specific implementations:

```typescript
// packages/ui/src/components/Button/Button.tsx (Web)
export interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({ onPress, children, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onPress}
      className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
    >
      {children}
    </button>
  );
}

// packages/ui/src/components/Button/Button.native.tsx (Native)
import { Pressable, Text } from 'react-native';
import type { ButtonProps } from './types';

export function Button({ onPress, children, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className={variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500'}
    >
      <Text className="text-white">{children}</Text>
    </Pressable>
  );
}

// packages/ui/src/components/Button/types.ts (Shared)
export interface ButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

// packages/ui/src/components/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './types';
```

**Import remains the same on both platforms**:

```typescript
import { Button } from '@monorepo/ui';
```

### Component Patterns

**Always use functional components with hooks**

```typescript
// ✅ Good
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return <View>{/* ... */}</View>;
}

// ❌ Avoid class components
class UserProfile extends React.Component {
  // Harder to type, less composable
}
```

**Props should always be strongly typed**

```typescript
interface UserCardProps {
  user: User;
  onPress?: () => void;
  showAvatar?: boolean;
}

function UserCard({ user, onPress, showAvatar = true }: UserCardProps) {
  // Implementation
}
```

---

## Styling Best Practices

### NativeWind (Tailwind for React Native)

NativeWind allows you to use Tailwind-style classes on both web and native.

**Setup**

```bash
pnpm --filter @monorepo/expo add nativewind tailwindcss
```

```typescript
// packages/ui/tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../apps/expo/app/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Usage**

```tsx
import { View, Text } from 'react-native';

function Card() {
  return (
    <View className="bg-white rounded-lg shadow-lg p-4 m-2">
      <Text className="text-xl font-bold text-gray-900">Title</Text>
      <Text className="text-sm text-gray-600 mt-2">Description</Text>
    </View>
  );
}
```

### Styling Rules

**1. Flexbox is Default**

```tsx
// Every View is display: flex by default
<View className="flex-row">
  {' '}
  {/* flex-direction: row */}
  <View className="flex-1">First</View>
  <View className="flex-1">Second</View>
</View>
```

**2. No CSS Grid**

```tsx
// ❌ CSS Grid doesn't exist in React Native
<View className="grid grid-cols-2">

// ✅ Use flexbox instead
<View className="flex-row flex-wrap">
  <View className="w-1/2">Item 1</View>
  <View className="w-1/2">Item 2</View>
</View>
```

**3. Avoid Complex Selectors**

```tsx
// ❌ No pseudo-selectors like :hover, :active
<View className="hover:bg-blue-500">

// ✅ Use state and conditional classes
function PressableCard() {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      <View className={pressed ? 'bg-blue-500' : 'bg-blue-400'}>
        {/* content */}
      </View>
    </Pressable>
  );
}
```

**4. Safe Area Handling**

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

// Always wrap top-level screens
function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Your content */}
    </SafeAreaView>
  );
}
```

**5. Platform-Specific Styles**

```typescript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

---

## Navigation

### Expo Router (File-based Routing)

Expo Router uses a file-based routing system similar to Next.js:

```
apps/expo/app/
├── _layout.tsx          # Root layout
├── index.tsx            # Home screen (/)
├── (tabs)/              # Tab navigator group
│   ├── _layout.tsx
│   ├── home.tsx         # /home
│   └── profile.tsx      # /profile
├── user/
│   └── [id].tsx         # Dynamic route: /user/:id
└── modal.tsx            # Can be presented as modal
```

**Root Layout**

```typescript
// apps/expo/app/_layout.tsx
import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="user/[id]" options={{ title: 'User Profile' }} />
    </Stack>
  );
}
```

**Navigation Between Screens**

```typescript
import { router } from 'expo-router';

function HomeScreen() {
  const navigateToProfile = () => {
    router.push('/profile');
  };

  const navigateToUser = (id: string) => {
    router.push(`/user/${id}`);
  };

  return (
    <View>
      <Pressable onPress={navigateToProfile}>
        <Text>Go to Profile</Text>
      </Pressable>
    </View>
  );
}
```

**Dynamic Route Params**

```typescript
// apps/expo/app/user/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function UserScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View>
      <Text>User ID: {id}</Text>
    </View>
  );
}
```

**Type-Safe Navigation**

```typescript
// packages/types/src/navigation.ts
export type RootStackParamList = {
  index: undefined;
  'user/[id]': { id: string };
  profile: undefined;
};

// Usage
import { router } from 'expo-router';
import type { RootStackParamList } from '@monorepo/types';

function navigate() {
  router.push<'/user/[id]'>({
    pathname: '/user/[id]',
    params: { id: '123' },
  });
}
```

---

## State Management

### Local State with useState/useReducer

```typescript
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = (text: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, completed: false }]);
  };

  return (
    <View>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </View>
  );
}
```

### Global State with Zustand

Zustand works identically on web and native:

```typescript
// packages/core/src/store/userStore.ts
import { create } from 'zustand';
import type { User } from '@monorepo/types';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Usage in components
import { useUserStore } from '@monorepo/core';

function ProfileScreen() {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  if (!user) return <Text>Not logged in</Text>;

  return (
    <View>
      <Text>{user.name}</Text>
      <Pressable onPress={logout}>
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
}
```

### Persistent State

**Web**: localStorage

```typescript
const saveToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};
```

**Native**: AsyncStorage

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveToken = async (token: string) => {
  await AsyncStorage.setItem('auth_token', token);
};

const getToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('auth_token');
};
```

**Shared Hook**

```typescript
// packages/core/src/hooks/useAsyncStorage.native.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAsyncStorage = () => ({
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key),
});

// packages/core/src/hooks/useAsyncStorage.ts (web)
export const useAsyncStorage = () => ({
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
});
```

---

## API Integration

### Fetch API Works on Both Platforms

The Fetch API works identically on web and native:

```typescript
// packages/core/src/api/users.ts
import type { User } from '@monorepo/types';
import { config } from '../config';

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${config.apiUrl}/api/users`);

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function createUser(userData: Omit<User, 'id'>): Promise<User> {
  const response = await fetch(`${config.apiUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return response.json();
}
```

### Custom Hook Pattern

```typescript
// packages/core/src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { fetchUsers } from '../api/users';
import type { User } from '@monorepo/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const refetch = () => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return { users, loading, error, refetch };
}

// Usage in component
import { useUsers } from '@monorepo/core';

function UsersScreen() {
  const { users, loading, error, refetch } = useUsers();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserCard user={item} />}
      onRefresh={refetch}
      refreshing={loading}
    />
  );
}
```

### React Query (Recommended)

```typescript
// packages/core/src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser } from '../api/users';
import type { User } from '@monorepo/types';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

// Usage
function UsersScreen() {
  const { data: users, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <FlatList
        data={users}
        renderItem={({ item }) => <UserCard user={item} />}
      />
    </View>
  );
}
```

---

## Performance Optimization

### Lists: Use FlatList, Not .map()

**Bad**

```tsx
// ❌ Don't use .map() for large lists - will render everything at once
function UsersList({ users }: { users: User[] }) {
  return (
    <ScrollView>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ScrollView>
  );
}
```

**Good**

```tsx
// ✅ FlatList only renders visible items (virtualized)
import { FlatList } from 'react-native';

function UsersList({ users }: { users: User[] }) {
  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <UserCard user={item} />}
      keyExtractor={(item) => item.id}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
}
```

### Memoization

**React.memo for Components**

```typescript
import { memo } from 'react';

interface UserCardProps {
  user: User;
  onPress: (id: string) => void;
}

export const UserCard = memo(function UserCard({ user, onPress }: UserCardProps) {
  return (
    <Pressable onPress={() => onPress(user.id)}>
      <View>
        <Text>{user.name}</Text>
      </View>
    </Pressable>
  );
});
```

**useMemo and useCallback**

```typescript
function UsersList({ users }: { users: User[] }) {
  // Memoize expensive computations
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  // Memoize callbacks to prevent re-renders
  const handlePress = useCallback((id: string) => {
    router.push(`/user/${id}`);
  }, []);

  return (
    <FlatList
      data={sortedUsers}
      renderItem={({ item }) => (
        <UserCard user={item} onPress={handlePress} />
      )}
    />
  );
}
```

### Image Optimization

```tsx
import { Image } from 'expo-image';

function Avatar({ uri }: { uri: string }) {
  return (
    <Image
      source={{ uri }}
      style={{ width: 50, height: 50, borderRadius: 25 }}
      // Caching and optimization
      cachePolicy="memory-disk"
      contentFit="cover"
      placeholder={require('./placeholder.png')}
      transition={200}
    />
  );
}
```

### Avoid Anonymous Functions in Renders

**Bad**

```tsx
// ❌ Creates new function on every render
<FlatList
  data={users}
  renderItem={(item) => (
    <UserCard user={item} onPress={(id) => router.push(`/user/${id}`)} />
  )}
/>
```

**Good**

```tsx
// ✅ Stable function references
function UsersList({ users }: { users: User[] }) {
  const handlePress = useCallback((id: string) => {
    router.push(`/user/${id}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <UserCard user={item} onPress={handlePress} />
    ),
    [handlePress]
  );

  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}

const keyExtractor = (item: User) => item.id;
```

---

## Platform-Specific Code

### Platform Module

```typescript
import { Platform } from 'react-native';

// Check platform
if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
} else if (Platform.OS === 'web') {
  // Web-specific code
}

// Platform.select
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
});
```

### File Extensions

Metro automatically resolves platform-specific files:

```
packages/ui/src/components/Button/
├── Button.tsx           # Web version (default)
├── Button.native.tsx    # All native platforms
├── Button.ios.tsx       # iOS-specific (highest priority)
├── Button.android.tsx   # Android-specific
└── types.ts             # Shared types
```

**Resolution Order**:

1. `.ios.tsx` or `.android.tsx` (platform-specific)
2. `.native.tsx` (all native platforms)
3. `.tsx` (default/web)

### Feature Detection

```typescript
// packages/core/src/utils/platform.ts
import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';
export const isMobile = isIOS || isAndroid;

// Feature-based checks
export const supportsHaptics = isMobile;
export const supportsPushNotifications = isMobile;
export const supportsBackgroundTasks = isMobile;

// Usage
import { supportsHaptics } from '@monorepo/core/utils/platform';
import * as Haptics from 'expo-haptics';

function handlePress() {
  if (supportsHaptics) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  // Continue with action
}
```

---

## Testing

### Unit Testing with Jest

```typescript
// packages/core/src/utils/validation.test.ts
import { describe, it, expect } from '@jest/globals';
import { validateEmail, validatePhone } from './validation';

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### Component Testing with React Native Testing Library

```typescript
// packages/ui/src/components/Button/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('should render children', () => {
    const { getByText } = render(<Button onPress={() => {}}>Click me</Button>);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click me</Button>);

    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Testing with Detox (Optional)

```typescript
// apps/expo/e2e/home.e2e.ts
describe('Home Screen', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should show welcome message', async () => {
    await expect(element(by.text('Welcome'))).toBeVisible();
  });

  it('should navigate to profile', async () => {
    await element(by.id('profile-button')).tap();
    await expect(element(by.text('Profile'))).toBeVisible();
  });
});
```

---

## Common Pitfalls

### 1. Using DOM Elements

```tsx
// ❌ Will crash
<div>
  <span>Text</span>
  <button onClick={handleClick}>Click</button>
</div>

// ✅ Use React Native components
<View>
  <Text>Text</Text>
  <Pressable onPress={handleClick}>
    <Text>Click</Text>
  </Pressable>
</View>
```

### 2. Missing Text Wrapper

```tsx
// ❌ Text must be in <Text> component
<View>
  Hello World
</View>

// ✅ Wrap all text
<View>
  <Text>Hello World</Text>
</View>
```

### 3. Forgetting SafeArea

```tsx
// ❌ Content hidden by notch/status bar
function Screen() {
  return (
    <View>
      <Text>Title</Text>
    </View>
  );
}

// ✅ Use SafeAreaView
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen() {
  return (
    <SafeAreaView>
      <Text>Title</Text>
    </SafeAreaView>
  );
}
```

### 4. ScrollView with Flex: 1

```tsx
// ❌ ScrollView doesn't scroll with flex: 1
<ScrollView style={{ flex: 1 }}>
  {/* Content */}
</ScrollView>

// ✅ Use contentContainerStyle
<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
  {/* Content */}
</ScrollView>
```

### 5. Large Lists with .map()

```tsx
// ❌ Poor performance with large lists
<ScrollView>
  {items.map(item => <Item key={item.id} item={item} />)}
</ScrollView>

// ✅ Use FlatList
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={item => item.id}
/>
```

### 6. Mutating State Directly

```tsx
// ❌ Don't mutate state
const [user, setUser] = useState(initialUser);
user.name = 'New Name'; // Wrong!
setUser(user);

// ✅ Create new object
setUser({ ...user, name: 'New Name' });
```

### 7. useEffect Missing Dependencies

```tsx
// ❌ Missing dependency
useEffect(() => {
  fetchUser(userId);
}, []); // userId not in deps

// ✅ Include all dependencies
useEffect(() => {
  fetchUser(userId);
}, [userId]);
```

---

## TypeScript Patterns

### Prop Types

```typescript
// Define props interface
interface UserCardProps {
  user: User;
  onPress?: (id: string) => void;
  variant?: 'compact' | 'full';
}

// Use in component
function UserCard({ user, onPress, variant = 'compact' }: UserCardProps) {
  // Implementation
}

// For components with children
interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
```

### Event Handlers

```typescript
import type { GestureResponderEvent } from 'react-native';

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
}

function Button({ onPress, onLongPress }: ButtonProps) {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      {/* content */}
    </Pressable>
  );
}
```

### Style Types

```typescript
import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface CardProps {
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

function Card({ style, titleStyle }: CardProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, titleStyle]}>Title</Text>
    </View>
  );
}
```

### Generic Components

```typescript
interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactElement;
  keyExtractor: (item: T) => string;
}

function List<T>({ data, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => renderItem(item)}
      keyExtractor={keyExtractor}
    />
  );
}

// Usage
<List<User>
  data={users}
  renderItem={(user) => <UserCard user={user} />}
  keyExtractor={(user) => user.id}
/>
```

### Hooks with Types

```typescript
function useLocalState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    AsyncStorage.getItem(key).then((value) => {
      if (value) setState(JSON.parse(value) as T);
    });
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      setState(value);
      AsyncStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  return [state, setValue] as const;
}

// Usage
const [user, setUser] = useLocalState<User | null>('user', null);
```

---

## Quick Reference

### Web → Native Equivalents

| Web                     | React Native                          |
| ----------------------- | ------------------------------------- |
| `<div>`                 | `<View>`                              |
| `<span>`, `<p>`, `<h1>` | `<Text>`                              |
| `<button>`              | `<Pressable>` or `<TouchableOpacity>` |
| `<input>`               | `<TextInput>`                         |
| `<img>`                 | `<Image>` from `expo-image`           |
| `<ul>`, `<ol>`          | `<FlatList>` or `<SectionList>`       |
| `<a>`                   | `<Link>` from `expo-router`           |
| `onClick`               | `onPress`                             |
| `onChange`              | `onChangeText`                        |
| `localStorage`          | `AsyncStorage`                        |
| `window.location`       | `router` from `expo-router`           |
| CSS files               | `StyleSheet.create()` or NativeWind   |
| `fetch()`               | `fetch()` (works the same)            |

### Key Packages

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "react-native": "0.76.0",
    "nativewind": "^4.0.0",
    "@react-native-async-storage/async-storage": "^1.23.0",
    "react-native-safe-area-context": "^4.10.0",
    "expo-image": "~2.0.0",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.0.0"
  }
}
```

---

## Summary

Key takeaways for React web developers transitioning to React Native:

1. **No HTML elements** - Use `<View>`, `<Text>`, `<Pressable>` instead
2. **StyleSheet or NativeWind** - No external CSS files
3. **Flexbox-only layout** - No CSS Grid
4. **FlatList for lists** - Don't use `.map()` for large lists
5. **Platform-specific files** - Use `.native.tsx` pattern
6. **AsyncStorage not localStorage** - Different persistence API
7. **Expo Router** - File-based navigation like Next.js
8. **TypeScript strict mode** - Catch errors early
9. **Performance matters** - Mobile devices are resource-constrained
10. **Test on real devices** - Simulators don't catch everything

By following these best practices, you'll write maintainable, performant React Native applications that share 60-80% of code with your web apps.
