import React from 'react';
import { createRoutesStub } from 'react-router';
import { render, type RenderResult } from '@testing-library/react';
import { MockStoreProvider } from '@monorepo/config-testing';
import type { WebContextConfig } from './types';

/**
 * Mount a component with React Router 7 context for testing
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { getByText } = mountWithWebContext(<MyComponent />);
 *
 * // With loader data
 * const { getByText } = mountWithWebContext(<UserProfile />, {
 *   loader: { data: { user: { id: 1, name: 'John' } } }
 * });
 *
 * // With Zustand store mocking
 * const { getByText } = mountWithWebContext(<CartPage />, {
 *   zustandStores: {
 *     cart: {
 *       store: useCart,
 *       initialState: { items: [mockItem], total: 99.99 }
 *     }
 *   }
 * });
 *
 * // With action data (e.g., form validation errors)
 * const { getByText } = mountWithWebContext(<LoginForm />, {
 *   action: { data: { errors: { email: 'Invalid email' } } }
 * });
 * ```
 */
export function mountWithWebContext(
  component: React.ReactElement,
  config: WebContextConfig = {}
): RenderResult {
  const {
    loader,
    action,
    initialRoute = '/',
    routes = [],
    zustandStores,
    mockProviders = [],
  } = config;

  // Create the loader function
  const loaderFn = loader
    ? () => {
        if (loader.error) throw loader.error;
        return loader.data ?? null;
      }
    : undefined;

  // Create the action function
  const actionFn = action
    ? () => {
        if (action.error) throw action.error;
        return action.data ?? null;
      }
    : undefined;

  // Build the route configuration
  const stubRoutes = [
    {
      path: '/',
      Component: () => component,
      loader: loaderFn,
      action: actionFn,
    },
    ...routes,
  ];

  // Create the routes stub
  const Stub = createRoutesStub(stubRoutes);

  // Build wrapper with all providers
  let WrappedContent = () => <Stub initialEntries={[initialRoute]} />;

  // Apply Zustand store mocking if configured
  if (zustandStores && Object.keys(zustandStores).length > 0) {
    const OriginalContent = WrappedContent;
    WrappedContent = () => (
      <MockStoreProvider stores={zustandStores}>
        <OriginalContent />
      </MockStoreProvider>
    );
  }

  // Apply custom providers (from last to first for proper nesting)
  mockProviders.forEach(({ Provider, props = {} }) => {
    const OriginalContent = WrappedContent;
    WrappedContent = () => (
      <Provider {...props}>
        <OriginalContent />
      </Provider>
    );
  });

  return render(<WrappedContent />);
}

/**
 * Create a custom render function with default config
 *
 * @example
 * ```tsx
 * // Create a renderer with app-wide defaults
 * const renderPage = createWebRenderer({
 *   zustandStores: {
 *     auth: { store: useAuth, initialState: { isAuthenticated: true } }
 *   }
 * });
 *
 * // Use in tests - defaults are merged
 * renderPage(<DashboardPage />);
 * renderPage(<SettingsPage />, {
 *   loader: { data: { settings: userSettings } }
 * });
 * ```
 */
export function createWebRenderer(defaultConfig: WebContextConfig = {}) {
  return (component: React.ReactElement, config: WebContextConfig = {}) => {
    // Deep merge for zustandStores
    const mergedConfig: WebContextConfig = {
      ...defaultConfig,
      ...config,
      zustandStores: {
        ...defaultConfig.zustandStores,
        ...config.zustandStores,
      },
      mockProviders: [...(defaultConfig.mockProviders || []), ...(config.mockProviders || [])],
    };
    return mountWithWebContext(component, mergedConfig);
  };
}
