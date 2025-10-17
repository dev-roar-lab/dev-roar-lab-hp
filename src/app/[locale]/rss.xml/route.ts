import { getBlogPosts } from '@/features/posts/getBlogPosts'
import { siteConfig, siteMetadata } from '@/lib/site'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const posts = getBlogPosts(locale)
  const isJapanese = locale === 'ja'
  const metadata = isJapanese ? siteMetadata.ja : siteMetadata.en

  const rssItems = posts
    .sort((a, b) => {
      return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    })
    .map((post) => {
      const postUrl = `${siteConfig.url}/${locale}/blog/${post.slug}`
      const pubDate = new Date(post.metadata.publishedAt).toUTCString()

      return `
    <item>
      <title>${escapeXml(post.metadata.title)}</title>
      <link>${postUrl}</link>
      <description>${escapeXml(post.metadata.summary)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${postUrl}</guid>
    </item>`
    })
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(metadata.title)}</title>
    <link>${siteConfig.url}/${locale}</link>
    <description>${escapeXml(metadata.description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/${locale}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}

// XMLの特殊文字をエスケープする関数
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
