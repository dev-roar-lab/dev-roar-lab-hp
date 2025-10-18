# コントリビューションガイドライン

**Dev Roar Lab HP**へのコントリビューションに興味を持っていただき、ありがとうございます！

このドキュメントでは、プロジェクトへの貢献方法について説明します。

---

## 📖 目次

- [行動規範](#行動規範)
- [はじめに](#はじめに)
- [開発環境のセットアップ](#開発環境のセットアップ)
- [開発ワークフロー](#開発ワークフロー)
- [コーディング規約](#コーディング規約)
- [コミットガイドライン](#コミットガイドライン)
- [プルリクエストプロセス](#プルリクエストプロセス)
- [テストガイドライン](#テストガイドライン)
- [ドキュメント](#ドキュメント)

---

## 🤝 行動規範

このプロジェクトは、オープンで友好的なコミュニティを維持することを目指しています。すべての参加者は以下を心がけてください：

- ✅ 建設的で敬意あるコミュニケーション
- ✅ 多様な視点と経験の尊重
- ✅ 建設的なフィードバックの受け入れ
- ❌ ハラスメントや攻撃的な言動の禁止

---

## 🚀 はじめに

### コントリビューションの種類

以下のような貢献を歓迎します：

- 🐛 **バグ報告**: イシューで詳細を報告
- ✨ **新機能の提案**: イシューで議論
- 📝 **ドキュメント改善**: README、コメント、ガイドの改善
- 🧪 **テスト追加**: カバレッジ向上
- 🎨 **UI/UX改善**: デザインやアクセシビリティの向上
- 🔧 **バグ修正**: イシューを解決するPR

### 事前確認

大きな変更を行う前に：

1. **イシューを確認**: 既に議論されていないか確認
2. **イシューを作成**: 新機能やリファクタリングは事前に提案
3. **議論**: メンテナーや他の貢献者と方向性を確認

---

## 💻 開発環境のセットアップ

### 必要要件

- **Node.js**: 22.20.0以上（推奨: LTS版）
- **npm**: 10以上
- **Git**: 最新版
- **エディタ**: VSCode推奨（設定ファイル同梱）

### セットアップ手順

```bash
# リポジトリをフォーク
# GitHubでForkボタンをクリック

# クローン
git clone https://github.com/YOUR_USERNAME/dev-roar-lab-hp.git
cd dev-roar-lab-hp

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

### ブランチ戦略

- `main`: 本番環境（保護ブランチ）
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `docs/*`: ドキュメント更新
- `refactor/*`: リファクタリング
- `test/*`: テスト追加

---

## 🔄 開発ワークフロー

### 1. ブランチを作成

```bash
# mainブランチから最新を取得
git checkout main
git pull origin main

# 作業ブランチを作成
git checkout -b feature/your-feature-name
```

### 2. 開発

```bash
# 開発サーバーを起動
npm run dev

# コードを編集
# src/ 配下のファイルを編集

# フォーマット確認
npm run verify-format

# リント確認
npm run lint

# テスト実行
npm test
```

### 3. コミット

```bash
# ステージング
git add .

# コミット（pre-commitフックが自動実行）
git commit -m "feat: 新機能の説明"
```

### 4. プッシュとPR

```bash
# リモートにプッシュ
git push origin feature/your-feature-name

# GitHubでプルリクエストを作成
```

---

## 📐 コーディング規約

### TypeScript

- **strict mode**: 必須（`tsconfig.json`で有効化済み）
- **型定義**: `any`の使用は避ける
- **命名規則**:
  - ファイル名: `camelCase.ts` または `PascalCase.tsx`
  - 変数・関数: `camelCase`
  - コンポーネント・型: `PascalCase`
  - 定数: `UPPER_SNAKE_CASE`

### React/Next.js

- **Server Components**: デフォルトでServer Componentsを使用
- **Client Components**: `'use client'`を明示的に宣言
- **Async Components**: ページコンポーネントは`async`を推奨
- **Props**: TypeScriptで型定義必須

```typescript
// ✅ Good
interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}

// ❌ Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>
}
```

### スタイリング

- **Tailwind CSS**: ユーティリティクラスを優先
- **カスタムCSS**: 最小限に抑える
- **ダークモード**: `dark:` prefixで対応

### ファイル構成

**Screaming Architecture**に従い、機能ごとにディレクトリを分割：

```
src/
├── features/           # ドメイン別機能
│   ├── posts/         # ブログ記事機能
│   ├── projects/      # プロジェクト機能
│   └── ui/            # 共通UIコンポーネント
├── app/[locale]/      # Next.js App Router
└── i18n/              # 国際化設定
```

---

## 📝 コミットガイドライン

### コミットメッセージフォーマット

```
{prefix}: 簡潔な説明 (#{issue-number})

詳細な説明（オプション）
- 変更の理由
- 影響範囲
- 破壊的変更がある場合は明記
```

### Prefix一覧

| Prefix     | 用途               | 例                                   |
| ---------- | ------------------ | ------------------------------------ |
| `feat`     | 新機能             | `feat: ブログ検索機能を追加`         |
| `fix`      | バグ修正           | `fix: 日付フォーマットのバグを修正`  |
| `docs`     | ドキュメント       | `docs: READMEにセットアップ手順追加` |
| `refactor` | リファクタリング   | `refactor: MDX関数を分割`            |
| `style`    | フォーマット       | `style: Prettier適用`                |
| `test`     | テスト追加・修正   | `test: formatDateのテスト追加`       |
| `chore`    | ビルド・依存関係   | `chore: 依存関係を更新`              |
| `perf`     | パフォーマンス改善 | `perf: 画像読み込みを最適化`         |

### 例

```bash
# ✅ Good
git commit -m "feat: ブログ記事の検索機能を追加 (#42)

- フルテキスト検索を実装
- 検索結果のハイライト表示
- 日本語・英語に対応"

# ❌ Bad
git commit -m "update"
git commit -m "fix bug"
git commit -m "WIP"
```

### Pre-commit Hooks

コミット時に自動実行（**Husky + lint-staged**）：

1. **ESLint**: `--fix`で自動修正
2. **Prettier**: `--write`でフォーマット

---

## 🔀 プルリクエストプロセス

### PR作成前のチェックリスト

- [ ] `main`ブランチから最新を取得
- [ ] コードがフォーマットされている（`npm run verify-format`）
- [ ] リントエラーがない（`npm run lint`）
- [ ] テストが通る（`npm test`）
- [ ] ビルドが成功する（`npm run build`）
- [ ] 新機能にはテストを追加
- [ ] 破壊的変更がある場合は明記

### PRテンプレート

```markdown
## 概要

<!-- 変更内容の簡潔な説明 -->

## 変更の種類

- [ ] 新機能
- [ ] バグ修正
- [ ] リファクタリング
- [ ] ドキュメント
- [ ] テスト

## 関連するIssue

Closes #(issue番号)

## スクリーンショット（該当する場合）

<!-- UI変更の場合は追加 -->

## テスト

<!-- テスト方法や確認項目 -->

## チェックリスト

- [ ] コードレビュー可能な状態
- [ ] テストを追加・更新
- [ ] ドキュメントを更新
```

### レビュープロセス

1. **自動チェック**: GitHub ActionsでCI実行
2. **コードレビュー**: メンテナーがレビュー
3. **フィードバック対応**: 指摘事項を修正
4. **承認**: 2名以上の承認で`main`にマージ

### マージ戦略

- **Squash and Merge**: 複数のコミットを1つにまとめる（推奨）
- **Rebase and Merge**: 線形な履歴を保つ場合
- **Merge Commit**: 機能ブランチの履歴を残す場合

---

## 🧪 テストガイドライン

### テストの種類

1. **ユニットテスト**: 個別関数のテスト（Vitest）
2. **コンポーネントテスト**: Reactコンポーネント（Vitest + Playwright browser mode）
3. **ビジュアルテスト**: Storybookストーリー

### テストの書き方

```typescript
// src/features/posts/__tests__/formatDate.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '../formatDate'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const result = formatDate('2025-01-01')
    expect(result).toBe('January 1, 2025')
  })

  it('should include relative time when requested', () => {
    const result = formatDate('2025-01-01', true)
    expect(result).toContain('ago')
  })
})
```

### カバレッジ目標

- **全体**: 70%以上
- **重要な関数**: 100%
- **新機能**: 必ずテストを追加

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモード
npm test -- --watch

# カバレッジ計測
npm run test:coverage

# UIモード
npm run test:ui
```

---

## 📚 ドキュメント

### ドキュメントの更新

コードと同様に、ドキュメントも重要です：

- **README.md**: プロジェクト概要と使い方
- **CLAUDE.md**: AI開発支援用の詳細ガイド
- **コメント**: 複雑なロジックには説明を追加
- **Storybook**: UIコンポーネントのストーリー

### コメントの書き方

````typescript
/**
 * MDXブログ記事のカスタムコンポーネント
 *
 * @param props - MDXRemoteのプロパティ
 * @returns レンダリングされたMDXコンポーネント
 *
 * @example
 * ```tsx
 * <CustomMDX source={content} />
 * ```
 */
export function CustomMDX(props: React.ComponentProps<typeof MDXRemote>) {
  return <MDXRemote {...props} components={components} />
}
````

---

## ❓ 質問・サポート

### イシューを作成

- **バグ報告**: 再現手順、環境情報を含める
- **機能提案**: 背景、ユースケース、実装案を記載
- **質問**: DiscussionsまたはIssueで

### コミュニケーション

- **GitHub Issues**: バグ・機能提案
- **GitHub Discussions**: 質問・議論
- **プルリクエスト**: コードレビュー

---

## 🎉 貢献者への感謝

すべてのコントリビューターに感謝します！あなたの貢献がこのプロジェクトをより良いものにします。

---

## 📄 ライセンス

このプロジェクトへのコントリビューションは、[MITライセンス](./LICENSE)の下で公開されることに同意したものとみなされます。
