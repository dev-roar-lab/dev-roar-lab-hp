export const siteConfig = {
  name: 'Dev Roar Lab',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.dev-roar-lab.com',
  author: {
    name: 'dev-roar-researcher',
    github: 'https://github.com/dev-roar-researcher',
    githubRepo: 'https://github.com/dev-roar-lab/dev-roar-lab-hp'
  },
  defaultLocale: 'ja' as const,
  locales: ['ja', 'en'] as const
}

export const siteMetadata = {
  ja: {
    title: 'Dev Roar Lab',
    description:
      'Dev Roar Labのポートフォリオサイト。AWSとPythonを中心としたフルスタックエンジニアの技術ブログとプロジェクト紹介。',
    keywords: [
      'フルスタックエンジニア',
      'AWS',
      'Python',
      'TypeScript',
      'React',
      'Next.js',
      'クラウドインフラ',
      '技術ブログ',
      'ポートフォリオ'
    ]
  },
  en: {
    title: 'Dev Roar Lab',
    description:
      'Portfolio site of Dev Roar Lab. Full-stack engineer specializing in AWS and Python. Technical blog and project showcase.',
    keywords: [
      'Full Stack Engineer',
      'AWS',
      'Python',
      'TypeScript',
      'React',
      'Next.js',
      'Cloud Infrastructure',
      'Tech Blog',
      'Portfolio'
    ]
  }
} as const
