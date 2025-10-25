'use client'

import { Link, usePathname } from '@/i18n/routing'
import { LanguageSwitcher } from './languageSwitcher'

/**
 * Navigation item configuration
 */
const navItems = {
  '/': {
    name: 'home'
  },
  '/blog': {
    name: 'blog'
  },
  '/projects': {
    name: 'projects'
  },
  '/about': {
    name: 'about'
  }
}

/**
 * Main navigation bar component
 *
 * Displays a horizontal navigation menu with active state highlighting.
 * Navigation items are defined in the navItems configuration.
 * Active state is determined by matching the current pathname.
 *
 * @returns Navigation bar component
 *
 * @example
 * ```tsx
 * <Navbar />
 * ```
 */
export function Navbar() {
  const pathname = usePathname()

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 fade scroll-pr-6"
          id="nav"
          aria-label="Main navigation"
        >
          <div className="flex flex-row space-x-0 pr-10 overflow-x-auto">
            {Object.entries(navItems).map(([path, { name }]) => {
              const isActive = pathname === path || (path !== '/' && pathname.startsWith(path))

              return (
                <Link
                  key={path}
                  href={path}
                  className={`transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-neutral-900 rounded ${
                    isActive
                      ? 'text-neutral-800 dark:text-neutral-200 font-medium'
                      : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {name}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-2 relative">
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
    </aside>
  )
}
