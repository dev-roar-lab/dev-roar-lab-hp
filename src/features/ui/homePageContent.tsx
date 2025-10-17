'use client'

import { FadeIn } from './animations'
import { ReactNode } from 'react'

export function HomePageContent({ children }: { children: ReactNode }) {
  return <FadeIn>{children}</FadeIn>
}
