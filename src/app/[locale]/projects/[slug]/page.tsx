import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { CustomMDX } from '@/features/posts/mdx'
import { getProjects } from '@/features/projects/getProjects'
import { routing } from '@/i18n/routing'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const projects = getProjects(locale)
    return projects.map((project) => ({
      locale,
      slug: project.slug
    }))
  })
}

export default async function Project({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getProjects(locale).find((project) => project.slug === slug)

  if (!project) {
    notFound()
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Project',
            headline: project.metadata.title,
            datePublished: project.metadata.publishedAt,
            description: project.metadata.summary
          })
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter mb-2">{project.metadata.title}</h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <time className="text-neutral-600 dark:text-neutral-400">
          {new Date(project.metadata.publishedAt).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        {(() => {
          const tags = (project.metadata as unknown as { tags?: string[] }).tags
          return (
            tags &&
            Array.isArray(tags) && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )
          )
        })()}
      </div>
      <article className="prose prose-neutral dark:prose-invert">
        <CustomMDX source={project.content} />
      </article>
    </section>
  )
}
