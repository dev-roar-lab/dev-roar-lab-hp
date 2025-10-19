'use client'

import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('theme')
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-theme-switcher]')) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('click', handleClickOutside)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-neutral-800 animate-pulse" aria-hidden="true" />
  }

  const themeOptions = [
    { value: 'light', label: t('light'), icon: '☀️' },
    { value: 'dark', label: t('dark'), icon: '🌙' },
    { value: 'system', label: t('system'), icon: '💻' }
  ]

  // theme が undefined の場合は 'system' を使用
  const currentThemeValue = theme || 'system'
  const currentTheme = themeOptions.find((option) => option.value === currentThemeValue) || themeOptions[2]

  return (
    <div className="relative" data-theme-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
        aria-label={t('ariaLabel')}
        aria-expanded={isOpen}
      >
        <span className="text-base">{currentTheme.icon}</span>
        <span className="hidden sm:inline">{currentTheme.label}</span>
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
        <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-neutral-900 ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value)
                  setIsOpen(false)
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors ${
                  currentThemeValue === option.value
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
                role="menuitem"
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
                {currentThemeValue === option.value && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
