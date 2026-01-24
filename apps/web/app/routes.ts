import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  // USERS
  route('api/users', 'routes/api/users.ts'),
  route('users', 'routes/users/index.tsx'),
  route('users/:userId', 'routes/users/id.tsx'),
] satisfies RouteConfig;
