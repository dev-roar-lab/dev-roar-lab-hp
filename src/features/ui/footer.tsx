'use client'

import { useLocale } from 'next-intl'

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        fill="currentColor"
      />
    </svg>
  )
}

function RSSIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20C5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  const locale = useLocale()

  const socialLinks = [
    {
      name: 'github',
      href: 'https://github.com/dev-roar-lab/dev-roar-lab-hp',
      icon: GitHubIcon,
      isExternal: true
    },
    {
      name: 'rss',
      href: `/${locale}/rss.xml`,
      icon: RSSIcon,
      isExternal: false
    }
  ]

  return (
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-wrap gap-4 text-neutral-600 dark:text-neutral-300">
        {socialLinks.map(({ name, href, icon: Icon, isExternal }) => (
          <li key={name}>
            <a
              className="flex items-center gap-2 transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              rel={isExternal ? 'noopener noreferrer' : undefined}
              target={isExternal ? '_blank' : undefined}
              href={href}
            >
              <Icon />
              <span>{name}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-300">
        <p>Built with Next.js + TypeScript · Hosted on AWS</p>
        <p>© {new Date().getFullYear()} MIT Licensed</p>
      </div>
    </footer>
  )
}
