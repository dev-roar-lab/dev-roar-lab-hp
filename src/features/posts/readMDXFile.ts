import fs from 'fs'
import { parseFrontmatter } from '@/features/posts/parseFrontmatter'

/**
 * Reads an MDX file and extracts its frontmatter metadata and content
 *
 * @param filePath - Absolute path to the MDX file
 * @returns Object containing parsed metadata and content body
 *
 * @example
 * ```ts
 * const { metadata, content } = readMDXFile('/path/to/post.mdx')
 * // metadata: { title: "Hello", publishedAt: "2025-01-01", summary: "..." }
 * // content: "# Content here..."
 * ```
 */
export function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}
