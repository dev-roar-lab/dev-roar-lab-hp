'use client'

import { SiAmazon, SiPython, SiTypescript, SiReact, SiNextdotjs, SiDocker, SiNodedotjs } from 'react-icons/si'
import { IconType } from 'react-icons'

interface Skill {
  name: string
  icon: IconType
  color: string
}

const skills: Skill[] = [
  { name: 'AWS', icon: SiAmazon, color: '#FF9900' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#339933' }
]

export function SkillBadges() {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map(({ name, icon: Icon, color }) => (
        <span
          key={name}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          <Icon className="w-4 h-4" style={{ color }} />
          <span>{name}</span>
        </span>
      ))}
    </div>
  )
}
