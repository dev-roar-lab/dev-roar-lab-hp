import { describe, it, expect, vi } from 'vitest'
import {
  createPersonJsonLd,
  createBlogPostingJsonLd,
  createWebSiteJsonLd,
  createBreadcrumbListJsonLd,
  createCreativeWorkJsonLd,
  renderJsonLd
} from '../jsonLd'

// Mock siteConfig
vi.mock('../site', () => ({
  siteConfig: {
    name: 'Test Site',
    url: 'https://test.example.com',
    author: {
      name: 'Test Author',
      github: 'https://github.com/test-author'
    }
  }
}))

describe('jsonLd', () => {
  describe('createPersonJsonLd', () => {
    it('正しいPerson構造化データを生成する', () => {
      // Act
      const result = createPersonJsonLd()

      // Assert
      expect(result).toEqual({
        '@type': 'Person',
        name: 'Test Author',
        url: 'https://test.example.com',
        sameAs: ['https://github.com/test-author']
      })
    })

    it('必須フィールドが含まれている', () => {
      // Act
      const result = createPersonJsonLd()

      // Assert
      expect(result['@type']).toBe('Person')
      expect(result.name).toBeDefined()
      expect(result.url).toBeDefined()
      expect(result.sameAs).toBeDefined()
      expect(Array.isArray(result.sameAs)).toBe(true)
    })
  })

  describe('createBlogPostingJsonLd', () => {
    it('正しいBlogPosting構造化データを生成する', () => {
      // Arrange
      const input = {
        title: 'Test Blog Post',
        description: 'Test description',
        publishedAt: '2025-01-20',
        slug: 'test-blog-post',
        locale: 'ja',
        tags: ['TypeScript', 'Next.js']
      }

      // Act
      const result = createBlogPostingJsonLd(input)

      // Assert
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('BlogPosting')
      expect(result.headline).toBe('Test Blog Post')
      expect(result.description).toBe('Test description')
      expect(result.datePublished).toBe('2025-01-20')
      expect(result.url).toBe('https://test.example.com/ja/blog/test-blog-post')
      expect(result.inLanguage).toBe('ja-JP')
      expect(result.keywords).toEqual(['TypeScript', 'Next.js'])
    })

    it('著者情報が含まれている', () => {
      // Arrange
      const input = {
        title: 'Test Post',
        publishedAt: '2025-01-20',
        slug: 'test',
        locale: 'ja'
      }

      // Act
      const result = createBlogPostingJsonLd(input)

      // Assert
      expect(result.author).toBeDefined()
      expect(result.author['@type']).toBe('Person')
      expect(result.author.name).toBe('Test Author')
    })

    it('英語ロケールでinLanguageがen-USになる', () => {
      // Arrange
      const input = {
        title: 'Test Post',
        publishedAt: '2025-01-20',
        slug: 'test',
        locale: 'en'
      }

      // Act
      const result = createBlogPostingJsonLd(input)

      // Assert
      expect(result.inLanguage).toBe('en-US')
    })

    it('タグが未定義の場合でも動作する', () => {
      // Arrange
      const input = {
        title: 'Test Post',
        publishedAt: '2025-01-20',
        slug: 'test',
        locale: 'ja'
      }

      // Act
      const result = createBlogPostingJsonLd(input)

      // Assert
      expect(result.keywords).toBeUndefined()
    })
  })

  describe('createWebSiteJsonLd', () => {
    it('正しいWebSite構造化データを生成する（日本語）', () => {
      // Act
      const result = createWebSiteJsonLd('ja')

      // Assert
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('WebSite')
      expect(result.name).toBe('Test Site')
      expect(result.url).toBe('https://test.example.com/ja')
      expect(result.inLanguage).toEqual(['ja-JP'])
    })

    it('正しいWebSite構造化データを生成する（英語）', () => {
      // Act
      const result = createWebSiteJsonLd('en')

      // Assert
      expect(result.url).toBe('https://test.example.com/en')
      expect(result.inLanguage).toEqual(['en-US'])
    })

    it('著者情報が含まれている', () => {
      // Act
      const result = createWebSiteJsonLd('ja')

      // Assert
      expect(result.author).toBeDefined()
      expect(result.author!['@type']).toBe('Person')
    })

    it('検索アクション情報が含まれている', () => {
      // Act
      const result = createWebSiteJsonLd('ja')

      // Assert
      expect(result.potentialAction).toBeDefined()
      expect(result.potentialAction!['@type']).toBe('SearchAction')
      expect(result.potentialAction!.target['@type']).toBe('EntryPoint')
      expect(result.potentialAction!.target.urlTemplate).toContain('/ja/blog')
    })
  })

  describe('createBreadcrumbListJsonLd', () => {
    it('正しいBreadcrumbList構造化データを生成する', () => {
      // Arrange
      const items = [{ name: 'Home', url: '/' }, { name: 'Blog', url: '/blog' }, { name: 'Test Post' }]

      // Act
      const result = createBreadcrumbListJsonLd(items, 'ja')

      // Assert
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('BreadcrumbList')
      expect(result.itemListElement).toHaveLength(3)
    })

    it('各アイテムに正しいposition番号が設定される', () => {
      // Arrange
      const items = [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' }
      ]

      // Act
      const result = createBreadcrumbListJsonLd(items, 'ja')

      // Assert
      expect(result.itemListElement[0].position).toBe(1)
      expect(result.itemListElement[1].position).toBe(2)
    })

    it('URLが正しくフォーマットされる', () => {
      // Arrange
      const items = [{ name: 'Blog', url: '/blog' }]

      // Act
      const result = createBreadcrumbListJsonLd(items, 'ja')

      // Assert
      expect(result.itemListElement[0].item).toBe('https://test.example.com/ja/blog')
    })

    it('最後のアイテムにURLがない場合はitemプロパティがundefined', () => {
      // Arrange
      const items = [{ name: 'Home', url: '/' }, { name: 'Current Page' }]

      // Act
      const result = createBreadcrumbListJsonLd(items, 'ja')

      // Assert
      expect(result.itemListElement[1].item).toBeUndefined()
    })
  })

  describe('createCreativeWorkJsonLd', () => {
    it('正しいCreativeWork構造化データを生成する', () => {
      // Arrange
      const input = {
        title: 'Test Project',
        description: 'Test project description',
        publishedAt: '2025-01-20',
        slug: 'test-project',
        locale: 'ja',
        tags: ['AWS', 'Python']
      }

      // Act
      const result = createCreativeWorkJsonLd(input)

      // Assert
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('CreativeWork')
      expect(result.name).toBe('Test Project')
      expect(result.headline).toBe('Test Project')
      expect(result.description).toBe('Test project description')
      expect(result.datePublished).toBe('2025-01-20')
      expect(result.url).toBe('https://test.example.com/ja/projects/test-project')
      expect(result.inLanguage).toBe('ja-JP')
      expect(result.keywords).toEqual(['AWS', 'Python'])
    })

    it('著者情報とpublisher情報が含まれている', () => {
      // Arrange
      const input = {
        title: 'Test Project',
        publishedAt: '2025-01-20',
        slug: 'test',
        locale: 'ja'
      }

      // Act
      const result = createCreativeWorkJsonLd(input)

      // Assert
      expect(result.author).toBeDefined()
      expect(result.author['@type']).toBe('Person')
      expect(result.publisher).toBeDefined()
      expect(result.publisher!['@type']).toBe('Organization')
      expect(result.publisher!.name).toBe('Test Site')
    })
  })

  describe('renderJsonLd', () => {
    it('オブジェクトをJSON文字列に変換する', () => {
      // Arrange
      const data = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Test'
      }

      // Act
      const result = renderJsonLd(data)

      // Assert
      expect(typeof result).toBe('string')
      expect(JSON.parse(result)).toEqual(data)
    })

    it('ネストされたオブジェクトも正しく変換する', () => {
      // Arrange
      const data = {
        '@type': 'BlogPosting',
        author: {
          '@type': 'Person',
          name: 'Test Author'
        }
      }

      // Act
      const result = renderJsonLd(data)
      const parsed = JSON.parse(result)

      // Assert
      expect(parsed.author.name).toBe('Test Author')
    })
  })
})
