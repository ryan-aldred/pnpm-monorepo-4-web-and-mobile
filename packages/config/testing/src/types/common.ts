import type { ComponentType } from 'react';
import type { ZustandStoresConfig, SimpleZustandStoresConfig } from '../zustand/types';

/**
 * Common mock provider configuration
 * Used by both web and mobile test utilities
 */
export interface MockProviderConfig {
  Provider: ComponentType<any>;
  props?: Record<string, any>;
}

/**
 * Base context configuration shared between platforms
 */
export interface BaseContextConfig {
  /**
   * Zustand stores to mock during the test
   *
   * @example
   * ```typescript
   * zustandStores: {
   *   auth: {
   *     store: useAuth,
   *     initialState: { isAuthenticated: true, user: mockUser }
   *   },
   *   cart: {
   *     store: useCart,
   *     initialState: { items: [] },
   *     mockActions: { addItem: vi.fn() }
   *   }
   * }
   * ```
   */
  zustandStores?: ZustandStoresConfig | SimpleZustandStoresConfig;

  /**
   * Additional React providers to wrap the component
   * Applied from last to first (outermost to innermost)
   *
   * @example
   * ```typescript
   * mockProviders: [
   *   { Provider: ThemeProvider, props: { theme: 'dark' } },
   *   { Provider: I18nProvider, props: { locale: 'en' } }
   * ]
   * ```
   */
  mockProviders?: MockProviderConfig[];
}
