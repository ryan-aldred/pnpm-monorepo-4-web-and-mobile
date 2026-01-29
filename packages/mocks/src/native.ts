import { setupServer } from 'msw/native';
import { handlers } from './handlers';

export const server: ReturnType<typeof setupServer> = setupServer(...handlers);

export async function startMockServer() {
  server.listen({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
  console.log('[MSW] Mock server started for React Native');
  return server;
}

export function stopMockServer() {
  server.close();
  console.log('[MSW] Mock server stopped');
}

export { handlers };
