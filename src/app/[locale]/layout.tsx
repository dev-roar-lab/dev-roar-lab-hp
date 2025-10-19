import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/features/ui/nav'
import Footer from '@/features/ui/footer'
import { ThemeProvider } from '@/features/ui/themeProvider'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { siteConfig, siteMetadata } from '@/lib/site'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const isJapanese = locale === 'ja'
  const metadata = isJapanese ? siteMetadata.ja : siteMetadata.en
  const localeCode = isJapanese ? 'ja_JP' : 'en_US'

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: metadata.title,
      template: `%s | ${siteConfig.name}`
    },
    description: metadata.description,
    keywords: [...metadata.keywords],
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type: 'website',
      locale: localeCode,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: metadata.title,
      description: metadata.description
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        ja: `${siteConfig.url}/ja`,
        en: `${siteConfig.url}/en`
      }
    }
  }
}

const cx = (...classes: string[]) => classes.filter(Boolean).join(' ')

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  const messages = await getMessages()
  return (
    <html lang={locale} className={cx(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto bg-white text-black dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
              <Navbar />
              {children}
              <Footer />
            </main>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
