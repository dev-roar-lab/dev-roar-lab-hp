import { getMDXFiles } from '@/features/posts/getMDXFiles'
import { readMDXFile } from '@/features/posts/readMDXFile'

import path from 'path'

/**
 * Reads all MDX files in a directory and returns their metadata, slugs, and content
 *
 * @param dir - Absolute path to directory containing MDX files
 * @param locale - Optional locale code to filter files (e.g., 'ja', 'en')
 * @returns Array of objects containing metadata, slug, and content for each MDX file
 *
 * @example
 * ```ts
 * // Get all posts
 * getMDXData('/path/to/posts')
 * // [
 * //   { metadata: {...}, slug: 'hello-world', content: '...' },
 * //   { metadata: {...}, slug: 'second-post', content: '...' }
 * // ]
 *
 * // Get only Japanese posts (extracts locale from filename)
 * getMDXData('/path/to/posts', 'ja')
 * // File 'hello.ja.mdx' becomes slug 'hello'
 * ```
 */
export function getMDXData(dir: string, locale?: string) {
  const mdxFiles = getMDXFiles(dir, locale)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    // ファイル名から slug を抽出（例: static-typing.ja.mdx → static-typing）
    const fileName = path.basename(file, path.extname(file))
    const slug = locale ? fileName.replace(`.${locale}`, '') : fileName

    return {
      metadata,
      slug,
      content
    }
  })
}
