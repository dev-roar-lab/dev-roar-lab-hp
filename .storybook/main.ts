import type { StorybookConfig } from '@storybook/nextjs-vite'
import packageJson from '../package.json'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-onboarding', '@chromatic-com/storybook', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {}
  },
  staticDirs: ['../public'],
  docs: {
    defaultName: `Documentation (Version ${packageJson.version})`
  }
}
export default config
