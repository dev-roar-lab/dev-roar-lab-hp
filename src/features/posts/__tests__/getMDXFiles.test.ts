import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { getMDXFiles } from '../getMDXFiles'
import fs from 'fs'

// fs.readdirSync をモック
vi.mock('fs')

describe('getMDXFiles', () => {
  describe('正常系', () => {
    beforeEach(() => {
      // モックをリセット
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('ディレクトリ内のすべてのMDXファイルを返す（ロケール指定なし）', () => {
      // Arrange
      const mockFiles = ['post1.mdx', 'post2.mdx', 'post3.txt', 'post4.en.mdx', 'post5.ja.mdx']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir)

      // Assert
      expect(fs.readdirSync).toHaveBeenCalledWith(dir)
      expect(result).toEqual(['post1.mdx', 'post2.mdx', 'post4.en.mdx', 'post5.ja.mdx'])
      expect(result).toHaveLength(4)
    })

    it('ロケールを指定した場合、そのロケールのファイルのみを返す（ja）', () => {
      // Arrange
      const mockFiles = [
        'static-typing.ja.mdx',
        'static-typing.en.mdx',
        'react-patterns.ja.mdx',
        'react-patterns.en.mdx',
        'other-post.mdx'
      ]
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir, 'ja')

      // Assert
      expect(result).toEqual(['static-typing.ja.mdx', 'react-patterns.ja.mdx'])
      expect(result).toHaveLength(2)
    })

    it('ロケールを指定した場合、そのロケールのファイルのみを返す（en）', () => {
      // Arrange
      const mockFiles = [
        'static-typing.ja.mdx',
        'static-typing.en.mdx',
        'react-patterns.ja.mdx',
        'react-patterns.en.mdx',
        'other-post.mdx'
      ]
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir, 'en')

      // Assert
      expect(result).toEqual(['static-typing.en.mdx', 'react-patterns.en.mdx'])
      expect(result).toHaveLength(2)
    })

    it('MDXファイル以外を除外する', () => {
      // Arrange
      const mockFiles = ['post.mdx', 'README.md', 'config.json', 'image.png', 'script.ts', 'style.css']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir)

      // Assert
      expect(result).toEqual(['post.mdx'])
      expect(result).toHaveLength(1)
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
      vi.mocked(fs.readdirSync).mockReturnValue([] as unknown as fs.Dirent[])
      const dir = '/empty/directory'

      // Act
      const result = getMDXFiles(dir)

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('MDXファイルが存在しない場合、空配列を返す', () => {
      // Arrange
      const mockFiles = ['README.md', 'package.json', 'image.jpg']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir)

      // Assert
      expect(result).toEqual([])
    })

    it('指定されたロケールのファイルが存在しない場合、空配列を返す', () => {
      // Arrange
      const mockFiles = ['post1.ja.mdx', 'post2.ja.mdx']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir, 'en')

      // Assert
      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('大文字小文字が混在する拡張子を正しく処理する', () => {
      // Arrange
      const mockFiles = ['post1.mdx', 'post2.MDX', 'post3.Mdx']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const result = getMDXFiles(dir)

      // Assert
      // path.extname は大文字小文字を保持するため、.mdx のみがマッチする
      expect(result).toEqual(['post1.mdx'])
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

    it('異なるディレクトリパスでも正しく動作する', () => {
      // Arrange
      const mockFiles = ['test.mdx']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])

      // Act & Assert
      const dir1 = '/path/to/posts'
      const result1 = getMDXFiles(dir1)
      expect(fs.readdirSync).toHaveBeenCalledWith(dir1)
      expect(result1).toEqual(['test.mdx'])

      vi.clearAllMocks()
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])

      const dir2 = './src/features/posts/contents'
      const result2 = getMDXFiles(dir2)
      expect(fs.readdirSync).toHaveBeenCalledWith(dir2)
      expect(result2).toEqual(['test.mdx'])
    })
  })

  describe('ロケール処理の詳細', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('複数のロケールが混在していても正しくフィルタリングできる', () => {
      // Arrange
      const mockFiles = ['post1.ja.mdx', 'post1.en.mdx', 'post1.fr.mdx', 'post2.ja.mdx', 'post2.en.mdx']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const resultJa = getMDXFiles(dir, 'ja')
      const resultEn = getMDXFiles(dir, 'en')
      const resultFr = getMDXFiles(dir, 'fr')

      // Assert
      expect(resultJa).toEqual(['post1.ja.mdx', 'post2.ja.mdx'])
      expect(resultEn).toEqual(['post1.en.mdx', 'post2.en.mdx'])
      expect(resultFr).toEqual(['post1.fr.mdx'])
    })

    it('ロケールに類似したファイル名を誤って含まない', () => {
      // Arrange
      const mockFiles = ['japanese.mdx', 'english.mdx', 'post.ja.mdx', 'post.en.mdx']
      vi.mocked(fs.readdirSync).mockReturnValue(mockFiles as unknown as fs.Dirent[])
      const dir = '/test/directory'

      // Act
      const resultJa = getMDXFiles(dir, 'ja')

      // Assert
      expect(resultJa).toEqual(['post.ja.mdx'])
      expect(resultJa).not.toContain('japanese.mdx')
    })
  })
})
