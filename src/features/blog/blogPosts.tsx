import { Link } from '@/i18n/routing'
import { formatDate } from '@/features/posts/formatDate'
import { getBlogPosts } from '@/features/posts/getBlogPosts'
import { TechBadges } from '@/features/ui/techBadge'

export function BlogPosts({ locale }: { locale: string }) {
  const allBlogs = getBlogPosts(locale)

  return (
    <div className="space-y-8">
      {allBlogs
        .sort((a, b) => {
          if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
            return -1
          }
          return 1
        })
        .map((post) => {
          const rawTags = (post.metadata as { tags?: string[] | string }).tags
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
              key={post.slug}
              className="block group p-4 -mx-4 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              href={`/blog/${post.slug}`}
            >
              <div className="flex flex-col space-y-2">
                <div className="flex flex-col md:flex-row md:items-baseline md:space-x-3">
                  <time className="text-sm text-neutral-600 dark:text-neutral-400 tabular-nums">
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                    {post.metadata.title}
                  </h3>
                </div>
                {post.metadata.summary && (
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                    {post.metadata.summary}
                  </p>
                )}
                {tags && tags.length > 0 && <TechBadges techs={tags} size="sm" />}
              </div>
            </Link>
          )
        })}
    </div>
  )
}
