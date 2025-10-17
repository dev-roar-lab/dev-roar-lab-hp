import { BlogPosts } from '@/features/blog/blogPosts'
import { setRequestLocale } from 'next-intl/server'

export const metadata = {
  title: 'Blog',
  description: 'Read my blog.'
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
