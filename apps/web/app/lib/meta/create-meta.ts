import type { MetaDescriptor } from 'react-router';
import type { MetaConfig, OgImage, RobotsConfig } from './types';
import { siteConfig, getAbsoluteUrl, getAbsoluteImageUrl } from './config';

/**
 * Create meta tags for a page
 * @param config - Meta configuration
 * @returns Array of MetaDescriptor objects for React Router
 */
export function createMeta(config: MetaConfig = {}): MetaDescriptor[] {
  const meta: MetaDescriptor[] = [];

  // Title
  const title = config.title
    ? config.noTitleTemplate
      ? config.title
      : (siteConfig.titleTemplate?.replace('%s', config.title) ?? config.title)
    : siteConfig.siteName;
  meta.push({ title });

  // Description
  const description = config.description ?? siteConfig.defaultDescription;
  if (description) {
    meta.push({ name: 'description', content: description });
  }

  // Robots
  if (config.robots) {
    const robotsContent =
      typeof config.robots === 'string'
        ? config.robots
        : formatRobotsConfig(config.robots);
    meta.push({ name: 'robots', content: robotsContent });
  }

  // OpenGraph tags
  const ogType = config.ogType ?? 'website';
  meta.push({ property: 'og:type', content: ogType });
  meta.push({
    property: 'og:title',
    content: config.title ?? siteConfig.siteName,
  });
  if (description) {
    meta.push({ property: 'og:description', content: description });
  }
  meta.push({ property: 'og:site_name', content: siteConfig.siteName });
  if (siteConfig.locale) {
    meta.push({ property: 'og:locale', content: siteConfig.locale });
  }

  // OpenGraph URL
  if (config.canonical) {
    meta.push({
      property: 'og:url',
      content: getAbsoluteUrl(config.canonical),
    });
  }

  // OpenGraph Image
  const ogImage = normalizeOgImage(config.ogImage) ?? siteConfig.defaultImage;
  if (ogImage) {
    meta.push({
      property: 'og:image',
      content: getAbsoluteImageUrl(ogImage.url),
    });
    if (ogImage.alt) {
      meta.push({ property: 'og:image:alt', content: ogImage.alt });
    }
    if (ogImage.width) {
      meta.push({ property: 'og:image:width', content: String(ogImage.width) });
    }
    if (ogImage.height) {
      meta.push({
        property: 'og:image:height',
        content: String(ogImage.height),
      });
    }
  }

  // Article-specific OpenGraph tags
  if (ogType === 'article' && config.article) {
    if (config.article.publishedTime) {
      meta.push({
        property: 'article:published_time',
        content: config.article.publishedTime,
      });
    }
    if (config.article.modifiedTime) {
      meta.push({
        property: 'article:modified_time',
        content: config.article.modifiedTime,
      });
    }
    if (config.article.author) {
      meta.push({ property: 'article:author', content: config.article.author });
    }
    if (config.article.section) {
      meta.push({
        property: 'article:section',
        content: config.article.section,
      });
    }
    if (config.article.tags) {
      for (const tag of config.article.tags) {
        meta.push({ property: 'article:tag', content: tag });
      }
    }
  }

  // Twitter Card tags
  const twitterCard = config.twitterCard ?? 'summary_large_image';
  meta.push({ name: 'twitter:card', content: twitterCard });
  meta.push({
    name: 'twitter:title',
    content: config.title ?? siteConfig.siteName,
  });
  if (description) {
    meta.push({ name: 'twitter:description', content: description });
  }
  if (siteConfig.twitterHandle) {
    meta.push({ name: 'twitter:site', content: siteConfig.twitterHandle });
  }
  if (ogImage) {
    meta.push({
      name: 'twitter:image',
      content: getAbsoluteImageUrl(ogImage.url),
    });
    if (ogImage.alt) {
      meta.push({ name: 'twitter:image:alt', content: ogImage.alt });
    }
  }

  // Custom meta tags
  if (config.custom) {
    meta.push(...config.custom);
  }

  return meta;
}

/**
 * Create canonical link for route's links export
 * @param path - Canonical URL path (relative)
 * @returns Link descriptor for canonical URL
 */
export function createCanonicalLink(path: string): {
  rel: string;
  href: string;
} {
  return {
    rel: 'canonical',
    href: getAbsoluteUrl(path),
  };
}

/**
 * Normalize OgImage input to OgImage object
 */
function normalizeOgImage(
  image: string | OgImage | undefined
): OgImage | undefined {
  if (!image) return undefined;
  if (typeof image === 'string') {
    return { url: image };
  }
  return image;
}

/**
 * Format RobotsConfig object to string
 */
function formatRobotsConfig(config: RobotsConfig): string {
  const directives: string[] = [];

  if (config.index === false) {
    directives.push('noindex');
  } else if (config.index === true) {
    directives.push('index');
  }

  if (config.follow === false) {
    directives.push('nofollow');
  } else if (config.follow === true) {
    directives.push('follow');
  }

  if (config.noarchive) directives.push('noarchive');
  if (config.nosnippet) directives.push('nosnippet');
  if (config.noimageindex) directives.push('noimageindex');
  if (config.notranslate) directives.push('notranslate');
  if (config.maxSnippet !== undefined) {
    directives.push(`max-snippet:${config.maxSnippet}`);
  }
  if (config.maxImagePreview) {
    directives.push(`max-image-preview:${config.maxImagePreview}`);
  }
  if (config.maxVideoPreview !== undefined) {
    directives.push(`max-video-preview:${config.maxVideoPreview}`);
  }

  return directives.join(', ') || 'index, follow';
}
