import fs from 'fs'
import path from 'path'

/**
 * Lists all MDX files in a directory, optionally filtered by locale
 *
 * @param dir - Absolute path to directory containing MDX files
 * @param locale - Optional locale code (e.g., 'ja', 'en') to filter files by suffix
 * @returns Array of MDX file names (e.g., ['post.mdx', 'article.ja.mdx'])
 *
 * @example
 * ```ts
 * // Get all MDX files
 * getMDXFiles('/path/to/posts') // ['post.mdx', 'article.ja.mdx', 'article.en.mdx']
 *
 * // Get only Japanese MDX files
 * getMDXFiles('/path/to/posts', 'ja') // ['article.ja.mdx']
 * ```
 */
export function getMDXFiles(dir: string, locale?: string) {
  const allFiles = fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')

  // ロケールが指定されている場合、そのロケールのファイルのみを返す
  if (locale) {
    return allFiles.filter((file) => file.endsWith(`.${locale}.mdx`))
  }

  return allFiles
}
