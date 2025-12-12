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
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
} as const;
