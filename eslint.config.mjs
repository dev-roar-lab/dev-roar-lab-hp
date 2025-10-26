import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'node_modules/**',
      'build/**',
      'next-env.d.ts',
      'storybook-static/**',
      'docs-site/**'
    ]
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    files: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.mjs'],
    rules: {
      'no-warning-comments': [
        'warn',
        {
          terms: ['todo'], // 追加したいキーワード
          location: 'anywhere'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error'
    }
  }
]

export default eslintConfig
