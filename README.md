<div align="center">

# 🦁 Dev Roar Lab HP

**モダンでスケーラブルなポートフォリオ兼ブログサイト**

[![CI](https://github.com/dev-roar-lab/dev-roar-lab-hp/actions/workflows/ci.yml/badge.svg)](https://github.com/dev-roar-lab/dev-roar-lab-hp/actions/workflows/ci.yml)
[![Deploy](https://github.com/dev-roar-lab/dev-roar-lab-hp/actions/workflows/deploy.yml/badge.svg)](https://github.com/dev-roar-lab/dev-roar-lab-hp/actions/workflows/deploy.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

[English](./README.md) | [日本語](./README.ja.md)

</div>

---

## 📖 目次

- [概要](#概要)
- [特徴](#特徴)
- [技術スタック](#技術スタック)
- [必要要件](#必要要件)
- [セットアップ](#セットアップ)
- [開発](#開発)
- [テスト](#テスト)
- [デプロイ](#デプロイ)
- [アーキテクチャ](#アーキテクチャ)
- [コミット規約](#コミット規約)
- [コントリビューション](#コントリビューション)
- [ライセンス](#ライセンス)

---

## 🎯 概要

**Dev Roar Lab HP**は、Next.js 15のApp RouterとMDXを活用した、多言語対応のモダンなWebアプリケーションです。Static Site Generation (SSG)により高速なページ表示を実現し、AWS S3 + CloudFront でホスティングしています。

### 🌐 デモサイト

- **本番環境**: [https://dev-roar-lab.com](https://dev-roar-lab.com) _(設定後に更新)_

---

## ✨ 特徴

- ⚡ **高速なSSG**: Next.js 15のStatic Site Generationで全ページを事前レンダリング
- 🌍 **多言語対応**: 日本語・英語に対応（next-intl使用）
- 📝 **MDXベースのブログ**: Markdownでコンテンツを管理、カスタムコンポーネント対応
- 🎨 **モダンなUI**: Tailwind CSS v4 + Geist Fontで洗練されたデザイン
- 🔍 **SEO最適化**: メタデータ、OGP、Twitter Card、RSS完備
- ♿ **アクセシビリティ**: セマンティックHTML、alt属性検証
- 🔒 **セキュリティ**: OIDC認証、外部リンク対策
- 🚀 **CI/CD**: GitHub Actions + AWS自動デプロイ
- 🧪 **テスト**: Vitest + Playwright browser mode
- 📚 **Storybook**: コンポーネントドキュメント
- 🏗️ **Screaming Architecture**: ドメイン駆動設計

---

## 🛠️ 技術スタック

### コアテクノロジー

| カテゴリ       | 技術                                            | バージョン | 用途                                           |
| -------------- | ----------------------------------------------- | ---------- | ---------------------------------------------- |
| フレームワーク | [Next.js](https://nextjs.org/)                  | 15.5.4     | React フレームワーク（App Router + Turbopack） |
| ライブラリ     | [React](https://react.dev/)                     | 19.1.0     | UIライブラリ                                   |
| 言語           | [TypeScript](https://www.typescriptlang.org/)   | 5.8.3      | 型安全な開発                                   |
| 国際化         | [next-intl](https://next-intl-docs.vercel.app/) | 4.1.0      | 多言語対応                                     |

### スタイリング

| 技術                                        | 用途                              |
| ------------------------------------------- | --------------------------------- |
| [Tailwind CSS](https://tailwindcss.com/) v4 | ユーティリティファーストCSS       |
| [Geist Font](https://vercel.com/font)       | Vercel公式フォント（Sans & Mono） |
| PostCSS                                     | CSS処理                           |

### コンテンツ管理

| 技術                                                            | 用途                   |
| --------------------------------------------------------------- | ---------------------- |
| [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) | MDXレンダリング        |
| [sugar-high](https://github.com/huozhi/sugar-high)              | シンタックスハイライト |

### 開発ツール

| 技術                                                      | 用途                       |
| --------------------------------------------------------- | -------------------------- |
| [Storybook](https://storybook.js.org/)                    | コンポーネントドキュメント |
| [Vitest](https://vitest.dev/)                             | テストフレームワーク       |
| [Playwright](https://playwright.dev/)                     | ブラウザテスト             |
| [ESLint](https://eslint.org/)                             | コードリンティング         |
| [Prettier](https://prettier.io/)                          | コードフォーマット         |
| [Husky](https://typicode.github.io/husky/)                | Git hooks                  |
| [lint-staged](https://github.com/lint-staged/lint-staged) | Pre-commit checks          |

### インフラ・CI/CD

| 技術                                                  | 用途               |
| ----------------------------------------------------- | ------------------ |
| [GitHub Actions](https://github.com/features/actions) | CI/CD パイプライン |
| AWS S3                                                | 静的ホスティング   |
| AWS CloudFront                                        | CDN配信            |
| AWS CloudFormation                                    | インフラ管理       |

### 分析

| 技術                  | 用途               |
| --------------------- | ------------------ |
| Vercel Analytics      | アクセス解析       |
| Vercel Speed Insights | パフォーマンス計測 |

---

## 📋 必要要件

- **Node.js**: 20.x 以上
- **npm**: 9.x 以上
- **Git**: 最新版推奨

---

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/dev-roar-lab/dev-roar-lab-hp.git
cd dev-roar-lab-hp
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

---

## 💻 開発

### コア開発コマンド

```bash
# 開発サーバー起動（Turbopack使用）
npm run dev

# 開発サーバー起動（キャッシュクリア）
npm run dev:clean

# 本番ビルド（静的エクスポート → out/）
npm run build

# 本番サーバー起動
npm start

# ESLintリンティング
npm run lint

# Prettierフォーマットチェック
npm run verify-format

# CI/CDパイプライン実行（format → lint → build）
npm run ci
```

### Storybook

```bash
# Storybookサーバー起動（ポート6006）
npm run storybook

# Storybook本番ビルド
npm run build-storybook
```

---

## 🧪 テスト

### テストコマンド

```bash
# Vitestテスト実行
npm test

# テストUI起動
npm run test:ui

# カバレッジ計測
npm run test:coverage
```

### テストカバレッジ

現在のカバレッジ:

- **formatDate.ts**: 100% ✅
- **parseFrontmatter.ts**: 100% ✅
- **全体**: 3.79% (目標: 70%)

---

## 🚢 デプロイ

### GitHub Actions による自動デプロイ

`main`ブランチへのpushで自動的にAWSへデプロイされます。

**デプロイフロー**:

1. ビルド (`npm run build`)
2. AWS認証（OIDC + Role Chaining）
3. S3へアップロード (`aws s3 sync`)
4. CloudFrontキャッシュ無効化

詳細は [.github/workflows/README.md](.github/workflows/README.md) を参照してください。

### 手動デプロイ

```bash
# ビルド
npm run build

# S3へアップロード
aws s3 sync out/ s3://$S3_BUCKET_NAME/ --delete

# CloudFrontキャッシュ無効化
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🏗️ アーキテクチャ

### Screaming Architecture

ドメイン駆動設計に基づく[Screaming Architecture](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25)を採用しています。

```
src/
├── app/[locale]/          # Next.js App Router（多言語対応）
│   ├── page.tsx          # ホームページ
│   ├── blog/             # ブログページ
│   │   ├── page.tsx      # ブログ一覧
│   │   └── [slug]/       # 個別記事
│   ├── projects/         # プロジェクトページ
│   ├── about/            # アバウトページ
│   ├── rss.xml/          # RSSフィード
│   ├── layout.tsx        # ルートレイアウト
│   └── not-found.tsx     # 404ページ
├── features/              # ドメイン別機能モジュール
│   ├── posts/            # ブログ記事機能
│   │   ├── contents/     # MDXブログ記事
│   │   ├── __tests__/    # テストファイル
│   │   ├── getBlogPosts.ts   # エントリーポイント
│   │   ├── getMDXData.ts     # データ統合
│   │   ├── getMDXFiles.ts    # ファイル一覧
│   │   ├── readMDXFile.ts    # ファイル読み込み
│   │   ├── parseFrontmatter.ts  # メタデータ解析
│   │   ├── formatDate.ts     # 日付フォーマット
│   │   └── mdx.tsx           # カスタムMDXコンポーネント
│   ├── projects/         # プロジェクト機能
│   │   ├── contents/     # プロジェクトMDX
│   │   └── getProjects.ts
│   ├── blog/             # ブログUI
│   │   └── blogPosts.tsx
│   └── ui/               # 共通UIコンポーネント
│       ├── nav.tsx
│       ├── footer.tsx
│       ├── techBadge.tsx
│       ├── skillBadge.tsx
│       └── animations.tsx
├── i18n/                 # 国際化設定
│   ├── routing.ts        # ロケール定義
│   ├── navigation.ts     # ナビゲーション
│   └── request.ts        # サーバーサイドi18n
├── lib/                  # 共有ライブラリ
│   └── site.ts          # サイト設定
└── stories/              # Storybookストーリー
```

### 多言語対応（i18n）

- **対応言語**: 日本語（`ja`）、英語（`en`）
- **デフォルト**: 日本語
- **ルーティング**: `/[locale]/` で自動切り替え
- **翻訳ファイル**: `public/locales/{locale}/messages.json`
- **ミドルウェア**: `src/middleware.ts` でロケール検出

### MDXコンテンツシステム

**粒度の高い関数設計**:

1. `getMDXFiles(dir)` - .mdxファイル一覧取得
2. `readMDXFile(filepath)` - ファイル読み込み
3. `parseFrontmatter(content)` - YAML frontmatter解析
4. `getMDXData(dir)` - データ統合
5. `getBlogPosts()` - エントリーポイント

**カスタムMDXコンポーネント**:

- `Code` - シンタックスハイライト（sugar-high）
- `createHeading` - 自動見出しアンカー
- `CustomLink` - 外部リンク対策
- `RoundedImage` - 画像スタイル + alt検証
- `Table` - テーブルスタイル

---

## 📝 コミット規約

### コミットメッセージフォーマット

```
{prefix}: 概要 (#{issue number})

詳細な説明（オプション）
```

### Prefix一覧

| Prefix     | 用途             | 例                                  |
| ---------- | ---------------- | ----------------------------------- |
| `feat`     | 新機能           | `feat: ブログ検索機能を追加`        |
| `fix`      | バグ修正         | `fix: 日付フォーマットのバグを修正` |
| `docs`     | ドキュメント     | `docs: READMEにバッジを追加`        |
| `refactor` | リファクタリング | `refactor: MDX関数を分割`           |
| `style`    | フォーマット     | `style: Prettier適用`               |
| `test`     | テスト           | `test: formatDateのテスト追加`      |
| `chore`    | ビルド・CI/CD    | `chore: 依存関係を更新`             |

### Pre-commit Hooks

**Husky + lint-staged**により、コミット前に自動実行されます:

- ESLint (`--fix`)
- Prettier (`--write`)

---

## 🤝 コントリビューション

コントリビューションは歓迎します！以下の手順でお願いします:

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'feat: Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

### 開発ガイド

- 詳細な開発ガイドは [CLAUDE.md](./CLAUDE.md) を参照

---

## 📄 ライセンス

Private

---

## 📚 関連ドキュメント

- [CLAUDE.md](./CLAUDE.md) - AI開発支援用ガイド
- [.github/workflows/README.md](.github/workflows/README.md) - CI/CD詳細ガイド
- [cloudformation/README.md](./cloudformation/README.md) - AWSインフラ構築ガイド

---

## 🙏 謝辞

このプロジェクトは以下の技術に支えられています:

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Vercel](https://vercel.com/) - Font and Analytics
- [Screaming Architecture](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25) - Architecture Pattern

---

<div align="center">

**Built with ❤️ by [Dev Roar Lab](https://github.com/dev-roar-lab)**

</div>
