import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * Extracts the state type from a Zustand store
 */
export type ExtractState<S> =
  S extends UseBoundStore<StoreApi<infer T>> ? T : never;

/**
 * Configuration for mocking a single Zustand store
 */
export interface MockStoreConfig<TState> {
  /** The Zustand store to mock */
  store: UseBoundStore<StoreApi<TState>>;
  /** Initial state override - merged with existing state */
  initialState?: Partial<TState>;
  /** Mock implementations for actions/functions in the store */
  mockActions?: {
    [K in keyof TState]?: TState[K] extends (...args: any[]) => any
      ? (...args: any[]) => any
      : never;
  };
}

/**
 * Configuration for multiple Zustand stores
 * Key is a unique identifier, value is the mock configuration
 */
export type ZustandStoresConfig = Record<string, MockStoreConfig<any>>;

/**
 * Simplified Zustand stores config for convenience
 * Just pass store -> partial state for simple overrides
 */
export type SimpleZustandStoresConfig = Record<
  string,
  {
    store: UseBoundStore<StoreApi<any>>;
    state?: Record<string, any>;
  }
>;
