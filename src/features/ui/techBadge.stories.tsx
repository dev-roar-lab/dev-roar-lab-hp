import type { Meta, StoryObj } from '@storybook/react'
import { TechBadge, TechBadges } from './techBadge'

const meta = {
  title: 'UI/TechBadge',
  component: TechBadge,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    tech: {
      control: 'text',
      description: 'Technology name to display'
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Badge size'
    }
  }
} satisfies Meta<typeof TechBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tech: 'TypeScript',
    size: 'md'
  }
}

export const Small: Story = {
  args: {
    tech: 'React',
    size: 'sm'
  }
}

export const Medium: Story = {
  args: {
    tech: 'Next.js',
    size: 'md'
  }
}

export const WithIcon: Story = {
  args: {
    tech: 'AWS',
    size: 'md'
  }
}

export const UnknownTech: Story = {
  args: {
    tech: 'Unknown Technology',
    size: 'md'
  }
}

type MultipleBadgesStory = StoryObj<typeof TechBadges>

export const MultipleBadges: MultipleBadgesStory = {
  render: (args) => <TechBadges {...args} />,
  args: {
    techs: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS'],
    size: 'md'
  }
}

export const SmallBadges: MultipleBadgesStory = {
  render: (args) => <TechBadges {...args} />,
  args: {
    techs: ['AWS', 'Docker', 'Node.js', 'Python'],
    size: 'sm'
  }
}

export const ManyBadges: MultipleBadgesStory = {
  render: (args) => <TechBadges {...args} />,
  args: {
    techs: [
      'TypeScript',
      'React',
      'Next.js',
      'Tailwind CSS',
      'AWS',
      'Docker',
      'Node.js',
      'Python',
      'PostgreSQL',
      'Redis'
    ],
    size: 'md'
  }
}
