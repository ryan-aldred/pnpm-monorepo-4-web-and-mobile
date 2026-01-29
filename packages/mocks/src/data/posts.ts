import type { Post } from '@monorepo/types';

export const mockPosts: Post[] = [
  { id: 1, title: 'First Post', content: 'Hello world!', authorId: 1 },
  { id: 2, title: 'Second Post', content: 'Another post here.', authorId: 2 },
  {
    id: 3,
    title: 'React Native Tips',
    content: 'Building mobile apps is fun!',
    authorId: 1,
  },
];
