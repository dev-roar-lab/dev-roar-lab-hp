import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { routing } from '@/i18n/routing'
import { getBlogPosts } from '@/features/posts/getBlogPosts'
import { getProjects } from '@/features/projects/getProjects'

export const dynamic = 'force-static'

/**
 * Generate sitemap for SEO
 *
 * Includes all static pages and dynamic content (blog posts, projects)
 * for all supported locales (ja, en).
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales
  const baseUrl = siteConfig.url

  // Static pages for each locale
  const staticPages = [
    '', // home
    'blog',
    'projects',
    'about'
  ]

  // Generate URLs for static pages
  const staticUrls = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page ? `/${page}` : ''}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1.0 : 0.8
    }))
  )

  // Generate URLs for blog posts
  const blogUrls = await Promise.all(
    locales.map(async (locale) => {
      const blogPosts = await getBlogPosts(locale)
      return blogPosts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.metadata.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7
      }))
    })
  ).then((arrays) => arrays.flat())

  // Generate URLs for projects
  const projectUrls = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getProjects(locale)
      return projects.map((project) => ({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(project.metadata.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7
      }))
    })
  ).then((arrays) => arrays.flat())

  return [...staticUrls, ...blogUrls, ...projectUrls]
}
