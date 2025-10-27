/**
 * Site-wide configuration object
 *
 * Contains essential information about the website including site name, URL,
 * author information, and internationalization settings.
 *
 * @property {string} name - The name of the website
 * @property {string} url - The base URL of the website (defaults to production URL)
 * @property {object} author - Author information
 * @property {string} author.name - Author's name
 * @property {string} author.github - Author's GitHub profile URL
 * @property {string} author.githubRepo - Repository URL for the website
 * @property {string} defaultLocale - Default locale for the website
 * @property {string[]} locales - Supported locales
 *
 * @example
 * ```typescript
 * import { siteConfig } from '@/lib/site'
 *
 * console.log(siteConfig.name) // 'Dev Roar Lab'
 * console.log(siteConfig.author.github) // 'https://github.com/dev-roar-researcher'
 * ```
 */
export const siteConfig = {
  name: 'Dev Roar Lab',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dev-roar-lab.com',
  author: {
    name: 'dev-roar-researcher',
    github: 'https://github.com/dev-roar-researcher',
    githubRepo: 'https://github.com/dev-roar-lab/dev-roar-lab-hp'
  },
  defaultLocale: 'ja' as const,
  locales: ['ja', 'en'] as const
}

/**
 * Locale-specific metadata for SEO and social sharing
 *
 * Contains localized title, description, and keywords for each supported locale.
 * Used for generating meta tags, OpenGraph data, and other SEO-related content.
 *
 * @property {object} ja - Japanese locale metadata
 * @property {string} ja.title - Site title in Japanese
 * @property {string} ja.description - Site description in Japanese
 * @property {string[]} ja.keywords - SEO keywords in Japanese
 * @property {object} en - English locale metadata
 * @property {string} en.title - Site title in English
 * @property {string} en.description - Site description in English
 * @property {string[]} en.keywords - SEO keywords in English
 *
 * @example
 * ```typescript
 * import { siteMetadata } from '@/lib/site'
 *
 * // Get metadata for current locale
 * const locale = 'ja'
 * const metadata = siteMetadata[locale]
 * console.log(metadata.title) // 'Dev Roar Lab'
 * console.log(metadata.description) // 'Dev Roar Labのポートフォリオサイト...'
 * ```
 */
export const siteMetadata = {
  ja: {
    title: 'Dev Roar Lab',
    description:
      'Dev Roar Labのポートフォリオサイト。AWSとPythonを中心としたフルスタックエンジニアの技術ブログとプロジェクト紹介。',
    keywords: [
      'フルスタックエンジニア',
      'AWS',
      'Python',
      'TypeScript',
      'React',
      'Next.js',
      'クラウドインフラ',
      '技術ブログ',
      'ポートフォリオ'
    ]
  },
  en: {
    title: 'Dev Roar Lab',
    description:
      'Portfolio site of Dev Roar Lab. Full-stack engineer specializing in AWS and Python. Technical blog and project showcase.',
    keywords: [
      'Full Stack Engineer',
      'AWS',
      'Python',
      'TypeScript',
      'React',
      'Next.js',
      'Cloud Infrastructure',
      'Tech Blog',
      'Portfolio'
    ]
  }
} as const
