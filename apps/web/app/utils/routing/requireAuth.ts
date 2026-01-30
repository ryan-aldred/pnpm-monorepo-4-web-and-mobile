import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from 'react-router';
import { createAuth } from '~/lib/auth.server';
import { createDatabase } from '@monorepo/database';

export async function requireAuth(args: LoaderFunctionArgs | ActionFunctionArgs) {
  const { cloudflare } = args.context;
  const db = createDatabase(cloudflare.env.DB);
  const auth = createAuth(db, {
    AUTH_SECRET: cloudflare.env.AUTH_SECRET,
    AUTH_URL: cloudflare.env.AUTH_URL,
  });

  const session = await auth.api.getSession({
    headers: args.request.headers,
  });

  if (!session) {
    throw redirect('/login');
  }

  return session;
}
