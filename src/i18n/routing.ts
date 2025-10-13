import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'ja'],
  // TODO デフォルト言語がjaにならない
  defaultLocale: 'ja'
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
