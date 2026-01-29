import { http, HttpResponse } from 'msw';
import type { User } from '@monorepo/types';
import { mockUsers } from '../data/users';

let users = [...mockUsers];

export const usersHandlers = [
  // GET /api/users
  http.get('*/api/users', () => {
    return HttpResponse.json(users);
  }),

  // GET /api/users/:id
  http.get('*/api/users/:id', ({ params }) => {
    const id = Number(params.id);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return HttpResponse.json(user);
  }),

  // POST /api/users
  http.post('*/api/users', async ({ request }) => {
    const body = (await request.json()) as Omit<User, 'id'>;
    const newUser: User = {
      id: Date.now(),
      ...body,
    };
    users.push(newUser);
    return HttpResponse.json(newUser, { status: 201 });
  }),

  // DELETE /api/users/:id
  http.delete('*/api/users/:id', ({ params }) => {
    const id = Number(params.id);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return HttpResponse.json({ error: 'User not found' }, { status: 404 });
    }

    users.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
];

// Reset function for testing
export const resetUsers = () => {
  users = [...mockUsers];
};
