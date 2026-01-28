import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker: ReturnType<typeof setupWorker> = setupWorker(...handlers);

export async function startMockServer() {
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  });
}

export { handlers };
