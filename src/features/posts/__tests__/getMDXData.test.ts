import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getMDXData } from '../getMDXData'
import * as getMDXFilesModule from '../getMDXFiles'
import * as readMDXFileModule from '../readMDXFile'

// getMDXFiles と readMDXFile をモック
vi.mock('../getMDXFiles')
vi.mock('../readMDXFile')

describe('getMDXData', () => {
  describe('正常系', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('ディレクトリ内のすべてのMDXファイルのデータを返す（ロケール指定なし）', () => {
      // Arrange
      const mockFiles = ['post1.mdx', 'post2.mdx']
      const mockData1 = {
        metadata: {
          title: '記事1',
          publishedAt: '2025-01-01',
          summary: 'サマリー1'
        },
        content: '本文1'
      }
      const mockData2 = {
        metadata: {
          title: '記事2',
          publishedAt: '2025-01-02',
          summary: 'サマリー2'
        },
        content: '本文2'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValueOnce(mockData1).mockReturnValueOnce(mockData2)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir)

      // Assert
      expect(getMDXFilesModule.getMDXFiles).toHaveBeenCalledWith(dir, undefined)
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        metadata: mockData1.metadata,
        slug: 'post1',
        content: '本文1'
      })
      expect(result[1]).toEqual({
        metadata: mockData2.metadata,
        slug: 'post2',
        content: '本文2'
      })
    })

    it('ロケールを指定した場合、そのロケールのファイルのみを処理する（ja）', () => {
      // Arrange
      const mockFiles = ['static-typing.ja.mdx', 'react-patterns.ja.mdx']
      const mockData1 = {
        metadata: {
          title: '静的型付け',
          publishedAt: '2025-01-01',
          summary: '静的型付けについて'
        },
        content: '日本語本文1'
      }
      const mockData2 = {
        metadata: {
          title: 'Reactパターン',
          publishedAt: '2025-01-02',
          summary: 'Reactパターンについて'
        },
        content: '日本語本文2'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValueOnce(mockData1).mockReturnValueOnce(mockData2)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir, 'ja')

      // Assert
      expect(getMDXFilesModule.getMDXFiles).toHaveBeenCalledWith(dir, 'ja')
      expect(result).toHaveLength(2)
      expect(result[0].slug).toBe('static-typing')
      expect(result[1].slug).toBe('react-patterns')
    })

    it('ロケールを指定した場合、そのロケールのファイルのみを処理する（en）', () => {
      // Arrange
      const mockFiles = ['static-typing.en.mdx', 'react-patterns.en.mdx']
      const mockData1 = {
        metadata: {
          title: 'Static Typing',
          publishedAt: '2025-01-01',
          summary: 'About static typing'
        },
        content: 'English content 1'
      }
      const mockData2 = {
        metadata: {
          title: 'React Patterns',
          publishedAt: '2025-01-02',
          summary: 'About React patterns'
        },
        content: 'English content 2'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValueOnce(mockData1).mockReturnValueOnce(mockData2)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir, 'en')

      // Assert
      expect(getMDXFilesModule.getMDXFiles).toHaveBeenCalledWith(dir, 'en')
      expect(result).toHaveLength(2)
      expect(result[0].slug).toBe('static-typing')
      expect(result[1].slug).toBe('react-patterns')
    })

    it('slug がロケール部分を除いたファイル名になる', () => {
      // Arrange
      const mockFiles = ['my-post.ja.mdx']
      const mockData = {
        metadata: {
          title: 'マイ投稿',
          publishedAt: '2025-01-01',
          summary: 'サマリー'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir, 'ja')

      // Assert
      expect(result[0].slug).toBe('my-post')
    })

    it('ロケール指定なしの場合、ファイル名全体がslugになる', () => {
      // Arrange
      const mockFiles = ['simple-post.mdx']
      const mockData = {
        metadata: {
          title: 'シンプル投稿',
          publishedAt: '2025-01-01',
          summary: 'サマリー'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir)

      // Assert
      expect(result[0].slug).toBe('simple-post')
    })
  })

  describe('エッジケース', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('空のディレクトリの場合、空配列を返す', () => {
      // Arrange
      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue([])

      const dir = '/empty/directory'

      // Act
      const result = getMDXData(dir)

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('指定されたロケールのファイルが存在しない場合、空配列を返す', () => {
      // Arrange
      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue([])

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir, 'fr')

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('単一のファイルでも正しく処理する', () => {
      // Arrange
      const mockFiles = ['single.ja.mdx']
      const mockData = {
        metadata: {
          title: '単一記事',
          publishedAt: '2025-01-01',
          summary: '単一'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir, 'ja')

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('single')
    })

    it('画像を含むメタデータを正しく処理する', () => {
      // Arrange
      const mockFiles = ['post-with-image.mdx']
      const mockData = {
        metadata: {
          title: '画像付き記事',
          publishedAt: '2025-01-01',
          summary: '画像を含む',
          image: '/images/test.png'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      const dir = '/test/directory'

      // Act
      const result = getMDXData(dir)

      // Assert
      expect(result[0].metadata.image).toBe('/images/test.png')
    })
  })

  // 実際のファイルシステムを使用したテストは循環参照の問題があるため、
  // ユニットテストではなく統合テストとして扱うべき
  // ここではモックを使ったテストのみを実施

  describe('返り値の構造', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('各要素がmetadata、slug、contentプロパティを持つ', () => {
      // Arrange
      const mockFiles = ['test.mdx']
      const mockData = {
        metadata: {
          title: 'テスト',
          publishedAt: '2025-01-01',
          summary: 'サマリー'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      // Act
      const result = getMDXData('/test/dir')

      // Assert
      expect(result[0]).toHaveProperty('metadata')
      expect(result[0]).toHaveProperty('slug')
      expect(result[0]).toHaveProperty('content')
      expect(typeof result[0].metadata).toBe('object')
      expect(typeof result[0].slug).toBe('string')
      expect(typeof result[0].content).toBe('string')
    })

    it('配列で返される', () => {
      // Arrange
      const mockFiles = ['test1.mdx', 'test2.mdx']
      const mockData = {
        metadata: {
          title: 'テスト',
          publishedAt: '2025-01-01',
          summary: 'サマリー'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      // Act
      const result = getMDXData('/test/dir')

      // Assert
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
    })
  })

  describe('ファイルパス処理', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('readMDXFileに正しいファイルパスが渡される', () => {
      // Arrange
      const mockFiles = ['post.ja.mdx']
      const mockData = {
        metadata: {
          title: 'テスト',
          publishedAt: '2025-01-01',
          summary: 'サマリー'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      const dir = '/test/posts'

      // Act
      getMDXData(dir, 'ja')

      // Assert
      expect(readMDXFileModule.readMDXFile).toHaveBeenCalledWith('/test/posts/post.ja.mdx')
    })

    it('複数ファイルの場合、それぞれに正しいパスが渡される', () => {
      // Arrange
      const mockFiles = ['post1.mdx', 'post2.mdx', 'post3.mdx']
      const mockData = {
        metadata: {
          title: 'テスト',
          publishedAt: '2025-01-01',
          summary: 'サマリー'
        },
        content: '本文'
      }

      vi.mocked(getMDXFilesModule.getMDXFiles).mockReturnValue(mockFiles)
      vi.mocked(readMDXFileModule.readMDXFile).mockReturnValue(mockData)

      const dir = '/test/posts'

      // Act
      getMDXData(dir)

      // Assert
      expect(readMDXFileModule.readMDXFile).toHaveBeenCalledTimes(3)
      expect(readMDXFileModule.readMDXFile).toHaveBeenNthCalledWith(1, '/test/posts/post1.mdx')
      expect(readMDXFileModule.readMDXFile).toHaveBeenNthCalledWith(2, '/test/posts/post2.mdx')
      expect(readMDXFileModule.readMDXFile).toHaveBeenNthCalledWith(3, '/test/posts/post3.mdx')
    })
  })
})
