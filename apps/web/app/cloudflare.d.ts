import type { Database } from '@monorepo/database';

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: {
      env: {
        DB: D1Database;
        ENVIRONMENT: string;
        ASSETS: Fetcher;
      };
      ctx: ExecutionContext;
    };
    db: Database;
  }
}
