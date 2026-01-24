import type {
  BaseContextConfig,
  MockProviderConfig,
  ZustandStoresConfig,
} from '@monorepo/config-testing';

/**
 * Configuration for mounting components in mobile (Expo) tests
 *
 * @example
 * ```typescript
 * const config: MobileContextConfig = {
 *   navigation: {
 *     initialRoute: 'Home',
 *     params: { userId: '123' }
 *   },
 *   zustandStores: {
 *     auth: { store: useAuth, initialState: { isAuthenticated: true } }
 *   }
 * };
 * ```
 */
export interface MobileContextConfig extends BaseContextConfig {
  /**
   * Navigation configuration for Expo Router
   */
  navigation?: {
    /** Initial route name */
    initialRoute?: string;
    /** Route parameters */
    params?: Record<string, any>;
  };

  /**
   * Expo-specific module mocks
   * Note: Most Expo modules should be mocked via jest.mock() in setup
   * This is for runtime overrides
   */
  expoModules?: {
    StatusBar?: any;
    [key: string]: any;
  };
}

// Re-export for convenience
export type { MockProviderConfig, ZustandStoresConfig };

// Legacy alias for backward compatibility (deprecated)
/** @deprecated Use MobileContextConfig instead */
export type AppContextConfig = MobileContextConfig;
