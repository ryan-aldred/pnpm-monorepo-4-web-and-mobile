// Main helper
export { createMeta, createCanonicalLink } from './create-meta';

// Structured data helpers
export {
  createWebSiteSchema,
  createWebPageSchema,
  createArticleSchema,
  createBreadcrumbSchema,
} from './structured-data';

// Configuration
export { siteConfig, getAbsoluteUrl, getAbsoluteImageUrl } from './config';

// Types
export type {
  MetaConfig,
  SiteMetaConfig,
  RobotsConfig,
  OgImage,
  ArticleMeta,
  JsonLdSchema,
  WebSiteSchema,
  WebPageSchema,
  ArticleSchema,
  BreadcrumbSchema,
} from './types';
