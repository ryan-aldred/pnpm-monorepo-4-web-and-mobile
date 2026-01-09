import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render, type RenderAPI } from '@testing-library/react-native';
import { MockStoreProvider } from '@monorepo/config-testing';
import type { MobileContextConfig } from './types';

/**
 * Mount a component with Expo Router context for testing
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { getByText } = mountWithMobileContext(<MyScreen />);
 *
 * // With navigation params
 * const { getByText } = mountWithMobileContext(<ProfileScreen />, {
 *   navigation: {
 *     initialRoute: 'Profile',
 *     params: { userId: '123' }
 *   }
 * });
 *
 * // With Zustand store mocking
 * const { getByText } = mountWithMobileContext(<HomeScreen />, {
 *   zustandStores: {
 *     auth: {
 *       store: useAuth,
 *       initialState: { isAuthenticated: true, user: mockUser }
 *     }
 *   }
 * });
 * ```
 */
export function mountWithMobileContext(
  component: React.ReactElement,
  config: MobileContextConfig = {}
): RenderAPI {
  const { navigation = {}, zustandStores, mockProviders = [], expoModules = {} } = config;

  // Note: Expo modules should generally be mocked via jest.mock() in setup.ts
  // This warning is kept for cases where runtime mocking is attempted
  if (Object.keys(expoModules).length > 0) {
    console.warn(
      'Expo module mocking via config is limited. For best results, use jest.mock() in test setup.'
    );
  }

  // Build the wrapper component
  let Wrapper: React.ComponentType<{ children: React.ReactNode }> = ({ children }) => (
    <NavigationContainer>{children}</NavigationContainer>
  );

  // Apply Zustand store mocking if configured
  if (zustandStores && Object.keys(zustandStores).length > 0) {
    const OriginalWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <MockStoreProvider stores={zustandStores}>
        <OriginalWrapper>{children}</OriginalWrapper>
      </MockStoreProvider>
    );
  }

  // Apply custom providers (from last to first for proper nesting)
  mockProviders.forEach(({ Provider, props = {} }) => {
    const OriginalWrapper = Wrapper;
    Wrapper = ({ children }) => (
      <Provider {...props}>
        <OriginalWrapper>{children}</OriginalWrapper>
      </Provider>
    );
  });

  return render(component, { wrapper: Wrapper });
}

/**
 * Create a custom render function with default config
 *
 * @example
 * ```tsx
 * // Create a renderer with app-wide defaults
 * const renderScreen = createMobileRenderer({
 *   zustandStores: {
 *     auth: { store: useAuth, initialState: { isAuthenticated: true } }
 *   }
 * });
 *
 * // Use in tests
 * renderScreen(<HomeScreen />);
 * ```
 */
export function createMobileRenderer(defaultConfig: MobileContextConfig = {}) {
  return (component: React.ReactElement, config: MobileContextConfig = {}) => {
    // Deep merge for zustandStores
    const mergedConfig: MobileContextConfig = {
      ...defaultConfig,
      ...config,
      zustandStores: {
        ...defaultConfig.zustandStores,
        ...config.zustandStores,
      },
      mockProviders: [...(defaultConfig.mockProviders || []), ...(config.mockProviders || [])],
    };
    return mountWithMobileContext(component, mergedConfig);
  };
}

// Legacy alias for backward compatibility
/** @deprecated Use mountWithMobileContext instead */
export const mountWithAppContext = mountWithMobileContext;

/** @deprecated Use createMobileRenderer instead */
export const createAppRenderer = createMobileRenderer;
