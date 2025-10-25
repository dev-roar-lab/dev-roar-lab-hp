'use client'

import { getTechInfo } from './techIconMap'

/**
 * Props for TechBadge component
 */
interface TechBadgeProps {
  /** Technology name (e.g., 'TypeScript', 'React', 'AWS') */
  tech: string
  /** Badge size variant */
  size?: 'sm' | 'md'
}

/**
 * Technology badge component with icon and label
 *
 * Displays a styled badge for a technology with an optional icon from the tech icon map.
 * If the technology has an icon defined, it will be displayed with its brand color.
 *
 * @param props - Component props
 * @returns Technology badge component
 *
 * @example
 * ```tsx
 * <TechBadge tech="TypeScript" size="md" />
 * <TechBadge tech="React" size="sm" />
 * ```
 */
export function TechBadge({ tech, size = 'md' }: TechBadgeProps) {
  const techInfo = getTechInfo(tech)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-sm gap-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  }

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700`}
    >
      {techInfo ? (
        <>
          <techInfo.icon className={iconSizes[size]} style={{ color: techInfo.color }} aria-hidden="true" />
          <span>{tech}</span>
        </>
      ) : (
        <span>{tech}</span>
      )}
    </span>
  )
}

/**
 * Props for TechBadges component
 */
interface TechBadgesProps {
  /** Array of technology names to display as badges */
  techs: string[]
  /** Badge size variant for all badges */
  size?: 'sm' | 'md'
}

/**
 * Multiple technology badges component
 *
 * Renders a collection of technology badges in a flex-wrap layout with consistent spacing.
 *
 * @param props - Component props
 * @returns Collection of technology badges
 *
 * @example
 * ```tsx
 * <TechBadges techs={['TypeScript', 'React', 'Next.js']} size="md" />
 * <TechBadges techs={['AWS', 'Docker']} size="sm" />
 * ```
 */
export function TechBadges({ techs, size = 'md' }: TechBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {techs.map((tech) => (
        <TechBadge key={tech} tech={tech} size={size} />
      ))}
    </div>
  )
}
