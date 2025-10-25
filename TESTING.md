# テストポリシー

このドキュメントは、dev-roar-lab-hpプロジェクトにおけるテスト戦略とガイドラインを定義します。

---

## 目次

1. [テスト戦略](#テスト戦略)
2. [テストの種類](#テストの種類)
3. [カバレッジ目標](#カバレッジ目標)
4. [テスト対象の優先順位](#テスト対象の優先順位)
5. [ディレクトリ構造](#ディレクトリ構造)
6. [命名規則](#命名規則)
7. [モック戦略](#モック戦略)
8. [テストデータ管理](#テストデータ管理)
9. [CI/CD統合](#cicd統合)
10. [ベストプラクティス](#ベストプラクティス)

---

## テスト戦略

### 基本方針

- **テストピラミッド**: ユニットテスト（70%） > 統合テスト（20%） > E2Eテスト（10%）
- **テスト駆動開発（TDD）推奨**: 新機能開発時は可能な限りテストファーストで
- **リグレッション防止**: バグ修正時は必ず再現テストを追加
- **レビュー必須**: テストコードもプロダクションコードと同等にレビュー

### 何をテストするか

✅ **テストする**:

1. **ビジネスロジック**

   - データ変換・計算ロジック
   - 条件分岐・状態遷移
   - エッジケース・境界値

2. **公開API・エクスポート関数**

   - `export`された全ての関数・コンポーネント
   - 外部から利用される機能

3. **重要なユーティリティ**

   - 日付フォーマット、データパース等
   - 複数箇所で使用される共通関数

4. **UIコンポーネント（重要なもの）**
   - ユーザーインタラクションが多いコンポーネント
   - 条件付きレンダリングがあるコンポーネント

❌ **テストしない**:

1. **Next.jsフレームワーク機能**

   - ルーティング、ミドルウェア（Next.jsが保証）
   - 画像最適化、フォント読み込み等

2. **サードパーティライブラリ**

   - `next-intl`、`next-mdx-remote`等の動作
   - ただし、設定や統合部分はテスト対象

3. **単純なプレゼンテーショナルコンポーネント**

   - スタイルのみのラッパーコンポーネント
   - ロジックがないコンポーネント

4. **型定義のみのファイル**
   - TypeScriptの型チェックで保証

---

## テストの種類

### 1. ユニットテスト（Vitest）

**対象**: 個別の関数・モジュール

**ツール**: Vitest

**例**:

- `parseFrontmatter()`
- `formatDate()`
- `getBlogPosts()`

### 2. コンポーネントテスト（Storybook + Vitest Browser Mode）

**対象**: Reactコンポーネント

**ツール**: Storybook Test Addon + Vitest Browser Mode

**例**:

- `<TechBadge />`
- `<Nav />`
- `<BlogPosts />`

### 3. 統合テスト（Vitest）

**対象**: 複数モジュールの連携

**例**:

- MDXファイル読み込み → パース → レンダリング
- i18n設定 → 翻訳取得 → 表示

### 4. E2Eテスト（Playwright）

**対象**: ユーザーシナリオ全体、アクセシビリティ

**ツール**: Playwright + @axe-core/playwright

**例**:

- ブログ記事一覧 → 詳細ページ遷移
- 言語切り替え
- **アクセシビリティテスト（WCAG 2.1 AA準拠）**
  - 全ページのaxe-coreスキャン
  - キーボードナビゲーション
  - フォーカス表示
  - セマンティックHTML構造

---

## カバレッジ目標

### 初期目標（3ヶ月以内）

- **全体**: 70%
- **関数カバレッジ**: 75%
- **分岐カバレッジ**: 70%
- **行カバレッジ**: 70%

### 最終目標（6ヶ月以内）

- **全体**: 80%
- **関数カバレッジ**: 85%
- **分岐カバレッジ**: 80%
- **行カバレッジ**: 80%

### カバレッジ除外対象

以下はカバレッジ計算から除外:

```javascript
// vitest.config.ts
coverage: {
  exclude: [
    '**/*.stories.{ts,tsx}',
    '**/*.config.{ts,js,mjs}',
    '**/node_modules/**',
    '**/out/**',
    '**/.next/**',
    '**/types/**',
    'src/app/**/layout.tsx', // Next.js特有
    'src/middleware.ts' // Next.jsミドルウェア
  ]
}
```

---

## テスト対象の優先順位

### 優先度【高】（必須）

1. **ユーティリティ関数**

   - `src/features/posts/parseFrontmatter.ts`
   - `src/features/posts/formatDate.ts`
   - `src/features/posts/getBlogPosts.ts`
   - `src/features/posts/getMDXFiles.ts`
   - `src/features/posts/readMDXFile.ts`
   - `src/features/projects/getProjects.ts`

2. **データ変換ロジック**
   - MDXメタデータ解析
   - 日付フォーマット
   - 技術タグのパース

### 優先度【中】（推奨）

3. **UIコンポーネント（ロジック含む）**

   - `src/features/ui/techBadge.tsx`
   - `src/features/ui/skillBadge.tsx`
   - `src/features/blog/blogPosts.tsx`

4. **カスタムMDXコンポーネント**
   - `src/features/posts/mdx.tsx` の `slugify()`
   - `src/features/posts/mdx.tsx` の `createHeading()`

### 優先度【低】（オプション）

5. **プレゼンテーショナルコンポーネント**

   - `src/features/ui/nav.tsx`
   - `src/features/ui/footer.tsx`

6. **アニメーション**
   - `src/features/ui/animations.tsx`

---

## ディレクトリ構造

### 配置ルール

**コロケーション方式**: テストファイルは対象ファイルの近くに配置

```
src/
├── features/
│   ├── posts/
│   │   ├── __tests__/           # テストディレクトリ
│   │   │   ├── parseFrontmatter.test.ts
│   │   │   ├── formatDate.test.ts
│   │   │   ├── getBlogPosts.test.ts
│   │   │   └── fixtures/        # テストデータ
│   │   │       └── sample.mdx
│   │   ├── parseFrontmatter.ts
│   │   ├── formatDate.ts
│   │   └── getBlogPosts.ts
│   └── ui/
│       ├── __tests__/
│       │   ├── techBadge.test.tsx
│       │   └── techBadge.stories.tsx
│       └── techBadge.tsx
```

### ファイル命名

- **ユニットテスト**: `{対象ファイル名}.test.{ts,tsx}`
- **Storybook**: `{対象ファイル名}.stories.{ts,tsx}`
- **テストフィクスチャ**: `fixtures/{名前}.{拡張子}`

---

## 命名規則

### describeブロック

```typescript
// 関数の場合
describe('parseFrontmatter', () => { ... })

// コンポーネントの場合
describe('<TechBadge />', () => { ... })

// メソッド・機能の場合
describe('parseFrontmatter() with multi-line values', () => { ... })
```

### itブロック

**推奨形式**: 日本語で具体的に記述

```typescript
// ✅ 良い例
it('正しいフロントマターを含むMDXファイルをパースできる', () => { ... })
it('フロントマターがない場合は空オブジェクトを返す', () => { ... })
it('不正な日付文字列の場合はエラーをスローする', () => { ... })

// ❌ 悪い例
it('works', () => { ... })
it('test case 1', () => { ... })
```

**英語でも可**（チーム方針に合わせる）:

```typescript
it('should parse frontmatter with multi-line values', () => { ... })
it('should return empty object when frontmatter is missing', () => { ... })
```

### テストの構造（AAA パターン）

```typescript
it('日本語ロケールで日付をフォーマットする', () => {
  // Arrange（準備）
  const date = '2025-01-15'
  const locale = 'ja'

  // Act（実行）
  const result = formatDate(date, locale)

  // Assert（検証）
  expect(result).toBe('2025年1月15日')
})
```

---

## モック戦略

### 基本方針

1. **最小限のモック**: 必要最小限のみモック化
2. **実装に近いモック**: 可能な限り実際の動作に近いモックを使用
3. **型安全性**: モックも型チェック対象

### モック対象

#### ✅ モックする

1. **外部API・ネットワークリクエスト**

   ```typescript
   vi.mock('node:fs', () => ({
     readFileSync: vi.fn()
   }))
   ```

2. **日付・時刻（テストの再現性のため）**

   ```typescript
   vi.useFakeTimers()
   vi.setSystemTime(new Date('2025-01-01'))
   ```

3. **環境変数**

   ```typescript
   vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com')
   ```

4. **Next.jsルーター（必要時）**
   ```typescript
   vi.mock('next/navigation', () => ({
     useRouter: () => ({
       push: vi.fn(),
       pathname: '/'
     })
   }))
   ```

#### ❌ モックしない

1. **テスト対象の内部ロジック**
2. **単純なユーティリティ関数**
3. **型定義・定数**

---

## テストデータ管理

### フィクスチャファイル

**配置**: `__tests__/fixtures/` ディレクトリ

```
__tests__/
├── fixtures/
│   ├── sample-blog-post.ja.mdx
│   ├── sample-blog-post.en.mdx
│   ├── invalid-frontmatter.mdx
│   └── test-data.json
```

### テストデータの原則

1. **小さく保つ**: 必要最小限のデータのみ
2. **明確な命名**: データの内容が分かる名前
3. **再利用性**: 複数のテストで共有可能に
4. **バリデーション**: 本番データ形式に準拠

### サンプルフィクスチャ

```typescript
// __tests__/fixtures/blog-post.fixture.ts
export const validBlogPost = `---
title: テスト記事
publishedAt: 2025-01-01
summary: これはテスト用の記事です
---

本文コンテンツ`

export const invalidBlogPost = `本文のみでフロントマターなし`

export const multiLineBlogPost = `---
title: 複数行テスト
description: |
  複数行の
  説明文
publishedAt: 2025-01-01
---

本文`
```

---

## CI/CD統合

### GitHub Actionsでの実行

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm test -- --run --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

### プルリクエスト時のチェック

1. **全テスト成功**: 必須
2. **カバレッジ低下防止**: 基準値以下への低下を禁止
3. **テスト追加推奨**: 新コード追加時はテストも追加

### カバレッジバッジ

README.mdにカバレッジバッジを追加:

```markdown
![Coverage](https://img.shields.io/codecov/c/github/dev-roar-lab/dev-roar-lab-hp)
```

---

## ベストプラクティス

### 1. テストは独立させる

```typescript
// ✅ 良い例
describe('formatDate', () => {
  it('日本語ロケールで日付をフォーマットする', () => {
    const result = formatDate('2025-01-15', 'ja')
    expect(result).toBe('2025年1月15日')
  })

  it('英語ロケールで日付をフォーマットする', () => {
    const result = formatDate('2025-01-15', 'en')
    expect(result).toBe('January 15, 2025')
  })
})

// ❌ 悪い例（前のテストの結果に依存）
let result: string
it('日本語ロケールで日付をフォーマットする', () => {
  result = formatDate('2025-01-15', 'ja')
  expect(result).toBe('2025年1月15日')
})
it('結果が変数に格納される', () => {
  expect(result).toBeDefined() // 前のテストに依存
})
```

### 2. 1テスト1検証

```typescript
// ✅ 良い例
it('タイトルを正しくパースする', () => {
  const result = parseFrontmatter(content)
  expect(result.metadata.title).toBe('テスト')
})

it('日付を正しくパースする', () => {
  const result = parseFrontmatter(content)
  expect(result.metadata.publishedAt).toBe('2025-01-01')
})

// ❌ 悪い例（複数の検証）
it('フロントマターを正しくパースする', () => {
  const result = parseFrontmatter(content)
  expect(result.metadata.title).toBe('テスト')
  expect(result.metadata.publishedAt).toBe('2025-01-01')
  expect(result.metadata.summary).toBe('サマリー')
  expect(result.content).toContain('本文')
})
```

### 3. 境界値・エッジケースをテスト

```typescript
describe('formatDate', () => {
  it('正常な日付', () => { ... })
  it('空文字列の場合', () => { ... })
  it('不正なフォーマットの場合', () => { ... })
  it('未来の日付', () => { ... })
  it('過去100年前の日付', () => { ... })
  it('うるう年の日付', () => { ... })
})
```

### 4. エラーケースのテスト

```typescript
it('不正な日付でエラーをスローする', () => {
  expect(() => formatDate('invalid-date')).toThrow()
  // または具体的なエラーメッセージ
  expect(() => formatDate('invalid-date')).toThrow('Invalid date format')
})
```

### 5. スナップショットテストは慎重に

```typescript
// ✅ 限定的に使用（静的コンテンツ）
it('ブログ記事一覧のHTMLスナップショット', () => {
  const { container } = render(<BlogPosts posts={mockPosts} />)
  expect(container).toMatchSnapshot()
})

// ❌ 頻繁に変更されるUIには使わない
```

### 6. テストのリファクタリング

- **DRY原則**: 共通処理は関数化
- **ヘルパー関数**: `__tests__/helpers/` に配置
- **セットアップ・ティアダウン**: `beforeEach` / `afterEach`を活用

```typescript
// __tests__/helpers/mdx.ts
export function createMDXContent(metadata: Record<string, string>, body: string) {
  const frontmatter = Object.entries(metadata)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')
  return `---\n${frontmatter}\n---\n\n${body}`
}

// テストで使用
const content = createMDXContent({ title: 'テスト', publishedAt: '2025-01-01' }, '本文')
```

---

## レビューチェックリスト

### テストコードレビュー時の確認項目

- [ ] テスト名が分かりやすいか
- [ ] AAA パターンに従っているか
- [ ] テストが独立しているか
- [ ] エッジケースをカバーしているか
- [ ] モックが適切か
- [ ] アサーションが具体的か
- [ ] テストデータが適切か
- [ ] 不要なテストがないか

---

## テスト実行コマンド

### ユニットテスト（Vitest）

```bash
# すべてのテストを実行
npm test

# カバレッジ付きで実行
npm test -- --coverage

# 特定ファイルのみ実行
npm test -- parseFrontmatter.test.ts

# ウォッチモード（開発時）
npm test -- --watch

# UIモード（ブラウザで実行）
npm test -- --ui

# 更新されたテストのみ実行
npm test -- --changed
```

### E2E & アクセシビリティテスト（Playwright）

```bash
# アクセシビリティテストを実行
npm run test:a11y

# 全E2Eテストを実行
npm run test:e2e

# ヘッドありモードで実行（デバッグ用）
npm run test:e2e:headed

# Playwright UIモードで実行
npm run test:e2e:ui

# 特定のブラウザのみ実行
npm run test:e2e -- --project=chromium
```

---

## アクセシビリティテスト（Playwright + axe-core）

### テスト対象ページ

すべての主要ページでWCAG 2.1 Level AA準拠をテスト:

- ホームページ（日本語・英語）
- ブログ一覧ページ（日本語・英語）
- ブログ記事詳細ページ（日本語・英語）
- プロジェクト一覧ページ（日本語・英語）
- Aboutページ（日本語・英語）

### テスト項目

1. **自動アクセシビリティチェック**

   - axe-coreによるWCAG 2.1 AA違反の検出
   - カラーコントラスト比
   - ARIA属性の正しい使用
   - フォーム要素のラベル

2. **ドキュメント構造**

   - 適切な見出し階層
   - lang属性の設定
   - ページタイトルの存在

3. **キーボードナビゲーション**

   - すべてのインタラクティブ要素がキーボードで操作可能
   - フォーカス表示の確認
   - 論理的なTab順序

4. **画像とメディア**

   - 画像のalt属性
   - 装飾的画像の適切なマークアップ

5. **セマンティックHTML**
   - article、section、navなどの適切な使用
   - ランドマーク要素

### 既知の問題（2025-10-25時点）

以下のアクセシビリティ問題が検出されています：

1. **SVGアイコンのアクセシビリティ**
   - **問題**: SVG要素に`aria-label`、`title`、または`role="img"`が不足
   - **影響ページ**: About、Blog、Projects
   - **優先度**: 高
   - **対応予定**: v1.7.0

### テスト実行方法

```bash
# アクセシビリティテストのみ実行
npm run test:a11y

# Chromiumのみで実行（高速）
npm run test:a11y -- --project=chromium

# ヘッドありモードでデバッグ
npm run test:e2e:headed tests/accessibility-homepage.spec.ts
```

### テストの追加方法

新しいページを追加した際は、対応するアクセシビリティテストも追加:

```typescript
// tests/accessibility-newpage.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('New Page Accessibility (Japanese)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/ja/newpage')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

---

## 参考リソース

### ユニットテスト

- [Vitest公式ドキュメント](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Storybook Test Addon](https://storybook.js.org/docs/writing-tests)
- [Effective Snapshot Testing](https://kentcdodds.com/blog/effective-snapshot-testing)

### E2E & アクセシビリティテスト

- [Playwright公式ドキュメント](https://playwright.dev/)
- [axe-core Playwright Integration](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [WCAG 2.1ガイドライン](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIMアクセシビリティチェックリスト](https://webaim.org/standards/wcag/checklist)

---

**策定日**: 2025年10月17日
**最終更新**: 2025年10月25日
**次回レビュー**: 2025年11月25日（1ヶ月後）
