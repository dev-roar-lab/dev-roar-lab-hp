import { getTranslations, setRequestLocale } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  const t = await getTranslations()
  return (
    <section>
      <h1 className="mb-2 text-2xl font-semibold tracking-tighter">{t('home.title')}</h1>
      <p className="mb-8 text-neutral-600 dark:text-neutral-400">{t('home.subtitle')}</p>
      <p className="mb-4">{t('home.intro')}</p>
      <div className="my-8">{/*<BlogPosts />*/}</div>
    </section>
  )
}
