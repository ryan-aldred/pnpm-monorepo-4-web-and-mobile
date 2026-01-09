# Testing Framework Setup

This monorepo has a comprehensive testing framework set up for both web and mobile applications.

## Overview

- **Web app (`apps/web`)**: Uses **Vitest** with React Router 7 testing utilities
- **Expo app (`apps/expo`)**: Uses **Jest** with basic mocking setup
- **Shared packages**: Can use Vitest for unit testing

## Running Tests

```bash
# Run all tests across the monorepo
pnpm test

# Run tests for specific apps
pnpm test:web      # Web app tests with Vitest
pnpm test:expo     # Expo app tests with Jest
pnpm test:packages # Package tests

# Watch mode for development
cd apps/web && pnpm test      # Vitest watch mode
cd apps/expo && pnpm test:watch  # Jest watch mode

# Run individual test files
cd apps/web && pnpm test tests/example.test.tsx run      # Single web test file
cd apps/expo && pnpm test tests/example.test.tsx         # Single expo test file

# Run tests matching a pattern
cd apps/web && pnpm test "**/*Button*" run    # Web: all tests with "Button" in path
cd apps/expo && pnpm test Button              # Expo: all tests with "Button" in path

# Run a specific test by name
cd apps/web && pnpm test -t "renders component"   # Vitest: run test with matching name
cd apps/expo && pnpm test -t "renders component"  # Jest: run test with matching name
```

## Quick Reference

### Common Commands

| Action | Web (Vitest) | Expo (Jest) |
|--------|-------------|-------------|
| Run all tests | `cd apps/web && pnpm test run` | `cd apps/expo && pnpm test` |
| Watch mode | `cd apps/web && pnpm test` | `cd apps/expo && pnpm test:watch` |
| Single file | `pnpm test path/to/file.test.tsx run` | `pnpm test path/to/file.test.tsx` |
| Pattern match | `pnpm test "**/*Button*" run` | `pnpm test Button` |
| By test name | `pnpm test -t "test name"` | `pnpm test -t "test name"` |
| With coverage | `pnpm test:coverage` | `pnpm test:coverage` |
| With UI | `pnpm test:ui` | N/A |

**Note**: All commands assume you're in the app directory (`apps/web` or `apps/expo`)

## Web App Testing (`apps/web`)

### Using `mountWithWebContext`

The `mountWithWebContext` utility provides an easy way to test React Router 7 components with mocked loaders and actions.

#### Basic Usage

```typescript
import { mountWithWebContext, screen } from '../test-utils';

function MyComponent() {
  return <div>Hello World</div>;
}

it('renders component', () => {
  mountWithWebContext(<MyComponent />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
```

#### Mocking Loader Data

```typescript
import { useLoaderData } from 'react-router';

function UserProfile() {
  const { user } = useLoaderData<typeof loader>();
  return <div>{user.name}</div>;
}

export async function loader() {
  // This would normally fetch from an API
  return { user: { id: 1, name: 'John' } };
}

it('displays user data from loader', () => {
  mountWithWebContext(<UserProfile />, {
    loader: {
      data: { user: { id: 1, name: 'John Doe' } }
    }
  });

  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

#### Mocking Loader Errors

```typescript
it('handles loader errors', () => {
  mountWithWebContext(<UserProfile />, {
    loader: {
      error: new Error('Failed to load user')
    }
  });

  // Your error boundary should catch this
  expect(screen.getByText(/Failed to load user/i)).toBeInTheDocument();
});
```

#### Mocking Action Data

```typescript
import { useActionData } from 'react-router';

function LoginForm() {
  const actionData = useActionData<typeof action>();

  return (
    <form>
      {actionData?.errors && <div>{actionData.errors.username}</div>}
      <button type="submit">Submit</button>
    </form>
  );
}

it('displays action validation errors', () => {
  mountWithWebContext(<LoginForm />, {
    action: {
      data: { errors: { username: 'Required field' } }
    }
  });

  expect(screen.getByText('Required field')).toBeInTheDocument();
});
```

#### Extensibility with Custom Providers

```typescript
// Future: Add custom providers
mountWithWebContext(<MyComponent />, {
  mockProviders: [
    {
      Provider: ThemeProvider,
      props: { theme: 'dark' }
    }
  ]
});
```

### Configuration

Web tests are configured in `/Users/ryanaldred/dev/expo-rr7-prototype/apps/web/vitest.config.ts` and use the shared base config from `@monorepo/config-vitest`.

## Expo App Testing (`apps/expo`)

### Current Setup

The Expo app uses Jest for testing. Due to React Native 0.76 compatibility issues with jest-expo, the current setup:

- ✅ Supports TypeScript testing
- ✅ Has expo-router mocks configured
- ✅ Can test utility functions and business logic
- ⚠️ React Native component testing requires additional setup

### Basic Testing

```typescript
import { describe, it, expect } from '@jest/globals';

describe('My Feature', () => {
  it('performs calculation correctly', () => {
    const result = myFunction(2, 3);
    expect(result).toBe(5);
  });

  it('uses Jest mocking', () => {
    const mockFn = jest.fn(() => 'result');
    expect(mockFn()).toBe('result');
    expect(mockFn).toHaveBeenCalled();
  });
});
```

### Using `mountWithAppContext` (Future Enhancement)

The `mountWithAppContext` utility is defined in `apps/expo/test-utils/mountWithAppContext.tsx` for future use when full React Native testing is set up.

**Intended Usage (once configured)**:

```typescript
import { mountWithAppContext, screen } from '../test-utils';

it('renders mobile screen', () => {
  mountWithAppContext(<MyScreen />, {
    navigation: {
      initialRoute: 'Home'
    }
  });

  expect(screen.getByText('Welcome')).toBeOnTheScreen();
});
```

### Known Limitations

1. **React Native Components**: Full component testing with `@testing-library/react-native` requires additional React Native 0.76 compatibility work
2. **Navigation Testing**: `@react-navigation/native` testing needs proper transformer configuration
3. **Native Modules**: Some Expo modules may need additional mocking

### Configuration

Expo tests are configured in `apps/expo/jest.config.js` with a custom setup that avoids jest-expo preset issues.

## Test File Structure

```
apps/web/
├── tests/               # Test files
│   └── example.test.tsx
├── test-utils/          # Testing utilities
│   ├── index.ts        # Re-exports
│   ├── types.ts        # TypeScript types
│   └── mountWithWebContext.tsx
└── vitest.config.ts

apps/expo/
├── tests/               # Test files
│   └── example.test.tsx
├── mocks/               # Mock files
│   └── fileMock.js
├── test-utils/          # Testing utilities
│   ├── index.ts
│   ├── types.ts
│   ├── setup.ts        # Jest setup
│   └── mountWithAppContext.tsx
└── jest.config.js

packages/config/vitest/
├── base.ts             # Shared Vitest config
├── setup.ts            # Shared test setup
└── package.json
```

## Extending the Test Utilities

Both `mountWithWebContext` and `mountWithAppContext` are designed to be extensible:

### Adding New Config Options

Simply extend the config interfaces:

```typescript
// apps/web/test-utils/types.ts
export interface WebContextConfig {
  loader?: { data?: any; error?: Error };
  action?: { data?: any; error?: Error };
  initialRoute?: string;
  routes?: RouteObject[];
  mockProviders?: Array<{ Provider: React.ComponentType<any>; props?: any }>;

  // Add your custom options here
  myCustomOption?: string;
}
```

### Creating Custom Renderers

```typescript
import { createWebRenderer } from '../test-utils';

// Create a renderer with default config
const render = createWebRenderer({
  loader: {
    data: { defaultUser: mockUser }
  }
});

// Use in tests
render(<MyComponent />); // Includes default config
render(<MyComponent />, {
  loader: { data: { customData } }
}); // Override defaults
```

## Writing Tests

### File Naming

- Use `.test.ts` or `.test.tsx` for test files
- Place tests in `tests/` directories or colocate with source files

### Test Structure

```typescript
import { describe, it, expect } from 'vitest'; // or '@jest/globals'

describe('Feature Name', () => {
  it('does something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Best Practices

1. **Test behavior, not implementation** - Focus on what the user sees and interacts with
2. **Use descriptive test names** - Test names should explain what is being tested
3. **Keep tests isolated** - Each test should be independent and not rely on others
4. **Mock external dependencies** - API calls, timers, etc. should be mocked
5. **Test error cases** - Don't just test the happy path

## Coverage

Generate coverage reports:

```bash
pnpm test:coverage  # All packages
pnpm --filter @monorepo/web test:coverage
pnpm --filter @monorepo/expo test:coverage
```

## Troubleshooting

### Web Tests

**Issue**: Tests failing with module resolution errors
**Solution**: Check `vitest.config.ts` path aliases match your tsconfig

**Issue**: "Cannot find module" errors
**Solution**: Run `pnpm install` to ensure all dependencies are installed

### Expo Tests

**Issue**: React Native component rendering fails
**Solution**: Currently, use unit tests for logic. Full component testing setup is a work in progress.

**Issue**: Module transform errors
**Solution**: Check `jest.config.js` `transformIgnorePatterns` includes necessary packages

## Next Steps

1. **For Web**: Write tests for your routes using `mountWithWebContext`
2. **For Expo**: Write unit tests for business logic, hooks, and utilities
3. **Full RN Testing**: Consider contributing to set up full React Native Testing Library integration

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Router Testing Guide](https://reactrouter.com/start/framework/testing)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
