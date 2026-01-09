// Primary exports
export {
  mountWithMobileContext,
  createMobileRenderer,
  // Legacy aliases (deprecated)
  mountWithAppContext,
  createAppRenderer,
} from './mountWithMobileContext';
export type { MobileContextConfig, AppContextConfig } from './types';

// Re-export testing library utilities for convenience
export { screen, waitFor, within, fireEvent, act, cleanup } from '@testing-library/react-native';

// Re-export Zustand utilities for direct use in tests
export { createMockStore, resetMockStore, useMockedStore } from '@monorepo/config-testing';
