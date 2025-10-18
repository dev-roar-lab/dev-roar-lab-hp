import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getProjects } from '../getProjects'
import * as getMDXDataModule from '@/features/posts/getMDXData'

// getMDXData をモック
vi.mock('@/features/posts/getMDXData')

describe('getProjects', () => {
  describe('正常系', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('すべてのプロジェクトを取得する（ロケール指定なし）', () => {
      // Arrange
      const mockProjects = [
        {
          metadata: {
            title: 'プロジェクト1',
            publishedAt: '2025-01-01',
            summary: 'サマリー1'
          },
          slug: 'project1',
          content: '本文1'
        },
        {
          metadata: {
            title: 'プロジェクト2',
            publishedAt: '2025-01-02',
            summary: 'サマリー2'
          },
          slug: 'project2',
          content: '本文2'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toContain('src/features/projects/contents')
      expect(callLocale).toBeUndefined()
      expect(result).toEqual(mockProjects)
      expect(result).toHaveLength(2)
    })

    it('日本語ロケールを指定してプロジェクトを取得する', () => {
      // Arrange
      const mockProjects = [
        {
          metadata: {
            title: 'Webアプリケーション',
            publishedAt: '2025-01-01',
            summary: 'Next.jsで構築したWebアプリ'
          },
          slug: 'web-app',
          content: '日本語本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects('ja')

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toContain('src/features/projects/contents')
      expect(callLocale).toBe('ja')
      expect(result).toEqual(mockProjects)
      expect(result[0].metadata.title).toBe('Webアプリケーション')
    })

    it('英語ロケールを指定してプロジェクトを取得する', () => {
      // Arrange
      const mockProjects = [
        {
          metadata: {
            title: 'Web Application',
            publishedAt: '2025-01-01',
            summary: 'Web app built with Next.js'
          },
          slug: 'web-app',
          content: 'English content'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects('en')

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toContain('src/features/projects/contents')
      expect(callLocale).toBe('en')
      expect(result).toEqual(mockProjects)
      expect(result[0].metadata.title).toBe('Web Application')
    })

    it('複数のプロジェクトを正しい構造で返す', () => {
      // Arrange
      const mockProjects = [
        {
          metadata: {
            title: 'プロジェクト1',
            publishedAt: '2025-01-01',
            summary: 'サマリー1'
          },
          slug: 'project1',
          content: '本文1'
        },
        {
          metadata: {
            title: 'プロジェクト2',
            publishedAt: '2025-01-02',
            summary: 'サマリー2'
          },
          slug: 'project2',
          content: '本文2'
        },
        {
          metadata: {
            title: 'プロジェクト3',
            publishedAt: '2025-01-03',
            summary: 'サマリー3'
          },
          slug: 'project3',
          content: '本文3'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

      // Assert
      expect(result).toHaveLength(3)
      result.forEach((project, index) => {
        expect(project).toHaveProperty('metadata')
        expect(project).toHaveProperty('slug')
        expect(project).toHaveProperty('content')
        expect(project.metadata.title).toBe(`プロジェクト${index + 1}`)
      })
    })

    it('画像を含むメタデータを持つプロジェクトを正しく返す', () => {
      // Arrange
      const mockProjects = [
        {
          metadata: {
            title: '画像付きプロジェクト',
            publishedAt: '2025-01-01',
            summary: '画像を含む',
            image: '/images/project.png'
          },
          slug: 'project-with-image',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

      // Assert
      expect(result[0].metadata.image).toBe('/images/project.png')
    })
  })

  describe('エッジケース', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('プロジェクトが存在しない場合、空配列を返す', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      const result = getProjects()

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('指定されたロケールのプロジェクトが存在しない場合、空配列を返す', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      const result = getProjects('fr')

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('単一のプロジェクトでも正しく処理する', () => {
      // Arrange
      const mockProjects = [
        {
          metadata: {
            title: '単一プロジェクト',
            publishedAt: '2025-01-01',
            summary: '単一'
          },
          slug: 'single',
          content: '本文'
        }
      ]

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('single')
    })
  })

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
      getProjects()

      // Assert
      expect(getMDXDataModule.getMDXData).toHaveBeenCalled()
      const [callPath] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callPath).toMatch(/src[/\\]features[/\\]projects[/\\]contents/)
    })

    it('process.cwd()の結果に基づいて正しいパスを構築する', async () => {
      // Arrange
      const path = await import('path')
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getProjects()

      // Assert
      const [callPath] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      const expectedPath = path.join(process.cwd(), 'src', 'features', 'projects', 'contents')
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
      const mockProjects = [
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

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

      // Assert
      expect(Array.isArray(result)).toBe(true)
    })

    it('各要素がmetadata、slug、contentプロパティを持つ', () => {
      // Arrange
      const mockProjects = [
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

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

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
      const mockProjects = [
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

      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue(mockProjects)

      // Act
      const result = getProjects()

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
      getProjects('ja')

      // Assert
      const [, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callLocale).toBe('ja')
    })

    it('ロケール引数がgetMDXDataに正しく渡される（en）', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getProjects('en')

      // Assert
      const [, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callLocale).toBe('en')
    })

    it('ロケール引数がundefinedの場合、getMDXDataにもundefinedが渡される', () => {
      // Arrange
      vi.mocked(getMDXDataModule.getMDXData).mockReturnValue([])

      // Act
      getProjects()

      // Assert
      const [, callLocale] = vi.mocked(getMDXDataModule.getMDXData).mock.calls[0]
      expect(callLocale).toBeUndefined()
    })
  })
})
