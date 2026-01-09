import type { RouteObject } from 'react-router';
import type {
  BaseContextConfig,
  MockProviderConfig,
  ZustandStoresConfig,
} from '@monorepo/config-testing';

/**
 * Configuration for mounting components in web tests with React Router 7
 *
 * @example
 * ```typescript
 * const config: WebContextConfig = {
 *   loader: { data: { user: mockUser } },
 *   action: { data: { success: true } },
 *   zustandStores: {
 *     cart: { store: useCart, initialState: { items: [] } }
 *   }
 * };
 * ```
 */
export interface WebContextConfig extends BaseContextConfig {
  /**
   * Mock configuration for route loaders
   *
   * @example
   * ```typescript
   * // Return data
   * loader: { data: { users: [mockUser1, mockUser2] } }
   *
   * // Throw error
   * loader: { error: new Error('Not found') }
   * ```
   */
  loader?: {
    data?: any;
    error?: Error;
  };

  /**
   * Mock configuration for route actions
   *
   * @example
   * ```typescript
   * // Return success
   * action: { data: { success: true } }
   *
   * // Return validation errors
   * action: { data: { errors: { email: 'Invalid email' } } }
   * ```
   */
  action?: {
    data?: any;
    error?: Error;
  };

  /**
   * Initial route path for the test
   * @default '/'
   */
  initialRoute?: string;

  /**
   * Additional routes to register in the test router
   */
  routes?: RouteObject[];
}

// Re-export for convenience
export type { MockProviderConfig, ZustandStoresConfig };

export interface RenderOptions {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}
