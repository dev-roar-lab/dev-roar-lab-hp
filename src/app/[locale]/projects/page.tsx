import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/routing'
import { getProjects } from '@/features/projects/getProjects'
import { TechBadges } from '@/features/ui/techBadge'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of projects showcasing expertise in AWS, Python, TypeScript, and full-stack development.'
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations('projects')
  const projects = getProjects(locale)

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">{t('title')}</h1>
      <div className="space-y-6">
        {projects.map((project) => {
          const rawTags = (project.metadata as { tags?: string[] | string }).tags
          // タグが文字列の場合は配列に変換
          let tags: string[] | undefined
          if (typeof rawTags === 'string') {
            // YAML配列の文字列表現をパース: "['item1', 'item2']" -> ['item1', 'item2']
            try {
              tags = JSON.parse(rawTags.replace(/'/g, '"'))
            } catch {
              tags = undefined
            }
          } else {
            tags = rawTags
          }
          return (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block p-6 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-blue-400 dark:focus:ring-offset-neutral-900"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold tracking-tight">{project.metadata.title}</h2>
                <time className="text-sm text-neutral-600 dark:text-neutral-400">
                  {new Date(project.metadata.publishedAt).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long'
                  })}
                </time>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 mb-4">{project.metadata.summary}</p>
              {tags && tags.length > 0 && <TechBadges techs={tags} size="sm" />}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
