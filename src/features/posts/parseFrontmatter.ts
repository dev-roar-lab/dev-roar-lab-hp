/**
 * Metadata extracted from MDX frontmatter
 */
type Metadata = {
  /** Post title */
  title: string
  /** Publication date in ISO format */
  publishedAt: string
  /** Brief summary of the post */
  summary: string
  /** Optional cover image path */
  image?: string
}

/**
 * Parses YAML frontmatter from MDX file content
 *
 * @param fileContent - Raw MDX file content with YAML frontmatter
 * @returns Object containing parsed metadata and content body
 *
 * @example
 * ```ts
 * const mdx = `---
 * title: Hello World
 * publishedAt: 2025-01-01
 * summary: My first post
 * ---
 * # Content here`
 *
 * const { metadata, content } = parseFrontmatter(mdx)
 * // metadata: { title: "Hello World", publishedAt: "2025-01-01", summary: "My first post" }
 * // content: "# Content here"
 * ```
 */
export function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes
    metadata[key.trim() as keyof Metadata] = value
  })

  return { metadata: metadata as Metadata, content }
}
