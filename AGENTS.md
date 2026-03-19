# AGENTS.md

このファイルは、AIコーディングエージェントがこのリポジトリで作業する際のガイドラインを提供します。

## プロジェクト概要

- **フレームワーク**: Next.js 15 (App Router) + React 19 + TypeScript 5.8
- **スタイリング**: Tailwind CSS v4
- **i18n**: next-intl（`ja` / `en`、デフォルト: `ja`）
- **出力形式**: 静的サイト生成（SSG）— `output: 'export'`
- **ホスティング**: AWS S3 + CloudFront

## 開発コマンド

```bash
npm run dev              # 開発サーバー起動（Turbopack）
npm run build            # 本番ビルド（out/ に出力）
npm run lint             # ESLint 実行
npm run verify-format    # Prettier フォーマットチェック
npm test                 # Vitest ユニットテスト
npm run test:e2e         # Playwright E2Eテスト
npm run ci               # CI パイプライン（format → lint → build）
```

## ディレクトリ構成

```
src/
├── app/[locale]/          # App Router ページ（多言語対応）
├── features/              # ドメイン別機能モジュール
│   ├── posts/            # ブログ記事（MDX）
│   ├── projects/         # プロジェクト（MDX）
│   ├── blog/             # ブログ UI
│   └── ui/               # 共通 UI コンポーネント
├── i18n/                 # 国際化設定
├── lib/                  # 共有ライブラリ
└── middleware.ts         # next-intl ミドルウェア
tests/                    # E2E・アクセシビリティテスト（Playwright）
```

## コーディング規約

### ロケール処理

ページコンポーネントでは必ず `locale` を params から取得する:

```typescript
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
}
```

### ナビゲーション

Next.js デフォルトではなく `@/i18n/routing` のユーティリティを使用:

```typescript
import { Link, redirect, usePathname, useRouter } from '@/i18n/routing'
```

### 翻訳

```typescript
import { useTranslations } from 'next-intl'
const t = useTranslations('SomeKey')
```

翻訳ファイル: `public/locales/{locale}/messages.json`

### パスエイリアス

`@/*` → `./src/*`（tsconfig.json で定義）

## Git ワークフロー

### コミットメッセージ

```
{prefix}: 概要
```

**Prefix**: `feat` / `fix` / `docs` / `refactor` / `style` / `test` / `chore`

### プルリクエスト

- PR のタイトル・説明は **日本語** で記述すること
- タイトル形式: `{prefix}: 変更内容の要約`

### Pre-commit Hooks

Husky + lint-staged により、コミット時に自動実行:

- ESLint (`--fix`) — `*.{ts,tsx,js,jsx,cjs,mjs,md}`
- Prettier (`--write`) — `*.{ts,tsx,js,jsx,cjs,mjs,md,json,yml,yaml}`

## 注意事項

- 静的エクスポートのため、サーバーサイドレンダリングや API Routes は使用不可
- すべてのルートで `generateStaticParams()` が必要
- 画像最適化は無効（`images.unoptimized: true`）
- ドキュメント変更のみ（README.md、AGENTS.md 等）ではバージョンを更新しない
