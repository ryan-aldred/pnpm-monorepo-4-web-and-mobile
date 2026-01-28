import { http, HttpResponse } from 'msw';
import type { Post } from '@monorepo/types';
import { mockPosts } from '../data/posts';

let posts = [...mockPosts];

export const postsHandlers = [
  // GET /api/posts
  http.get('*/api/posts', () => {
    return HttpResponse.json(posts);
  }),

  // GET /api/posts/:id
  http.get('*/api/posts/:id', ({ params }) => {
    const id = Number(params.id);
    const post = posts.find((p) => p.id === id);

    if (!post) {
      return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  // POST /api/posts
  http.post('*/api/posts', async ({ request }) => {
    const body = (await request.json()) as Omit<Post, 'id'>;
    const newPost: Post = {
      id: Date.now(),
      ...body,
    };
    posts.push(newPost);
    return HttpResponse.json(newPost, { status: 201 });
  }),

  // DELETE /api/posts/:id
  http.delete('*/api/posts/:id', ({ params }) => {
    const id = Number(params.id);
    const index = posts.findIndex((p) => p.id === id);

    if (index === -1) {
      return HttpResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts.splice(index, 1);
    return HttpResponse.json({ success: true });
  }),
];

// Reset function for testing
export const resetPosts = () => {
  posts = [...mockPosts];
};
