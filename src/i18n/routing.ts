import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['en', 'ja'],
  defaultLocale: 'ja',
  // 静的エクスポート用: ミドルウェアを使用しない
  localePrefix: 'always'
})

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing)
