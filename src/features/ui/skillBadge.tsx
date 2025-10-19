'use client'

import { TechBadges } from './techBadge'

const skills = [
  'Playwright',
  'Next.js',
  'TypeScript',
  'Python',
  'C#',
  'Docker',
  'AWS',
  'Terraform',
  'CloudFormation',
  'Git',
  'Claude Code',
  'CI/CD'
]

/**
 * Pre-configured skill badges component
 *
 * Displays a fixed list of primary technology skills as badges.
 * The skills list matches the specialties shown in the terminal on the homepage.
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
