import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readMDXFile } from '../readMDXFile'
import fs from 'fs'

// fs.readFileSync をモック
vi.mock('fs')

describe('readMDXFile', () => {
  describe('正常系', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('MDXファイルを読み込み、メタデータとコンテンツを返す', () => {
      // Arrange
      const mockContent = `---
title: テスト記事
publishedAt: 2025-01-01
summary: これはテスト用の記事です
---

# 見出し

本文コンテンツ`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/post.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf-8')
      expect(result.metadata.title).toBe('テスト記事')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
      expect(result.metadata.summary).toBe('これはテスト用の記事です')
      expect(result.content).toContain('# 見出し')
      expect(result.content).toContain('本文コンテンツ')
    })

    it('画像を含むMDXファイルを正しく読み込む', () => {
      // Arrange
      const mockContent = `---
title: 画像付き記事
publishedAt: 2025-01-15
summary: 画像を含む記事
image: /images/test.png
---

![テスト画像](/images/test.png)

画像を含む本文`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/post-with-image.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.metadata.image).toBe('/images/test.png')
      expect(result.content).toContain('![テスト画像](/images/test.png)')
    })

    it('複数のメタデータフィールドを持つファイルを読み込む', () => {
      // Arrange
      const mockContent = `---
title: 完全な記事
publishedAt: 2025-01-01
summary: すべてのフィールドを含む
image: /images/full.png
tags: ["TypeScript", "React", "Next.js"]
author: Test Author
---

完全なコンテンツ`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/full-post.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.metadata.title).toBe('完全な記事')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
      expect(result.metadata.summary).toBe('すべてのフィールドを含む')
      expect(result.metadata.image).toBe('/images/full.png')
    })

    it('日本語コンテンツを含むファイルを正しく読み込む', () => {
      // Arrange
      const mockContent = `---
title: 日本語記事
publishedAt: 2025-01-01
summary: 日本語のサマリー
---

# 日本語見出し

これは日本語の本文です。
「特殊文字」や、句読点、改行も含まれます。`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/japanese-post.ja.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.metadata.title).toBe('日本語記事')
      expect(result.content).toContain('日本語見出し')
      expect(result.content).toContain('「特殊文字」')
    })

    it('英語コンテンツを含むファイルを正しく読み込む', () => {
      // Arrange
      const mockContent = `---
title: English Article
publishedAt: 2025-01-01
summary: English summary
---

# English Heading

This is English content.`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/english-post.en.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.metadata.title).toBe('English Article')
      expect(result.content).toContain('English Heading')
    })
  })

  describe('エッジケース', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('本文が空のファイルを読み込む', () => {
      // Arrange
      const mockContent = `---
title: 本文なし
publishedAt: 2025-01-01
summary: 本文がない記事
---
`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/no-content.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.metadata.title).toBe('本文なし')
      expect(result.content).toBe('')
    })

    it('最小限のフロントマターを持つファイルを読み込む', () => {
      // Arrange
      const mockContent = `---
title: 最小
publishedAt: 2025-01-01
summary: 最小構成
---
本文`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/minimal.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.metadata.title).toBe('最小')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
      expect(result.metadata.summary).toBe('最小構成')
      expect(result.content).toBe('本文')
    })

    it('複雑なMarkdownを含むファイルを読み込む', () => {
      // Arrange
      const mockContent = `---
title: 複雑なMarkdown
publishedAt: 2025-01-01
summary: 様々なMarkdown要素を含む
---

# 見出し1

## 見出し2

- リスト項目1
- リスト項目2

\`\`\`typescript
const code = "example"
\`\`\`

> 引用文

**太字** と *イタリック*`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)
      const filePath = '/test/complex.mdx'

      // Act
      const result = readMDXFile(filePath)

      // Assert
      expect(result.content).toContain('# 見出し1')
      expect(result.content).toContain('## 見出し2')
      expect(result.content).toContain('- リスト項目1')
      expect(result.content).toContain('```typescript')
      expect(result.content).toContain('> 引用文')
    })
  })

  // 実際のファイルシステムを使用したテストは循環参照の問題があるため、
  // ユニットテストではなく統合テストとして扱うべき
  // ここではモックを使ったテストのみを実施

  describe('パス処理', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('異なるファイルパスでも正しく動作する', () => {
      // Arrange
      const mockContent = `---
title: テスト
publishedAt: 2025-01-01
summary: サマリー
---
本文`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)

      // Act & Assert
      const path1 = '/absolute/path/to/post.mdx'
      const result1 = readMDXFile(path1)
      expect(fs.readFileSync).toHaveBeenCalledWith(path1, 'utf-8')
      expect(result1.metadata.title).toBe('テスト')

      vi.clearAllMocks()
      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)

      const path2 = './relative/path/to/post.mdx'
      const result2 = readMDXFile(path2)
      expect(fs.readFileSync).toHaveBeenCalledWith(path2, 'utf-8')
      expect(result2.metadata.title).toBe('テスト')
    })

    it('ロケールを含むファイル名でも正しく動作する', () => {
      // Arrange
      const mockContent = `---
title: ロケールテスト
publishedAt: 2025-01-01
summary: ロケール付きファイル
---
コンテンツ`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)

      // Act
      const resultJa = readMDXFile('/test/post.ja.mdx')
      const resultEn = readMDXFile('/test/post.en.mdx')

      // Assert
      expect(resultJa.metadata.title).toBe('ロケールテスト')
      expect(resultEn.metadata.title).toBe('ロケールテスト')
    })
  })

  describe('返り値の構造', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('返り値がmetadataとcontentプロパティを持つ', () => {
      // Arrange
      const mockContent = `---
title: テスト
publishedAt: 2025-01-01
summary: サマリー
---
本文`

      vi.mocked(fs.readFileSync).mockReturnValue(mockContent)

      // Act
      const result = readMDXFile('/test/post.mdx')

      // Assert
      expect(result).toHaveProperty('metadata')
      expect(result).toHaveProperty('content')
      expect(typeof result.metadata).toBe('object')
      expect(typeof result.content).toBe('string')
    })
  })
})
