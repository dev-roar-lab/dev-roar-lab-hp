import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
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
      ]
    }
  }
]

export default eslintConfig
