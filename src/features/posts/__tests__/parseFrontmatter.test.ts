import { describe, it, expect } from 'vitest'
import { parseFrontmatter } from '../parseFrontmatter'

describe('parseFrontmatter', () => {
  describe('正常系', () => {
    it('正しいフロントマターを含むMDXファイルをパースできる', () => {
      // Arrange
      const content = `---
title: テスト記事
publishedAt: 2025-01-01
summary: これはテスト用の記事です
---

本文コンテンツ`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('テスト記事')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
      expect(result.metadata.summary).toBe('これはテスト用の記事です')
      expect(result.content).toBe('本文コンテンツ')
    })

    it('画像URLを含むフロントマターをパースできる', () => {
      // Arrange
      const content = `---
title: 画像付き記事
publishedAt: 2025-01-15
summary: 画像URLを含む記事
image: /images/test.png
---

画像を含む本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('画像付き記事')
      expect(result.metadata.image).toBe('/images/test.png')
      expect(result.content).toBe('画像を含む本文')
    })

    it('引用符で囲まれた値を正しく処理する', () => {
      // Arrange
      const content = `---
title: "引用符付きタイトル"
publishedAt: '2025-01-01'
summary: "これは「特殊文字」を含むサマリー"
---

本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('引用符付きタイトル')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
      expect(result.metadata.summary).toBe('これは「特殊文字」を含むサマリー')
    })

    it('コロンを含む値を正しくパースできる', () => {
      // Arrange
      const content = `---
title: タイトル
publishedAt: 2025-01-01
summary: これは: コロンを含む: サマリー
---

本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.summary).toBe('これは: コロンを含む: サマリー')
    })

    it('複数行の本文を正しく抽出できる', () => {
      // Arrange
      const content = `---
title: 複数行テスト
publishedAt: 2025-01-01
summary: サマリー
---

段落1

段落2

段落3`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.content).toBe(`段落1

段落2

段落3`)
    })
  })

  describe('エッジケース', () => {
    it('空白行を含むフロントマターを正しくパースできる', () => {
      // Arrange
      const content = `---
title: テスト

publishedAt: 2025-01-01
summary: サマリー
---

本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('テスト')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
    })

    it('フロントマターの前後に空白がある場合も正しくパースできる', () => {
      // Arrange
      const content = `
---
title: テスト
publishedAt: 2025-01-01
summary: サマリー
---

本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('テスト')
      expect(result.content).toBe('本文')
    })

    it('本文が空の場合も正しく処理できる', () => {
      // Arrange
      const content = `---
title: 本文なし
publishedAt: 2025-01-01
summary: 本文がない記事
---
`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('本文なし')
      expect(result.content).toBe('')
    })

    it('最小限のフロントマターをパースできる', () => {
      // Arrange
      const content = `---
title: 最小
publishedAt: 2025-01-01
summary: 最小構成
---
本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('最小')
      expect(result.metadata.publishedAt).toBe('2025-01-01')
      expect(result.metadata.summary).toBe('最小構成')
    })
  })

  describe('特殊文字', () => {
    it('日本語を含むフロントマターを正しくパースできる', () => {
      // Arrange
      const content = `---
title: 日本語タイトル：テスト
publishedAt: 2025年1月1日
summary: これは日本語のサマリーです。「特殊文字」も含みます。
---

日本語本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.title).toBe('日本語タイトル：テスト')
      expect(result.content).toBe('日本語本文')
    })

    it('URLを含むフロントマターを正しくパースできる', () => {
      // Arrange
      const content = `---
title: URLテスト
publishedAt: 2025-01-01
summary: https://example.com を含むサマリー
image: https://example.com/image.png
---

本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata.summary).toBe('https://example.com を含むサマリー')
      expect(result.metadata.image).toBe('https://example.com/image.png')
    })
  })

  describe('データ型', () => {
    it('返り値の構造が正しい', () => {
      // Arrange
      const content = `---
title: テスト
publishedAt: 2025-01-01
summary: サマリー
---
本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result).toHaveProperty('metadata')
      expect(result).toHaveProperty('content')
      expect(typeof result.metadata).toBe('object')
      expect(typeof result.content).toBe('string')
    })

    it('必須フィールドが全て含まれる', () => {
      // Arrange
      const content = `---
title: テスト
publishedAt: 2025-01-01
summary: サマリー
---
本文`

      // Act
      const result = parseFrontmatter(content)

      // Assert
      expect(result.metadata).toHaveProperty('title')
      expect(result.metadata).toHaveProperty('publishedAt')
      expect(result.metadata).toHaveProperty('summary')
    })
  })
})
