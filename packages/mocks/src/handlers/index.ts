import { usersHandlers, resetUsers } from './users';
import { postsHandlers, resetPosts } from './posts';
import { authHandlers, resetAuth } from './auth';

export const handlers = [...usersHandlers, ...postsHandlers, ...authHandlers];

// Reset all mock data - useful for tests
export const resetAllMocks = () => {
  resetUsers();
  resetPosts();
  resetAuth();
};

export { usersHandlers, postsHandlers, authHandlers };
export { resetUsers, resetPosts, resetAuth };
