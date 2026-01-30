// Configure based on environment
// For Expo: uses EXPO_PUBLIC_API_URL from .env
// For web: not needed (uses loaders directly)
export const API_BASE_URL =
  typeof process !== 'undefined' && process.env.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL
    : 'http://localhost:5173';

export const ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
  AUTH: {
    BASE: '/api/auth',
    SIGN_IN: '/api/auth/sign-in/email',
    SIGN_UP: '/api/auth/sign-up/email',
    SIGN_OUT: '/api/auth/sign-out',
    SESSION: '/api/auth/get-session',
  },
} as const;
