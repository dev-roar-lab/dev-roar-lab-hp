import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import { OptimizedImage } from './mdx-components'

/**
 * Custom table component for MDX content
 *
 * @param props - Component props
 * @param props.data - Table data with headers and rows
 * @returns Rendered HTML table
 */
function Table({ data }: { data: { headers: string[]; rows: string[][] } }) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>)
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

/**
 * Custom link component for MDX content
 *
 * Handles three types of links:
 * - Internal links (starting with '/') - Uses Next.js Link component
 * - Anchor links (starting with '#') - Standard anchor tag
 * - External links - Opens in new tab with security attributes
 *
 * @param props - Standard anchor element props
 * @returns Appropriately configured link component
 */
function CustomLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href

  if (href && href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href && href.startsWith('#')) {
    return <a {...props} />
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />
}

/**
 * Custom pre component for MDX content with keyboard accessibility
 *
 * Makes scrollable code blocks keyboard accessible by adding:
 * - tabindex="0" to allow keyboard focus
 * - role="region" for semantic meaning
 * - aria-label for screen readers
 *
 * @param props - Pre element props
 * @returns Pre element with keyboard accessibility
 */
function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre tabIndex={0} role="region" aria-label="Code block" {...props}>
      {children}
    </pre>
  )
}

/**
 * Custom code component for MDX content with syntax highlighting
 *
 * Uses sugar-high for syntax highlighting.
 * Renders highlighted code as HTML.
 *
 * @param props - Component props
 * @param props.children - Code string to highlight
 * @returns Code element with syntax highlighting
 */
function Code({ children, ...props }: { children: string } & React.HTMLAttributes<HTMLElement>) {
  const codeHTML = highlight(children)
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
}

/**
 * Converts a string to URL-friendly slug format
 *
 * Transformation process:
 * 1. Convert to lowercase
 * 2. Trim whitespace
 * 3. Replace spaces with hyphens
 * 4. Replace '&' with 'and'
 * 5. Remove non-word characters (except hyphens)
 * 6. Replace multiple consecutive hyphens with single hyphen
 *
 * @param str - String to convert to slug
 * @returns URL-friendly slug string
 *
 * @example
 * ```ts
 * slugify('Hello World & More') // 'hello-world-and-more'
 * slugify('TypeScript 101!') // 'typescript-101'
 * ```
 */
function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
}

/**
 * Creates a heading component with auto-generated anchor links
 *
 * Generates heading components (h1-h6) that:
 * - Automatically create slugified IDs from heading text
 * - Include anchor links for direct navigation
 * - Support deep linking to specific sections
 *
 * @param level - Heading level (1-6)
 * @returns Heading component with anchor link support
 *
 * @example
 * ```tsx
 * const H2 = createHeading(2)
 * <H2>My Heading</H2>
 * // Renders: <h2 id="my-heading"><a href="#my-heading" class="anchor"></a>My Heading</h2>
 * ```
 */
function createHeading(level: number) {
  const Heading = ({ children }: { children: React.ReactNode }) => {
    const slug = slugify(String(children))
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor'
        })
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

/**
 * Custom MDX component mappings
 *
 * Maps MDX/Markdown elements to custom React components:
 * - h1-h6: Headings with auto-generated anchor links
 * - Image: Optimized image with WebP/AVIF support and lazy loading
 * - img: Optimized image (MDX default)
 * - a: Links with internal/external handling
 * - pre: Code block container with keyboard accessibility
 * - code: Syntax-highlighted code blocks
 * - Table: Custom table component
 */
const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: OptimizedImage,
  img: OptimizedImage,
  a: CustomLink,
  pre: Pre,
  code: Code,
  Table
}

/**
 * Custom MDX renderer component
 *
 * Wraps next-mdx-remote's MDXRemote with custom component mappings.
 * Allows additional component overrides via props.
 *
 * @param props - MDXRemote component props
 * @returns Rendered MDX content with custom components
 *
 * @example
 * ```tsx
 * <CustomMDX source={mdxContent} />
 * <CustomMDX source={mdxContent} components={{ h1: CustomH1 }} />
 * ```
 */
export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
  return <MDXRemote {...props} components={{ ...components, ...(props.components || {}) }} />
}
