import type { Meta, StoryObj } from '@storybook/react'
import { LanguageSwitcher } from './languageSwitcher'

const meta = {
  title: 'UI/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default language switcher (Japanese locale)
 */
export const Default: Story = {}

/**
 * Language switcher in Japanese locale
 */
export const JapaneseLocale: Story = {
  parameters: {
    nextIntl: {
      locale: 'ja'
    }
  }
}

/**
 * Language switcher in English locale
 */
export const EnglishLocale: Story = {
  parameters: {
    nextIntl: {
      locale: 'en'
    }
  }
}
