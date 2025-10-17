'use client'

import { TechBadges } from './techBadge'

const skills = ['AWS', 'Python', 'TypeScript', 'React', 'Next.js', 'Docker', 'Node.js']

export function SkillBadges() {
  return <TechBadges techs={skills} size="md" />
}
