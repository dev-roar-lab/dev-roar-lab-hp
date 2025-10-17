import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BlogPosts } from '@/features/blog/blogPosts'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { HomePageContent } from '@/features/ui/homePageContent'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  const t = await getTranslations()
  return (
    <HomePageContent>
      <section>
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="mb-3 text-4xl font-bold tracking-tighter">{t('home.title')}</h1>
          <p className="mb-4 text-xl text-neutral-600 dark:text-neutral-400">{t('home.subtitle')}</p>
          <p className="mb-8 text-neutral-700 dark:text-neutral-300 leading-relaxed">{t('home.intro')}</p>

          {/* About Link - CTA Button */}
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-all shadow-sm hover:shadow-md"
          >
            <span>{t('home.viewMore')}</span>
            <ArrowIcon />
          </Link>
        </div>

        {/* Skills Section */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold mb-4 tracking-tighter">{t('home.skills.title')}</h2>
          <div className="flex flex-wrap gap-2">
            {['AWS', 'Python', 'TypeScript', 'React', 'Next.js', 'Docker', 'Node.js'].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-sm font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Blog Posts Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6 tracking-tighter">{t('home.blog.title')}</h2>
          <BlogPosts locale={locale} />
        </div>
      </section>
    </HomePageContent>
  )
}
