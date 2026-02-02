import type { SiteMetaConfig } from './types';

/**
 * Site-wide metadata configuration
 */
export const siteConfig: SiteMetaConfig = {
  siteName: 'Expo RR7 Monorepo',
  siteUrl: getBaseUrl(),
  defaultDescription: 'A modern monorepo with Expo and React Router 7',
  locale: 'en_US',
  twitterHandle: undefined, // Set your Twitter handle here, e.g., '@yourhandle'
  titleTemplate: '%s | Expo RR7 Monorepo',
  defaultImage: {
    url: '/og-image.png',
    alt: 'Expo RR7 Monorepo',
    width: 1200,
    height: 630,
  },
};

/**
 * Get the base URL for the site
 * Uses SITE_URL environment variable or falls back to localhost for development
 */
function getBaseUrl(): string {
  // Server-side: check environment variables
  if (typeof process !== 'undefined' && process.env?.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, '');
  }

  // Cloudflare Workers environment
  if (typeof globalThis !== 'undefined') {
    const env = (globalThis as Record<string, unknown>).env as
      | { SITE_URL?: string }
      | undefined;
    if (env?.SITE_URL) {
      return env.SITE_URL.replace(/\/$/, '');
    }
  }

  // Default fallback for development
  return 'http://localhost:5173';
}

/**
 * Convert a relative path to an absolute URL
 * @param path - Relative path (e.g., '/about' or 'about')
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.siteUrl}${normalizedPath}`;
}

/**
 * Get absolute URL for an image
 * @param imagePath - Image path (relative or absolute)
 * @returns Absolute image URL
 */
export function getAbsoluteImageUrl(imagePath: string): string {
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  return getAbsoluteUrl(imagePath);
}
