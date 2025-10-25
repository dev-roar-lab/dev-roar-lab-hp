import React from 'react'

/**
 * Optimized Picture component for MDX content
 *
 * Automatically generates picture element with WebP/AVIF sources
 * for optimal image delivery with fallback support.
 *
 * @param props - Image props with src, alt, width, height
 * @returns Picture element with multiple format sources
 *
 * @example
 * ```tsx
 * <OptimizedImage
 *   src="/images/example.png"
 *   alt="Example image"
 *   width={400}
 *   height={300}
 * />
 * ```
 */
export function OptimizedImage(props: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}) {
  const { src, alt, width, height, className = '' } = props

  // Validate alt attribute in development mode
  if (process.env.NODE_ENV === 'development') {
    if (!alt && alt !== '') {
      console.error(
        `[Accessibility Error] Image requires alt attribute: ${src}\n` +
          `Add alt="..." with descriptive text, or alt="" for decorative images.`
      )
    }
  }

  // Extract base path
  const lastDotIndex = src.lastIndexOf('.')
  const basePath = src.substring(0, lastDotIndex)

  // Generate source paths
  const avifSrc = `${basePath}.avif`
  const webpSrc = `${basePath}.webp`
  const fallbackSrc = src

  const imgClass = `rounded-lg ${className}`.trim()

  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={imgClass}
      />
    </picture>
  )
}
