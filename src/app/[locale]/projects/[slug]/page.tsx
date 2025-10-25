import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { CustomMDX } from '@/features/posts/mdx'
import { getProjects } from '@/features/projects/getProjects'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/lib/site'
import { TechBadges } from '@/features/ui/techBadge'
import { createCreativeWorkJsonLd, createBreadcrumbListJsonLd, renderJsonLd } from '@/lib/jsonLd'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const projects = getProjects(locale)
    return projects.map((project) => ({
      locale,
      slug: project.slug
    }))
  })
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const project = getProjects(locale).find((project) => project.slug === slug)
  if (!project) {
    return
  }

  const { title, publishedAt, summary: description } = project.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: publishedAt,
      url: `${siteConfig.url}/${locale}/projects/${project.slug}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/projects/${project.slug}`
    }
  }
}

export default async function Project({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = getProjects(locale).find((project) => project.slug === slug)

  if (!project) {
    notFound()
  }

  // Parse tags for JSON-LD and display
  const rawTags = (project.metadata as { tags?: string[] | string }).tags
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

  // Generate CreativeWork JSON-LD
  const creativeWorkJsonLd = createCreativeWorkJsonLd({
    title: project.metadata.title,
    description: project.metadata.summary,
    publishedAt: project.metadata.publishedAt,
    slug: project.slug,
    locale,
    tags
  })

  // Generate BreadcrumbList JSON-LD
  const breadcrumbJsonLd = createBreadcrumbListJsonLd(
    [{ name: 'Home', url: '/' }, { name: 'Projects', url: '/projects' }, { name: project.metadata.title }],
    locale
  )

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: renderJsonLd(creativeWorkJsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbJsonLd) }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter mb-2">{project.metadata.title}</h1>
      <div className="flex flex-col gap-4 mt-2 mb-8">
        <time className="text-sm text-neutral-600 dark:text-neutral-400">
          {new Date(project.metadata.publishedAt).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>
        {tags && tags.length > 0 && <TechBadges techs={tags} size="sm" />}
      </div>
      <article className="prose prose-neutral dark:prose-invert">
        <CustomMDX source={project.content} />
      </article>
    </section>
  )
}
