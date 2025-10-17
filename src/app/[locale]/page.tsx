import { getTranslations, setRequestLocale } from 'next-intl/server'
import { BlogPosts } from '@/features/blog/blogPosts'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/routing'

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

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
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
    <section>
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-bold tracking-tighter">{t('home.title')}</h1>
        <p className="mb-4 text-xl text-neutral-600 dark:text-neutral-400">{t('home.subtitle')}</p>
        <p className="mb-6 text-neutral-700 dark:text-neutral-300">{t('home.intro')}</p>

        {/* Social Links */}
        <div className="flex gap-4 mb-8">
          <a
            href="https://github.com/dev-roar-researcher"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <GitHubIcon />
            <span className="text-sm font-medium">GitHub</span>
            <ArrowIcon />
          </a>
          <Link
            href="/about"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <span className="text-sm font-medium">{t('home.viewMore')}</span>
            <ArrowIcon />
          </Link>
        </div>

        {/* Skills Badges */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold mb-3 text-neutral-600 dark:text-neutral-400">
            {t('home.skills.title')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {['AWS', 'Python', 'TypeScript', 'React', 'Next.js', 'Docker', 'Node.js'].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4 tracking-tighter">{t('home.blog.title')}</h2>
        <BlogPosts locale={locale} />
      </div>
    </section>
  )
}
