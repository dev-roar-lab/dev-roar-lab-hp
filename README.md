# dev-roar-lab-hp

Dev Roar Labのホームページ兼ブログサイト。Next.js App RouterとMDXを使用した多言語対応のWebアプリケーションです。

## 技術スタック

### コア

- **Next.js 15** - React フレームワーク（App Router + Turbopack）
- **React 19** - UIライブラリ
- **TypeScript** - 型安全な開発
- **next-intl** - 多言語対応（日本語・英語）

### スタイリング

- **Tailwind CSS v4** - ユーティリティファーストCSS
- **Geist Font** - Vercel公式フォント（Sans & Mono）
- **PostCSS** - CSS処理

### コンテンツ

- **next-mdx-remote** - MDXレンダリング
- **sugar-high** - シンタックスハイライト

### 開発ツール

- **Storybook** - コンポーネントドキュメント
- **Vitest** - テストフレームワーク（Playwrightブラウザモード）
- **ESLint** - コードリンティング
- **Prettier** - コードフォーマット
- **Husky + lint-staged** - Pre-commitフック

### 分析

- **Vercel Analytics** - アクセス解析
- **Vercel Speed Insights** - パフォーマンス計測

## 必要要件

- Node.js 18.x 以上
- npm または yarn

## セットアップ

```bash
# リポジトリをクローン
git clone <repository-url>
cd dev-roar-lab-hp

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

開発サーバーが起動したら [http://localhost:3000](http://localhost:3000) にアクセスしてください。

## 開発コマンド

### コア開発

```bash
npm run dev              # 開発サーバー起動（Turbopack使用）
npm run build            # 本番ビルド
npm start                # 本番サーバー起動
npm run lint             # ESLint実行
npm run verify-format    # Prettierでフォーマットチェック
npm run ci               # CI/CDパイプライン実行（format → lint → build）
```

### Storybook

```bash
npm run storybook        # Storybookサーバー起動（ポート6006）
npm run build-storybook  # Storybook本番ビルド
```

### テスト

```bash
npm test                 # Vitest実行（Playwrightブラウザモード）
```

## アーキテクチャ概要

### 多言語対応（i18n）

- **対応言語**: 日本語（`ja`）、英語（`en`）
- **デフォルト言語**: 日本語
- **ルーティング**: `/[locale]/` 配下で言語切り替え
- **翻訳ファイル**: `public/locales/{locale}/messages.json`
- **設定**: `src/i18n/routing.ts`、`src/i18n/request.ts`

### ディレクトリ構成（Screaming Architecture）

[screaming-architecture](https://dev.to/profydev/screaming-architecture-evolution-of-a-react-folder-structure-4g25)を参考にしたドメイン駆動設計:

```
src/
├── app/[locale]/          # Next.js App Router（多言語対応）
├── features/              # 機能別モジュール
│   ├── posts/            # MDXブログ機能
│   │   ├── contents/     # MDXブログ記事
│   │   └── mdx.tsx       # カスタムMDXコンポーネント
│   ├── blog/             # ブログUI
│   └── ui/               # 共通UIコンポーネント
├── i18n/                 # 国際化設定
└── stories/              # Storybookストーリー
```

### MDXコンテンツシステム

- ブログ記事は `src/features/posts/contents/` にMDX形式で保存
- カスタムコンポーネント: シンタックスハイライト、カスタムリンク、自動見出しアンカー
- 粒度の高い関数設計: `getMDXFiles`, `readMDXFile`, `parseFrontmatter`, `getMDXData`, `getBlogPosts`

## コミットメッセージルール

コミットメッセージは以下フォーマットです:

```
{prefix}: 概要 (#{issue number})

詳細なコミットメッセージが必要な場合は1行あけてから書いてください。
```

### prefix一覧

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント変更
- `refactor`: リファクタリング
- `style`: フォーマット修正（動作変更なし）
- `test`: テスト追加・修正
- `chore`: ビルド・CI/CD など

### Pre-commit Hooks

Huskyによるpre-commitフックが設定されており、`lint-staged`が自動実行されます。コミット前にフォーマットとリントチェックが行われます。

## ライセンス

Private
