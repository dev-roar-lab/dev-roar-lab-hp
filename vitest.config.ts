import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  test: {
    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/*.stories.{ts,tsx}',
        '**/*.config.{ts,js,mjs}',
        '**/node_modules/**',
        '**/out/**',
        '**/.next/**',
        '**/types/**',
        'src/app/**/layout.tsx',
        'src/middleware.ts',
        '**/__tests__/**',
        '**/fixtures/**'
      ],
      // カバレッジ目標（初期: 70%）
      thresholds: {
        lines: 70,
        functions: 75,
        branches: 70,
        statements: 70
      }
    },
    workspace: [
      // ユニットテスト用workspace
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['**/__tests__/**/*.test.{ts,tsx}'],
          environment: 'node'
        }
      },
      // Storybook用workspace
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            name: 'chromium',
            provider: 'playwright'
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      }
    ]
  }
})
