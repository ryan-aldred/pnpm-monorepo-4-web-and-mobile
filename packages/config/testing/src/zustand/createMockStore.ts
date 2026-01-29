import type { StoreApi, UseBoundStore } from 'zustand';
import type { MockStoreConfig } from './types';

/**
 * Creates a mock version of a Zustand store with overridden state and actions
 *
 * This utility works with both Jest and Vitest mock functions.
 *
 * @example
 * ```typescript
 * // Simple state override
 * const mockAuthStore = createMockStore(useAuth, {
 *   initialState: { isAuthenticated: true, user: mockUser }
 * });
 *
 * // With mocked actions
 * const mockAuthStore = createMockStore(useAuth, {
 *   initialState: { isAuthenticated: false },
 *   mockActions: {
 *     login: vi.fn().mockResolvedValue(undefined),
 *     logout: vi.fn()
 *   }
 * });
 * ```
 */
export function createMockStore<TState>(
  originalStore: UseBoundStore<StoreApi<TState>>,
  config: Omit<MockStoreConfig<TState>, 'store'> = {}
): UseBoundStore<StoreApi<TState>> {
  const { initialState = {}, mockActions = {} } = config;

  // Get the current state from the original store
  const originalState = originalStore.getState();

  // Merge original state with overrides
  const mergedState = {
    ...originalState,
    ...initialState,
    ...mockActions,
  } as TState;

  // Create a simple store-like object that mimics Zustand's API
  let currentState = mergedState;
  const initialStateSnapshot = mergedState;
  const listeners = new Set<(state: TState, prevState: TState) => void>();

  const mockStore = ((selector?: (state: TState) => any) => {
    if (selector) {
      return selector(currentState);
    }
    return currentState;
  }) as UseBoundStore<StoreApi<TState>>;

  // Add store API methods
  mockStore.getState = () => currentState;

  mockStore.setState = (
    partial:
      | TState
      | Partial<TState>
      | ((state: TState) => TState | Partial<TState>),
    replace?: boolean
  ) => {
    const prevState = currentState;
    const nextState =
      typeof partial === 'function'
        ? (partial as (state: TState) => TState | Partial<TState>)(currentState)
        : partial;

    currentState = replace
      ? (nextState as TState)
      : { ...currentState, ...nextState };

    listeners.forEach((listener) => listener(currentState, prevState));
  };

  mockStore.subscribe = (
    listener: (state: TState, prevState: TState) => void
  ) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  mockStore.getInitialState = () => initialStateSnapshot;

  // Add destroy method for cleanup
  (mockStore as any).destroy = () => {
    listeners.clear();
  };

  return mockStore;
}

/**
 * Resets a mock store to its initial state
 * Useful for cleaning up between tests
 */
export function resetMockStore<TState>(
  mockStore: UseBoundStore<StoreApi<TState>>
): void {
  const initialState = mockStore.getInitialState();
  mockStore.setState(initialState, true);
}
