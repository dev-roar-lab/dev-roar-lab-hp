import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SkillBadges } from '@/features/ui/skillBadge'
import { createPersonJsonLd, renderJsonLd } from '@/lib/jsonLd'

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

  // Generate Person JSON-LD for the author/about page
  const personJsonLd = createPersonJsonLd()

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: renderJsonLd({
            '@context': 'https://schema.org',
            ...personJsonLd
          })
        }}
      />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{t('title')}</h1>

      <div className="prose prose-neutral dark:prose-invert">
        <h2 className="text-xl font-semibold mb-4">{t('intro.title')}</h2>
        <p className="mb-6">{t('intro.description')}</p>

        <h2 className="text-xl font-semibold mb-4 mt-8">{t('career.title')}</h2>
        <div className="mb-6 space-y-4">
          <p>{t('career.education')}</p>

          <div>
            <h3 className="font-semibold mb-2">{t('career.firstPosition.period')}</h3>
            <p className="mb-2">{t('career.firstPosition.role')}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('career.firstPosition.details')}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{t('career.currentPosition.period')}</h3>
            <p className="mb-2">{t('career.currentPosition.role')}</p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('career.currentPosition.details')}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">{t('career.expertise.title')}</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('career.expertise.items')}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 mt-8">{t('skills.title')}</h2>
        <div className="mb-6">
          <SkillBadges />
        </div>
      </div>
    </section>
  )
}
