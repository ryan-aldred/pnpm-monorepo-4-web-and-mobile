import type {
  WebSiteSchema,
  WebPageSchema,
  ArticleSchema,
  BreadcrumbSchema,
} from './types';
import { siteConfig, getAbsoluteUrl } from './config';

interface WebSiteSchemaOptions {
  /** Enable site search action */
  searchAction?: {
    /** URL template with {search_term_string} placeholder */
    urlTemplate: string;
  };
}

/**
 * Create WebSite schema for home page
 * @param options - Optional configuration
 * @returns WebSite JSON-LD schema
 */
export function createWebSiteSchema(
  options?: WebSiteSchemaOptions
): WebSiteSchema {
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.siteName,
    url: siteConfig.siteUrl,
  };

  if (siteConfig.defaultDescription) {
    schema.description = siteConfig.defaultDescription;
  }

  if (options?.searchAction) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: options.searchAction.urlTemplate,
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

interface WebPageSchemaOptions {
  /** Page title */
  name: string;
  /** Page URL path (relative) */
  path: string;
  /** Page description */
  description?: string;
}

/**
 * Create WebPage schema for generic pages
 * @param options - Page configuration
 * @returns WebPage JSON-LD schema
 */
export function createWebPageSchema(
  options: WebPageSchemaOptions
): WebPageSchema {
  const schema: WebPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.name,
    url: getAbsoluteUrl(options.path),
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
    },
  };

  if (options.description) {
    schema.description = options.description;
  }

  return schema;
}

interface ArticleSchemaOptions {
  /** Article headline/title */
  headline: string;
  /** Article URL path (relative) */
  path: string;
  /** Article description */
  description?: string;
  /** Featured image URL */
  image?: string;
  /** Publication date (ISO 8601) */
  datePublished?: string;
  /** Last modified date (ISO 8601) */
  dateModified?: string;
  /** Author name */
  author?: string;
}

/**
 * Create Article schema for blog posts
 * @param options - Article configuration
 * @returns Article JSON-LD schema
 */
export function createArticleSchema(
  options: ArticleSchemaOptions
): ArticleSchema {
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    url: getAbsoluteUrl(options.path),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName,
      url: siteConfig.siteUrl,
    },
  };

  if (options.description) {
    schema.description = options.description;
  }
  if (options.image) {
    schema.image = getAbsoluteUrl(options.image);
  }
  if (options.datePublished) {
    schema.datePublished = options.datePublished;
  }
  if (options.dateModified) {
    schema.dateModified = options.dateModified;
  }
  if (options.author) {
    schema.author = {
      '@type': 'Person',
      name: options.author,
    };
  }

  return schema;
}

interface BreadcrumbItem {
  /** Display name for the breadcrumb */
  name: string;
  /** URL path (relative) - omit for current page */
  path?: string;
}

/**
 * Create BreadcrumbList schema for navigation
 * @param items - Array of breadcrumb items
 * @returns BreadcrumbList JSON-LD schema
 */
export function createBreadcrumbSchema(
  items: BreadcrumbItem[]
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: getAbsoluteUrl(item.path) } : {}),
    })),
  };
}
