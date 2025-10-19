import { getTranslations, setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { HomePageContent } from '@/features/ui/homePageContent'
import { TerminalWindow } from '@/features/ui/terminalWindow'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // 静的エクスポート用: ロケールを設定して静的レンダリングを有効化
  setRequestLocale(locale)

  const t = await getTranslations()

  // ターミナルコマンドの定義
  const commands = [
    {
      command: t('terminal.commands.whoami.command'),
      output: t('terminal.commands.whoami.output'),
      delay: 1500
    },
    {
      command: t('terminal.commands.cat_skills.command'),
      output: t.raw('terminal.commands.cat_skills.output') as string[],
      delay: 2000
    },
    {
      command: t('terminal.commands.ls_links.command'),
      output: t.raw('terminal.commands.ls_links.output') as string[],
      delay: 3000
    }
  ]

  return (
    <HomePageContent>
      {/* メインコンテンツ */}
      <section className="relative flex items-center justify-center min-h-[calc(100vh-200px)]">
        <TerminalWindow commands={commands} prompt={t('terminal.prompt')} />
      </section>
    </HomePageContent>
  )
}
