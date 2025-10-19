import type { Meta, StoryObj } from '@storybook/react'
import { TerminalWindow } from './terminalWindow'

const meta = {
  title: 'UI/TerminalWindow',
  component: TerminalWindow,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof TerminalWindow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    commands: [
      {
        command: 'whoami',
        output: 'Full-stack Developer | Cloud Architect',
        delay: 1500
      },
      {
        command: 'cat specialties.txt',
        output: ['React | Next.js | TypeScript', 'Python | FastAPI | pytest', 'AWS | Docker | Terraform'],
        delay: 2000
      },
      {
        command: 'ls -la ~/links',
        output: ['blog/', 'projects/', 'about/'],
        delay: 3000
      }
    ],
    prompt: 'user@dev-roar-lab:~$'
  }
}

export const Japanese: Story = {
  args: {
    commands: [
      {
        command: 'whoami',
        output: 'フルスタックエンジニア | クラウドアーキテクト',
        delay: 1500
      },
      {
        command: 'cat specialties.txt',
        output: ['React | Next.js | TypeScript', 'Python | FastAPI | pytest', 'AWS | Docker | Terraform'],
        delay: 2000
      },
      {
        command: 'ls -la ~/links',
        output: ['blog/', 'projects/', 'about/'],
        delay: 3000
      }
    ],
    prompt: 'user@dev-roar-lab:~$'
  }
}

export const SingleCommand: Story = {
  args: {
    commands: [
      {
        command: 'echo "Hello, World!"',
        output: 'Hello, World!',
        delay: 1000
      }
    ],
    prompt: 'user@terminal:~$'
  }
}

export const CustomPrompt: Story = {
  args: {
    commands: [
      {
        command: 'npm --version',
        output: '10.2.4',
        delay: 1000
      },
      {
        command: 'node --version',
        output: 'v20.11.0',
        delay: 1500
      }
    ],
    prompt: 'developer@macbook:~$'
  }
}
