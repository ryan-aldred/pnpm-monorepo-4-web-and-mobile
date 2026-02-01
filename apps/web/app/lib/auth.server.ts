import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { expo } from '@better-auth/expo';
import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { schema } from '@monorepo/database';

export interface AuthEnv {
  AUTH_SECRET: string;
  AUTH_URL: string;
}

export function createAuth(db: DrizzleD1Database<typeof schema>, env: AuthEnv) {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    secret: env.AUTH_SECRET,
    baseURL: env.AUTH_URL,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // 24 hours
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5, // 5 minutes
      },
    },
    plugins: [expo()],
    trustedOrigins: ['monorepo://', 'exp://'],
  });
}

export type Auth = ReturnType<typeof createAuth>;
