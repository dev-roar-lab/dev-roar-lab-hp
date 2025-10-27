import type { Meta, StoryObj } from '@storybook/react'
import Footer from './footer'

const meta = {
  title: 'UI/Footer',
  component: Footer,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Footer>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default footer with social links, build info, and copyright
 */
export const Default: Story = {}

/**
 * Footer in Japanese locale
 */
export const JapaneseLocale: Story = {
  parameters: {
    nextIntl: {
      locale: 'ja'
    }
  }
}

/**
 * Footer in English locale
 */
export const EnglishLocale: Story = {
  parameters: {
    nextIntl: {
      locale: 'en'
    }
  }
}
