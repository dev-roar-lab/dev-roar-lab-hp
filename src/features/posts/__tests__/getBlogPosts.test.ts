import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getBlogPosts } from '../getBlogPosts'
import * as getMDXDataModule from '../getMDXData'

// getMDXData をモック
vi.mock('../getMDXData')

describe('getBlogPosts', () => {
  describe('正常系', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('すべてのブログ記事を取得する（ロケール指定なし）', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: '記事1',
            publishedAt: '2025-01-01',
            summary: 'サマリー1'
          },
          slug: 'post1',
          content: '本文1'
        },
        {
          metadata: {
            title: '記事2',
            publishedAt: '2025-01-02',
            summary: 'サマリー2'
          },
          slug: 'post2',
          content: '本文2'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toContain('src/features/posts/contents')
      expect(callLocale).toBeUndefined()
      expect(result).toEqual(mockPosts)
      expect(result).toHaveLength(2)
    })

    it('日本語ロケールを指定してブログ記事を取得する', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: '静的型付け',
            publishedAt: '2025-01-01',
            summary: 'TypeScriptの型システムについて'
          },
          slug: 'static-typing',
          content: '日本語本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts('ja')

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toContain('src/features/posts/contents')
      expect(callLocale).toBe('ja')
      expect(result).toEqual(mockPosts)
      expect(result[0].metadata.title).toBe('静的型付け')
    })

    it('英語ロケールを指定してブログ記事を取得する', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: 'Static Typing',
            publishedAt: '2025-01-01',
            summary: 'About TypeScript type system'
          },
          slug: 'static-typing',
          content: 'English content'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts('en')

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toContain('src/features/posts/contents')
      expect(callLocale).toBe('en')
      expect(result).toEqual(mockPosts)
      expect(result[0].metadata.title).toBe('Static Typing')
    })

    it('複数の記事を正しい構造で返す', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: '記事1',
            publishedAt: '2025-01-01',
            summary: 'サマリー1'
          },
          slug: 'post1',
          content: '本文1'
        },
        {
          metadata: {
            title: '記事2',
            publishedAt: '2025-01-02',
            summary: 'サマリー2'
          },
          slug: 'post2',
          content: '本文2'
        },
        {
          metadata: {
            title: '記事3',
            publishedAt: '2025-01-03',
            summary: 'サマリー3'
          },
          slug: 'post3',
          content: '本文3'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(result).toHaveLength(3)
      result.forEach((post, index) => {
        expect(post).toHaveProperty('metadata')
        expect(post).toHaveProperty('slug')
        expect(post).toHaveProperty('content')
        expect(post.metadata.title).toBe(`記事${index + 1}`)
      })
    })

    it('画像を含むメタデータを持つ記事を正しく返す', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: '画像付き記事',
            publishedAt: '2025-01-01',
            summary: '画像を含む',
            image: '/images/post.png'
          },
          slug: 'post-with-image',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(result[0].metadata.image).toBe('/images/post.png')
    })
  })

  describe('エッジケース', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('記事が存在しない場合、空配列を返す', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      const result = getBlogPosts()

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('指定されたロケールの記事が存在しない場合、空配列を返す', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      const result = getBlogPosts('fr')

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('単一の記事でも正しく処理する', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: '単一記事',
            publishedAt: '2025-01-01',
            summary: '単一'
          },
          slug: 'single',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('single')
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

    it('正しいcontentsディレクトリパスでgetMDXDataを呼び出す', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getBlogPosts()

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toMatch(/src[/\\]features[/\\]posts[/\\]contents/)
    })

    it('process.cwd()の結果に基づいて正しいパスを構築する', async () => {
      // Arrange
      const path = await import('path')
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getBlogPosts()

      // Assert
      const [callPath] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      const expectedPath = path.join(process.cwd(), 'src', 'features', 'posts', 'contents')
      expect(callPath).toBe(expectedPath)
    })
  })

  describe('返り値の構造', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('配列で返される', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: 'テスト',
            publishedAt: '2025-01-01',
            summary: 'サマリー'
          },
          slug: 'test',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(Array.isArray(result)).toBe(true)
    })

    it('各要素がmetadata、slug、contentプロパティを持つ', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: 'テスト',
            publishedAt: '2025-01-01',
            summary: 'サマリー'
          },
          slug: 'test',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(result[0]).toHaveProperty('metadata')
      expect(result[0]).toHaveProperty('slug')
      expect(result[0]).toHaveProperty('content')
      expect(typeof result[0].metadata).toBe('object')
      expect(typeof result[0].slug).toBe('string')
      expect(typeof result[0].content).toBe('string')
    })

    it('メタデータが必須フィールドを含む', () => {
      // Arrange
      const mockPosts = [
        {
          metadata: {
            title: 'テスト',
            publishedAt: '2025-01-01',
            summary: 'サマリー'
          },
          slug: 'test',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockPosts)

      // Act
      const result = getBlogPosts()

      // Assert
      expect(result[0].metadata).toHaveProperty('title')
      expect(result[0].metadata).toHaveProperty('publishedAt')
      expect(result[0].metadata).toHaveProperty('summary')
    })
  })

  describe('ロケール引数の伝播', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('ロケール引数がgetMDXDataに正しく渡される（ja）', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getBlogPosts('ja')

      // Assert
      const [, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callLocale).toBe('ja')
    })

    it('ロケール引数がgetMDXDataに正しく渡される（en）', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getBlogPosts('en')

      // Assert
      const [, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callLocale).toBe('en')
    })

    it('ロケール引数がundefinedの場合、getMDXDataにもundefinedが渡される', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getBlogPosts()

      // Assert
      const [, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callLocale).toBeUndefined()
    })
  })
})
