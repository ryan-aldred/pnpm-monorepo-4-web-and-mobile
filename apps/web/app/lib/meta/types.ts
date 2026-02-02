import type { MetaDescriptor } from 'react-router';

/**
 * OpenGraph image configuration
 */
export interface OgImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Robots meta tag configuration
 */
export interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  notranslate?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
}

/**
 * Article-specific metadata for og:type="article"
 */
export interface ArticleMeta {
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

/**
 * Main configuration object for createMeta()
 */
export interface MetaConfig {
  /** Page title (will be templated with site name) */
  title?: string;
  /** Page description for SEO */
  description?: string;
  /** OpenGraph type (default: 'website') */
  ogType?: 'website' | 'article' | 'profile';
  /** OpenGraph image */
  ogImage?: string | OgImage;
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image' | 'player' | 'app';
  /** Robots configuration or string directive */
  robots?: RobotsConfig | string;
  /** Canonical URL path (relative to site URL) */
  canonical?: string;
  /** Article-specific metadata */
  article?: ArticleMeta;
  /** Additional custom meta tags to include */
  custom?: MetaDescriptor[];
  /** Disable title template (show raw title) */
  noTitleTemplate?: boolean;
}

/**
 * Site-wide metadata defaults
 */
export interface SiteMetaConfig {
  siteName: string;
  siteUrl: string;
  defaultImage?: OgImage;
  defaultDescription?: string;
  locale?: string;
  twitterHandle?: string;
  titleTemplate?: string;
}

/**
 * Base JSON-LD schema interface
 */
export interface JsonLdBase {
  '@context': 'https://schema.org';
  '@type': string;
}

/**
 * WebSite schema for home page
 */
export interface WebSiteSchema extends JsonLdBase {
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

/**
 * WebPage schema for generic pages
 */
export interface WebPageSchema extends JsonLdBase {
  '@type': 'WebPage';
  name: string;
  url: string;
  description?: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
}

/**
 * Article schema for blog posts
 */
export interface ArticleSchema extends JsonLdBase {
  '@type': 'Article';
  headline: string;
  url: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: {
    '@type': 'Person';
    name: string;
  };
  publisher?: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

/**
 * BreadcrumbList schema for navigation
 */
export interface BreadcrumbSchema extends JsonLdBase {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Union type for all JSON-LD schemas
 */
export type JsonLdSchema =
  | WebSiteSchema
  | WebPageSchema
  | ArticleSchema
  | BreadcrumbSchema;
