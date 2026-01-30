import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { createAuth } from '~/lib/auth.server';
import { createDatabase } from '@monorepo/database';

function getAuthHandler(args: LoaderFunctionArgs | ActionFunctionArgs) {
  const { cloudflare } = args.context;
  const db = createDatabase(cloudflare.env.DB);
  const auth = createAuth(db, {
    AUTH_SECRET: cloudflare.env.AUTH_SECRET,
    AUTH_URL: cloudflare.env.AUTH_URL,
  });
  return auth;
}

export async function loader(args: LoaderFunctionArgs) {
  const auth = getAuthHandler(args);
  return auth.handler(args.request);
}

export async function action(args: ActionFunctionArgs) {
  const auth = getAuthHandler(args);
  return auth.handler(args.request);
}
