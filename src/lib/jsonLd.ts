/**
 * JSON-LD (JSON for Linking Data) helper functions
 * Generates structured data for search engines following Schema.org vocabulary
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

import { siteConfig } from './site'

/**
 * Schema.org type definitions
 */
interface Person {
  '@type': 'Person'
  name: string
  url?: string
  image?: string
  sameAs?: string[]
}

interface BlogPosting {
  '@context': 'https://schema.org'
  '@type': 'BlogPosting'
  headline: string
  description?: string
  author: Person
  datePublished: string
  dateModified?: string
  image?: string
  url: string
  publisher?: {
    '@type': 'Organization'
    name: string
    logo?: {
      '@type': 'ImageObject'
      url: string
    }
  }
  inLanguage?: string
  keywords?: string[]
}

interface WebSite {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  inLanguage?: string[]
  author?: Person
  potentialAction?: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

interface BreadcrumbListItem {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}

interface BreadcrumbList {
  '@context': 'https://schema.org'
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbListItem[]
}

interface CreativeWork {
  '@context': 'https://schema.org'
  '@type': 'CreativeWork'
  name: string
  headline: string
  description?: string
  author: Person
  datePublished: string
  url: string
  inLanguage?: string
  publisher?: {
    '@type': 'Organization'
    name: string
    url?: string
  }
  keywords?: string[]
}

/**
 * Create a Person structured data
 */
export function createPersonJsonLd(): Person {
  return {
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    sameAs: [siteConfig.author.github]
  }
}

/**
 * Create a BlogPosting structured data for blog posts
 */
export function createBlogPostingJsonLd({
  title,
  description,
  publishedAt,
  slug,
  locale,
  tags
}: {
  title: string
  description?: string
  publishedAt: string
  slug: string
  locale: string
  tags?: string[]
}): BlogPosting {
  const url = `${siteConfig.url}/${locale}/blog/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    author: createPersonJsonLd(),
    datePublished: publishedAt,
    url,
    inLanguage: locale === 'ja' ? 'ja-JP' : 'en-US',
    keywords: tags,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name
    }
  }
}

/**
 * Create a WebSite structured data
 */
export function createWebSiteJsonLd(locale: string): WebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: `${siteConfig.url}/${locale}`,
    description: locale === 'ja' ? 'Dev Roar Labのポートフォリオサイト' : 'Dev Roar Lab Portfolio Site',
    inLanguage: [locale === 'ja' ? 'ja-JP' : 'en-US'],
    author: createPersonJsonLd(),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/${locale}/blog?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

/**
 * Create a BreadcrumbList structured data
 */
export function createBreadcrumbListJsonLd(
  items: Array<{ name: string; url?: string }>,
  locale: string
): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${siteConfig.url}/${locale}${item.url}` : undefined
    }))
  }
}

/**
 * Create a CreativeWork structured data for projects
 */
export function createCreativeWorkJsonLd({
  title,
  description,
  publishedAt,
  slug,
  locale,
  tags
}: {
  title: string
  description?: string
  publishedAt: string
  slug: string
  locale: string
  tags?: string[]
}): CreativeWork {
  const url = `${siteConfig.url}/${locale}/projects/${slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: title,
    headline: title,
    description,
    author: createPersonJsonLd(),
    datePublished: publishedAt,
    url,
    inLanguage: locale === 'ja' ? 'ja-JP' : 'en-US',
    keywords: tags,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url
    }
  }
}

/**
 * Helper function to render JSON-LD script tag
 * Use with dangerouslySetInnerHTML in your component
 */
export function renderJsonLd(data: object): string {
  return JSON.stringify(data)
}
