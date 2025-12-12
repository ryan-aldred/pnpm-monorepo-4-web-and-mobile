import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { getUsers, createUser } from '@monorepo/core';

// Example API route that will be called by the Expo app
export async function loader({ request }: LoaderFunctionArgs) {
  const users = await getUsers(); // Shared function
  return Response.json(users);
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const body = await request.json();
    const user = await createUser(body); // Shared function
    return Response.json(user);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
