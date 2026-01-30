import type { Database } from '@monorepo/database';

declare module 'react-router' {
  interface AppLoadContext {
    cloudflare: {
      env: {
        DB: D1Database;
        ENVIRONMENT: string;
        ASSETS: Fetcher;
        AUTH_SECRET: string;
        AUTH_URL: string;
      };
      ctx: ExecutionContext;
    };
    db: Database;
  }
}
