'use client'

import { TechBadges } from './techBadge'

const skills = ['AWS', 'Python', 'TypeScript', 'React', 'Next.js', 'Docker', 'Node.js']

/**
 * Pre-configured skill badges component
 *
 * Displays a fixed list of primary technology skills as badges.
 * The skills list includes: AWS, Python, TypeScript, React, Next.js, Docker, and Node.js.
 *
 * @returns Collection of skill badges
 *
 * @example
 * ```tsx
 * // Display all skills
 * <SkillBadges />
 * ```
 */
export function SkillBadges() {
  return <TechBadges techs={skills} size="md" />
}
