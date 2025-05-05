import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ja'],
  // TODO デフォルト言語がjaにならない
  defaultLocale: 'ja'
})
