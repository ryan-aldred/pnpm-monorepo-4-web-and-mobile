import { http, HttpResponse } from 'msw';

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthUser {
  id: number;
  email: string;
  name: string;
}

// Simple mock auth state
let currentUser: AuthUser | null = null;

export const authHandlers = [
  // POST /api/auth/login
  http.post('*/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest;

    // Mock validation - accept any email with password "password"
    if (body.password !== 'password') {
      return HttpResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    currentUser = {
      id: 1,
      email: body.email,
      name: body.email.split('@')[0] ?? 'User',
    };

    return HttpResponse.json({
      user: currentUser,
      token: 'mock-jwt-token-' + Date.now(),
    });
  }),

  // POST /api/auth/logout
  http.post('*/api/auth/logout', () => {
    currentUser = null;
    return HttpResponse.json({ success: true });
  }),

  // POST /api/auth/refresh
  http.post('*/api/auth/refresh', () => {
    if (!currentUser) {
      return HttpResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return HttpResponse.json({
      user: currentUser,
      token: 'mock-jwt-token-refreshed-' + Date.now(),
    });
  }),

  // GET /api/auth/me (bonus - useful for checking auth state)
  http.get('*/api/auth/me', () => {
    if (!currentUser) {
      return HttpResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return HttpResponse.json({ user: currentUser });
  }),
];

// Reset function for testing
export const resetAuth = () => {
  currentUser = null;
};
