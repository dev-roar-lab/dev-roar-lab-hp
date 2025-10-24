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
      // カバレッジ対象ファイルを明示的に指定
      include: ['src/**/*.{ts,tsx}'],
      // カバレッジ除外対象
      exclude: [
        // Storybook関連
        '**/*.stories.{ts,tsx}',
        'src/stories/**',
        '**/storybook-static/**',
        // 設定ファイル
        '**/*.config.{ts,js,mjs}',
        // ビルド成果物
        '**/node_modules/**',
        '**/out/**',
        '**/.next/**',
        '**/docs-site/**',
        '**/coverage/**',
        // 型定義
        '**/types/**',
        // Next.js特有（フレームワークが保証）
        'src/app/**/layout.tsx',
        'src/app/**/page.tsx',
        'src/app/**/not-found.tsx',
        'src/app/**/route.ts',
        'src/middleware.ts',
        // テストファイル
        '**/__tests__/**',
        '**/fixtures/**'
      ],
      // カバレッジ目標
      // 段階的に改善: 現状 9.44% → 目標 70% (UIコンポーネントテスト追加後)
      thresholds: {
        lines: 9, // 現状: 9.44%
        functions: 75, // 現状: 76% ✅
        branches: 85, // 現状: 85.36% ✅
        statements: 9 // 現状: 9.44%
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
