import { describe, it, expect } from 'vitest';
import {
  createMeta,
  createCanonicalLink,
  createWebSiteSchema,
  createWebPageSchema,
  createArticleSchema,
  createBreadcrumbSchema,
  getAbsoluteUrl,
  siteConfig,
} from '../app/lib/meta';

describe('createMeta', () => {
  it('creates basic meta tags with title template', () => {
    const meta = createMeta({ title: 'About' });

    expect(meta).toContainEqual({ title: 'About | Expo RR7 Monorepo' });
  });

  it('creates meta tags without title template when noTitleTemplate is true', () => {
    const meta = createMeta({ title: 'Custom Title', noTitleTemplate: true });

    expect(meta).toContainEqual({ title: 'Custom Title' });
  });

  it('uses site name as title when no title provided', () => {
    const meta = createMeta({});

    expect(meta).toContainEqual({ title: siteConfig.siteName });
  });

  it('includes description meta tag', () => {
    const meta = createMeta({ description: 'Test description' });

    expect(meta).toContainEqual({
      name: 'description',
      content: 'Test description',
    });
  });

  it('includes OpenGraph tags', () => {
    const meta = createMeta({
      title: 'Test Page',
      description: 'Test description',
    });

    expect(meta).toContainEqual({ property: 'og:type', content: 'website' });
    expect(meta).toContainEqual({ property: 'og:title', content: 'Test Page' });
    expect(meta).toContainEqual({
      property: 'og:description',
      content: 'Test description',
    });
    expect(meta).toContainEqual({
      property: 'og:site_name',
      content: siteConfig.siteName,
    });
  });

  it('includes og:url when canonical is provided', () => {
    const meta = createMeta({ canonical: '/about' });

    expect(meta).toContainEqual({
      property: 'og:url',
      content: `${siteConfig.siteUrl}/about`,
    });
  });

  it('includes Twitter Card tags', () => {
    const meta = createMeta({
      title: 'Test Page',
      description: 'Test description',
    });

    expect(meta).toContainEqual({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    expect(meta).toContainEqual({
      name: 'twitter:title',
      content: 'Test Page',
    });
    expect(meta).toContainEqual({
      name: 'twitter:description',
      content: 'Test description',
    });
  });

  it('handles robots config object', () => {
    const meta = createMeta({
      robots: { index: false, follow: true },
    });

    expect(meta).toContainEqual({
      name: 'robots',
      content: 'noindex, follow',
    });
  });

  it('handles robots config string', () => {
    const meta = createMeta({
      robots: 'noindex, nofollow',
    });

    expect(meta).toContainEqual({
      name: 'robots',
      content: 'noindex, nofollow',
    });
  });

  it('includes article-specific tags when ogType is article', () => {
    const meta = createMeta({
      ogType: 'article',
      article: {
        publishedTime: '2024-01-15T10:00:00Z',
        author: 'John Doe',
        tags: ['tech', 'react'],
      },
    });

    expect(meta).toContainEqual({ property: 'og:type', content: 'article' });
    expect(meta).toContainEqual({
      property: 'article:published_time',
      content: '2024-01-15T10:00:00Z',
    });
    expect(meta).toContainEqual({
      property: 'article:author',
      content: 'John Doe',
    });
    expect(meta).toContainEqual({ property: 'article:tag', content: 'tech' });
    expect(meta).toContainEqual({ property: 'article:tag', content: 'react' });
  });

  it('includes custom meta tags', () => {
    const customMeta = { name: 'custom', content: 'value' };
    const meta = createMeta({ custom: [customMeta] });

    expect(meta).toContainEqual(customMeta);
  });

  it('handles OgImage as string', () => {
    const meta = createMeta({ ogImage: '/custom-image.png' });

    expect(meta).toContainEqual({
      property: 'og:image',
      content: `${siteConfig.siteUrl}/custom-image.png`,
    });
  });

  it('handles OgImage as object with dimensions', () => {
    const meta = createMeta({
      ogImage: {
        url: '/custom-image.png',
        alt: 'Custom image',
        width: 800,
        height: 600,
      },
    });

    expect(meta).toContainEqual({
      property: 'og:image',
      content: `${siteConfig.siteUrl}/custom-image.png`,
    });
    expect(meta).toContainEqual({
      property: 'og:image:alt',
      content: 'Custom image',
    });
    expect(meta).toContainEqual({ property: 'og:image:width', content: '800' });
    expect(meta).toContainEqual({
      property: 'og:image:height',
      content: '600',
    });
  });
});

describe('createCanonicalLink', () => {
  it('creates canonical link with absolute URL', () => {
    const link = createCanonicalLink('/about');

    expect(link).toEqual({
      rel: 'canonical',
      href: `${siteConfig.siteUrl}/about`,
    });
  });

  it('handles paths without leading slash', () => {
    const link = createCanonicalLink('about');

    expect(link).toEqual({
      rel: 'canonical',
      href: `${siteConfig.siteUrl}/about`,
    });
  });
});

describe('getAbsoluteUrl', () => {
  it('converts relative path to absolute URL', () => {
    expect(getAbsoluteUrl('/about')).toBe(`${siteConfig.siteUrl}/about`);
  });

  it('adds leading slash if missing', () => {
    expect(getAbsoluteUrl('about')).toBe(`${siteConfig.siteUrl}/about`);
  });
});

describe('createWebSiteSchema', () => {
  it('creates basic WebSite schema', () => {
    const schema = createWebSiteSchema();

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebSite');
    expect(schema.name).toBe(siteConfig.siteName);
    expect(schema.url).toBe(siteConfig.siteUrl);
  });

  it('includes search action when provided', () => {
    const schema = createWebSiteSchema({
      searchAction: {
        urlTemplate: `${siteConfig.siteUrl}/search?q={search_term_string}`,
      },
    });

    expect(schema.potentialAction).toBeDefined();
    expect(schema.potentialAction?.['@type']).toBe('SearchAction');
  });
});

describe('createWebPageSchema', () => {
  it('creates WebPage schema', () => {
    const schema = createWebPageSchema({
      name: 'About Us',
      path: '/about',
      description: 'Learn about us',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('WebPage');
    expect(schema.name).toBe('About Us');
    expect(schema.url).toBe(`${siteConfig.siteUrl}/about`);
    expect(schema.description).toBe('Learn about us');
    expect(schema.isPartOf?.name).toBe(siteConfig.siteName);
  });
});

describe('createArticleSchema', () => {
  it('creates Article schema', () => {
    const schema = createArticleSchema({
      headline: 'Test Article',
      path: '/blog/test',
      description: 'Article description',
      author: 'John Doe',
      datePublished: '2024-01-15T10:00:00Z',
    });

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toBe('Test Article');
    expect(schema.url).toBe(`${siteConfig.siteUrl}/blog/test`);
    expect(schema.author?.name).toBe('John Doe');
    expect(schema.datePublished).toBe('2024-01-15T10:00:00Z');
    expect(schema.publisher?.name).toBe(siteConfig.siteName);
  });
});

describe('createBreadcrumbSchema', () => {
  it('creates BreadcrumbList schema', () => {
    const schema = createBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: 'Current Post' },
    ]);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].position).toBe(1);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[0].item).toBe(`${siteConfig.siteUrl}/`);
    expect(schema.itemListElement[2].item).toBeUndefined(); // Current page has no link
  });
});
