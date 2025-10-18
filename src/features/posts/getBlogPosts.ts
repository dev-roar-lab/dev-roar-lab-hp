import { getMDXData } from '@/features/posts/getMDXData'
import path from 'path'

/**
 * Retrieves all blog posts from the posts content directory
 *
 * Main entry point for fetching blog posts with optional locale filtering.
 * Automatically resolves the posts directory path from the project root.
 *
 * @param locale - Optional locale code (e.g., 'ja', 'en') to filter posts by language
 * @returns Array of blog post objects with metadata, slug, and content
 *
 * @example
 * ```ts
 * // Get all blog posts
 * const allPosts = getBlogPosts()
 *
 * // Get only Japanese posts
 * const jaPosts = getBlogPosts('ja')
 *
 * // Access post data
 * allPosts.forEach(post => {
 *   console.log(post.metadata.title)
 *   console.log(post.slug)
 *   console.log(post.content)
 * })
 * ```
 */
export function getBlogPosts(locale?: string) {
  return getMDXData(path.join(process.cwd(), 'src', 'features', 'posts', 'contents'), locale)
}
