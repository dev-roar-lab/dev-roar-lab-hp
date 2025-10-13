import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/features/ui/nav'
import Footer from '@/features/ui/footer'
// import { baseUrl } from './sitemap'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getMessages } from 'next-intl/server'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamic = 'force-static'

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000/ja'),
  title: {
    default: 'Next.js Portfolio Starter',
    template: '%s | Next.js Portfolio Starter'
  },
  description: 'This is my portfolio.',
  openGraph: {
    title: 'My Portfolio',
    description: 'This is my portfolio.',
    url: 'http://localhost:3000/ja',
    siteName: 'My Portfolio',
    locale: 'en_US',
    type: 'website'
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

  const messages = await getMessages()
  return (
    <html
      lang={locale}
      className={cx('text-black bg-white dark:text-white dark:bg-black', GeistSans.variable, GeistMono.variable)}
    >
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
            <Navbar />
            {children}
            <Footer />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
