import type { LoaderFunctionArgs, ActionFunctionArgs } from 'react-router';
import { getUsers, createUser } from '@monorepo/core/data';
import { CreateUserSchema, validateRequest } from '@monorepo/core/validation';

// Example API route that will be called by the Expo app
export async function loader({ request: _request }: LoaderFunctionArgs) {
  const users = await getUsers();
  return Response.json(users);
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method === 'POST') {
    const validation = await validateRequest(CreateUserSchema, request);
    if (!validation.success) {
      return validation.response;
    }

    const user = await createUser(validation.data!);
    return Response.json(user);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
