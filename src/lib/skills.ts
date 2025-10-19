/**
 * Application-wide core skills definitions
 *
 * This module provides a single source of truth for core skill/technology listings
 * used across the application (homepage terminal, about page badges, etc.)
 */

/**
 * Core skills and technologies
 *
 * Ordered by priority/proficiency for display purposes
 */
export const SKILLS = [
  'TypeScript',
  'Next.js',
  'Playwright',
  'Python',
  'C#',
  'Docker',
  'AWS',
  'Terraform',
  'CloudFormation',
  'Git',
  'Claude Code',
  'CI/CD'
] as const

/**
 * Format core skills for terminal display in a grid layout
 *
 * @param columns - Number of columns per row (default: 3)
 * @returns Array of formatted strings, one per row
 *
 * @example
 * ```typescript
 * formatSkillsForTerminal()
 * // Returns:
 * // [
 * //   "TypeScript | Next.js     | Playwright",
 * //   "Python     | C#          | Docker",
 * //   "AWS        | Terraform   | CloudFormation",
 * //   "Git        | Claude Code | CI/CD"
 * // ]
 * ```
 */
export function formatSkillsForTerminal(columns = 3): string[] {
  const result: string[] = []

  // Calculate max width for each column for alignment
  const columnWidths: number[] = []
  for (let col = 0; col < columns; col++) {
    let maxWidth = 0
    for (let i = col; i < SKILLS.length; i += columns) {
      maxWidth = Math.max(maxWidth, SKILLS[i].length)
    }
    columnWidths[col] = maxWidth
  }

  // Format rows
  for (let i = 0; i < SKILLS.length; i += columns) {
    const rowSkills = SKILLS.slice(i, i + columns)
    const formattedRow = rowSkills.map((skill, idx) => skill.padEnd(columnWidths[idx])).join(' | ')
    result.push(formattedRow)
  }

  return result
}
