import path from 'path'
import { getMDXData } from '@/features/posts/getMDXData'

/**
 * Retrieves all projects from the projects content directory
 *
 * Main entry point for fetching project data with optional locale filtering.
 * Automatically resolves the projects directory path from the project root.
 *
 * @param locale - Optional locale code (e.g., 'ja', 'en') to filter projects by language
 * @returns Array of project objects with metadata, slug, and content
 *
 * @example
 * ```ts
 * // Get all projects
 * const allProjects = getProjects()
 *
 * // Get only English projects
 * const enProjects = getProjects('en')
 *
 * // Access project data
 * allProjects.forEach(project => {
 *   console.log(project.metadata.title)
 *   console.log(project.slug)
 *   console.log(project.content)
 * })
 * ```
 */
export function getProjects(locale?: string) {
  return getMDXData(path.join(process.cwd(), 'src', 'features', 'projects', 'contents'), locale)
}
