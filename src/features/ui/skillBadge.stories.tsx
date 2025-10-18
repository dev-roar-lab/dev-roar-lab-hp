import type { Meta, StoryObj } from '@storybook/react'
import { SkillBadges } from './skillBadge'

const meta = {
  title: 'UI/SkillBadges',
  component: SkillBadges,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SkillBadges>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
