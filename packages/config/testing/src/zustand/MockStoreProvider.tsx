import React, { createContext, useContext, useMemo } from 'react';
import type { StoreApi, UseBoundStore } from 'zustand';
import { createMockStore } from './createMockStore';
import type { ZustandStoresConfig, SimpleZustandStoresConfig } from './types';

interface MockStoreContextValue {
  stores: Map<UseBoundStore<StoreApi<any>>, UseBoundStore<StoreApi<any>>>;
}

const MockStoreContext = createContext<MockStoreContextValue | null>(null);

/**
 * Hook to get the mocked version of a store within MockStoreProvider
 * Falls back to the original store if no mock is configured
 */
export function useMockedStore<TState>(
  originalStore: UseBoundStore<StoreApi<TState>>
): UseBoundStore<StoreApi<TState>> {
  const context = useContext(MockStoreContext);

  if (!context) {
    // Not within MockStoreProvider, return original
    return originalStore;
  }

  return context.stores.get(originalStore) ?? originalStore;
}

interface MockStoreProviderProps {
  children: React.ReactNode;
  stores: ZustandStoresConfig | SimpleZustandStoresConfig;
}

/**
 * Provider component that enables Zustand store mocking in tests
 *
 * @example
 * ```tsx
 * <MockStoreProvider
 *   stores={{
 *     auth: {
 *       store: useAuth,
 *       initialState: { isAuthenticated: true }
 *     }
 *   }}
 * >
 *   <ComponentUnderTest />
 * </MockStoreProvider>
 * ```
 */
export function MockStoreProvider({
  children,
  stores,
}: MockStoreProviderProps) {
  // Create mock stores once during initial render
  const storeMap = useMemo(() => {
    const map = new Map<
      UseBoundStore<StoreApi<any>>,
      UseBoundStore<StoreApi<any>>
    >();

    Object.values(stores).forEach((config) => {
      const { store, ...restConfig } = config;

      // Handle SimpleZustandStoresConfig format
      const mockConfig =
        'state' in config ? { initialState: config.state } : restConfig;

      if (!map.has(store)) {
        const mockStore = createMockStore(store, mockConfig);
        map.set(store, mockStore);
      }
    });

    return map;
  }, [stores]);

  const contextValue: MockStoreContextValue = useMemo(
    () => ({
      stores: storeMap,
    }),
    [storeMap]
  );

  return (
    <MockStoreContext.Provider value={contextValue}>
      {children}
    </MockStoreContext.Provider>
  );
}
