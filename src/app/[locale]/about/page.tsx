import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'About',
  description: 'Learn more about dev-roar-researcher and Dev Roar Lab.'
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  const t = await getTranslations('about')
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{t('title')}</h1>

      <div className="prose prose-neutral dark:prose-invert">
        <h2 className="text-xl font-semibold mb-4">{t('intro.title')}</h2>
        <p className="mb-6">{t('intro.description')}</p>

        <h2 className="text-xl font-semibold mb-4 mt-8">{t('experience.title')}</h2>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>{t('experience.years')}</li>
          <li>{t('experience.role')}</li>
          <li>{t('experience.focus')}</li>
        </ul>

        <h2 className="text-xl font-semibold mb-4 mt-8">{t('skills.title')}</h2>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">{t('skills.cloud.title')}</h3>
          <p className="mb-4">{t('skills.cloud.items')}</p>

          <h3 className="font-semibold mb-2">{t('skills.backend.title')}</h3>
          <p className="mb-4">{t('skills.backend.items')}</p>

          <h3 className="font-semibold mb-2">{t('skills.frontend.title')}</h3>
          <p className="mb-4">{t('skills.frontend.items')}</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-8">{t('contact.title')}</h2>
        <p>{t('contact.description')}</p>
      </div>
    </section>
  )
}
