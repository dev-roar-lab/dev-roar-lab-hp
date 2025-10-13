import { useTranslations } from 'next-intl'

export default function Page() {
  const t = useTranslations()
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{t('home.title')}</h1>
      <p className="mb-4">{t('home.intro')}</p>
      <div className="my-8">{/*<BlogPosts />*/}</div>
    </section>
  )
}
