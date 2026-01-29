export { mountWithWebContext, createWebRenderer } from './mountWithWebContext';
export type {
  WebContextConfig,
  RenderOptions,
  MockProviderConfig,
} from './types';

// Re-export testing library utilities for convenience
export {
  screen,
  waitFor,
  within,
  fireEvent,
  act,
  cleanup,
} from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Re-export Zustand utilities for direct use in tests
export {
  createMockStore,
  resetMockStore,
  useMockedStore,
} from '@monorepo/config-testing';
