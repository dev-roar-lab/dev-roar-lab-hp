/**
 * Formats a date string into a human-readable format
 *
 * @param date - ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
 * @param includeRelative - Whether to include relative time (e.g., "3d ago")
 * @returns Formatted date string in "Month Day, Year" format, optionally with relative time
 *
 * @example
 * ```ts
 * formatDate('2025-01-01') // "January 1, 2025"
 * formatDate('2025-01-01', true) // "January 1, 2025 (3d ago)"
 * ```
 */
export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}
