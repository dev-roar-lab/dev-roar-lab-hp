'use client'

import { getTechInfo } from './techIconMap'

interface TechBadgeProps {
  tech: string
  size?: 'sm' | 'md'
}

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
          <techInfo.icon className={iconSizes[size]} style={{ color: techInfo.color }} />
          <span>{tech}</span>
        </>
      ) : (
        <span>{tech}</span>
      )}
    </span>
  )
}

interface TechBadgesProps {
  techs: string[]
  size?: 'sm' | 'md'
}

export function TechBadges({ techs, size = 'md' }: TechBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {techs.map((tech) => (
        <TechBadge key={tech} tech={tech} size={size} />
      ))}
    </div>
  )
}
