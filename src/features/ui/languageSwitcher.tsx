'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/routing'

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Remove locale prefix from pathname to get the base path
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  const currentLocaleLabel = locale.toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
        aria-label="Language switcher"
      >
        <span className="text-base">🌐</span>
        <span>{currentLocaleLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-neutral-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {routing.locales.map((loc) => (
                <Link
                  key={loc}
                  href={pathnameWithoutLocale}
                  locale={loc}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                    locale === loc
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {loc === 'ja' ? '日本語' : 'English'}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
