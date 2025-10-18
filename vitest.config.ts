import path from 'node:path'
// import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

// import { storybookTest } from '@storybook/experimental-addon-test/vitest-plugin'

// const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
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
      }
      // Storybook用workspace（一時的に無効化）
      // eslint-disable-next-line no-warning-comments -- 将来の有効化のため意図的にTODOを残す
      // TODO: Next.js 15との互換性問題解決後に有効化
      // エラー: Cannot find module 'next/dist/build/webpack/plugins/define-env-plugin.js'
      // @storybook/experimental-nextjs-vite@8.6.12 が Next.js 15.5.4 の内部APIに対応していない
      // 対応策: Storybookの次期バージョン待ち、または代替テスト方法の検討
      // {
      //   extends: true,
      //   plugins: [
      //     storybookTest({ configDir: path.join(dirname, '.storybook') })
      //   ],
      //   test: {
      //     name: 'storybook',
      //     browser: {
      //       enabled: true,
      //       headless: true,
      //       name: 'chromium',
      //       provider: 'playwright'
      //     },
      //     setupFiles: ['.storybook/vitest.setup.ts']
      //   }
      // }
    ]
  }
})
