import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import type { User } from '@monorepo/types';
import { getUsers, createUser } from '@monorepo/core/data';

// Example API route that will be called by the Expo app
export async function loader({ request: _request }: LoaderFunctionArgs) {
  const users = await getUsers();
  return Response.json(users);
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const body = (await request.json()) as Omit<User, 'id'>;
    const user = await createUser(body);
    return Response.json(user);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
