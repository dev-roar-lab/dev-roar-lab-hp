import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from './nav'

const meta = {
  title: 'UI/Navbar',
  component: Navbar,
  parameters: {
    layout: 'padded'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Navbar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default navigation bar state
 */
export const Default: Story = {}

/**
 * Navigation bar with active home link
 */
export const ActiveHome: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/'
      }
    }
  }
}

/**
 * Navigation bar with active blog link
 */
export const ActiveBlog: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/blog'
      }
    }
  }
}

/**
 * Navigation bar with active projects link
 */
export const ActiveProjects: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/projects'
      }
    }
  }
}

/**
 * Navigation bar with active about link
 */
export const ActiveAbout: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/about'
      }
    }
  }
}
