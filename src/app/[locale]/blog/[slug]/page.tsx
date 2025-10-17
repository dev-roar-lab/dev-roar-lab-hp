import { notFound } from 'next/navigation'
import { CustomMDX } from '@/features/posts/mdx'
import { formatDate } from '@/features/posts/formatDate'
import { getBlogPosts } from '@/features/posts/getBlogPosts'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { siteConfig } from '@/lib/site'

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) => {
    const posts = getBlogPosts(locale)
    return posts.map((post) => ({
      locale,
      slug: post.slug
    }))
  })
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const post = getBlogPosts(locale).find((post) => post.slug === slug)
  if (!post) {
    return
  }

  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata
  const ogImage = image ? `${siteConfig.url}${image}` : `${siteConfig.url}/og?title=${encodeURIComponent(title)}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
      images: [
        {
          url: ogImage
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage]
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog/${post.slug}`
    }
  }
}

export default async function Blog({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  const post = getBlogPosts(locale).find((post) => post.slug === slug)

  if (!post) {
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
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${siteConfig.url}${post.metadata.image}`
              : `${siteConfig.url}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
            inLanguage: locale,
            author: {
              '@type': 'Person',
              name: siteConfig.author.name,
              url: siteConfig.author.github
            },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url
            }
          })
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">{post.metadata.title}</h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{formatDate(post.metadata.publishedAt)}</p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
