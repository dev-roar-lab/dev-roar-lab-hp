# Documentation Portal

このディレクトリには、Dev Roar Labプロジェクトの技術ドキュメントポータルサイトが含まれています。

## 概要

ドキュメントポータルは以下のドキュメントを統合的に提供します：

- **UIコンポーネント** (Storybook) - React/Next.jsコンポーネントのカタログ
- **API仕様書** (TypeDoc) - TypeScriptコードから自動生成されたAPIリファレンス

## ディレクトリ構造

```
docs-site/
├── public/              # ポータルのソースファイル
│   ├── index.html      # トップページ
│   └── assets/         # CSS、画像など
├── storybook/          # Storybookビルド出力（ビルド時に生成）
├── api/                # TypeDoc出力（ビルド時に生成）
└── README.md           # このファイル
```

## ビルドコマンド

### ドキュメントをビルド

```bash
npm run docs:build
```

このコマンドは以下を実行します：

1. Storybookでコンポーネントカタログを生成 (`docs-site/storybook/`)
2. TypeDocでAPIドキュメントを生成 (`docs-site/api/`)
3. ポータルのトップページをコピー (`docs-site/index.html`)

### ビルド済みファイルをクリーン

```bash
npm run docs:clean
```

## ローカルでの確認

ビルド後、静的サーバーで確認できます：

```bash
npm run docs:build
npx serve docs-site
```

ブラウザで http://localhost:3000 を開きます。

## デプロイ

### GitHub Pagesへの自動デプロイ

`main`ブランチへのプッシュで自動的にGitHub Pagesにデプロイされます。

GitHub Actionsワークフロー: `.github/workflows/deploy-docs.yml`

### 手動デプロイ

1. ドキュメントをビルド:

   ```bash
   npm run docs:build
   ```

2. `docs-site/`ディレクトリの内容をデプロイ先にアップロード

## GitHub Pages設定

1. リポジトリの **Settings** → **Pages** に移動
2. **Source**: GitHub Actions を選択
3. **Custom domain** (オプション): カスタムドメインを設定
   - 例: `docs.your-domain.com`
   - DNSレコード: `CNAME docs.your-domain.com → dev-roar-lab.github.io`

## カスタマイズ

### ポータルページの編集

`docs-site/public/index.html` と `docs-site/public/assets/styles.css` を編集してください。

### TypeDoc設定

`typedoc.json` で以下を設定できます：

- エントリーポイント（解析対象のディレクトリ）
- 除外パターン
- カテゴリ設定
- など

## バージョン情報

- **Storybook**: 9.1.13
- **TypeDoc**: 0.28.14
- **Next.js**: 15.5.4

## トラブルシューティング

### Storybookビルド時の警告

Storybookビルド時に以下の警告が表示されますが、動作に問題はありません：

- `"use client"` ディレクティブの警告：Next.js固有の機能のため、Storybook単体では無視されます
- チャンクサイズの警告：パフォーマンス最適化の提案ですが、現時点では問題ありません

### TypeDocで特定のファイルが生成されない

`typedoc.json` の `exclude` パターンを確認してください。テストファイルやStoriesファイルはデフォルトで除外されています。

## 参考リンク

- [TypeDoc公式ドキュメント](https://typedoc.org/)
- [GitHub Pages公式ドキュメント](https://docs.github.com/pages)
- [Storybook公式ドキュメント](https://storybook.js.org/)
