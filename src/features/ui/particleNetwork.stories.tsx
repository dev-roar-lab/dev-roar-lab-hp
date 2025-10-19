import type { Meta, StoryObj } from '@storybook/react'
import { ParticleNetwork } from './particleNetwork'

const meta = {
  title: 'UI/ParticleNetwork',
  component: ParticleNetwork,
  parameters: {
    layout: 'fullscreen'
  },
  tags: ['autodocs']
} satisfies Meta<typeof ParticleNetwork>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    particleCount: 60,
    maxDistance: 120,
    speed: 0.2
  }
}

export const Dense: Story = {
  args: {
    particleCount: 100,
    maxDistance: 100,
    speed: 0.3
  }
}

export const Sparse: Story = {
  args: {
    particleCount: 30,
    maxDistance: 150,
    speed: 0.15
  }
}

export const Fast: Story = {
  args: {
    particleCount: 50,
    maxDistance: 120,
    speed: 0.5
  }
}

export const Slow: Story = {
  args: {
    particleCount: 50,
    maxDistance: 120,
    speed: 0.1
  }
}
