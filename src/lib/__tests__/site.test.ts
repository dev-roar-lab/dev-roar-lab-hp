import { describe, it, expect } from 'vitest'
import { siteConfig, siteMetadata } from '../site'

describe('siteConfig', () => {
  describe('基本構造', () => {
    it('siteConfigが定義されている', () => {
      expect(siteConfig).toBeDefined()
      expect(typeof siteConfig).toBe('object')
    })

    it('必須フィールドを含む', () => {
      expect(siteConfig).toHaveProperty('name')
      expect(siteConfig).toHaveProperty('url')
      expect(siteConfig).toHaveProperty('author')
      expect(siteConfig).toHaveProperty('defaultLocale')
      expect(siteConfig).toHaveProperty('locales')
    })
  })

  describe('サイト情報', () => {
    it('サイト名が正しい', () => {
      expect(siteConfig.name).toBe('Dev Roar Lab')
      expect(typeof siteConfig.name).toBe('string')
      expect(siteConfig.name.length).toBeGreaterThan(0)
    })

    it('サイトURLが有効な形式', () => {
      expect(typeof siteConfig.url).toBe('string')
      expect(siteConfig.url).toMatch(/^https?:\/\//)
    })
  })

  describe('著者情報', () => {
    it('著者情報が定義されている', () => {
      expect(siteConfig.author).toBeDefined()
      expect(typeof siteConfig.author).toBe('object')
    })

    it('著者名が含まれる', () => {
      expect(siteConfig.author).toHaveProperty('name')
      expect(typeof siteConfig.author.name).toBe('string')
      expect(siteConfig.author.name.length).toBeGreaterThan(0)
    })

    it('GitHubのURLが有効な形式', () => {
      expect(siteConfig.author).toHaveProperty('github')
      expect(siteConfig.author.github).toMatch(/^https:\/\/github\.com\//)
    })

    it('GitHubリポジトリのURLが有効な形式', () => {
      expect(siteConfig.author).toHaveProperty('githubRepo')
      expect(siteConfig.author.githubRepo).toMatch(/^https:\/\/github\.com\/[^/]+\/[^/]+$/)
    })
  })

  describe('ロケール設定', () => {
    it('デフォルトロケールが定義されている', () => {
      expect(siteConfig.defaultLocale).toBeDefined()
      expect(typeof siteConfig.defaultLocale).toBe('string')
    })

    it('デフォルトロケールがjaである', () => {
      expect(siteConfig.defaultLocale).toBe('ja')
    })

    it('localesが配列である', () => {
      expect(Array.isArray(siteConfig.locales)).toBe(true)
    })

    it('localesにjaとenが含まれる', () => {
      expect(siteConfig.locales).toContain('ja')
      expect(siteConfig.locales).toContain('en')
      expect(siteConfig.locales.length).toBe(2)
    })

    it('デフォルトロケールがlocalesに含まれる', () => {
      expect(siteConfig.locales).toContain(siteConfig.defaultLocale)
    })
  })
})

describe('siteMetadata', () => {
  describe('基本構造', () => {
    it('siteMetadataが定義されている', () => {
      expect(siteMetadata).toBeDefined()
      expect(typeof siteMetadata).toBe('object')
    })

    it('jaとenのメタデータが含まれる', () => {
      expect(siteMetadata).toHaveProperty('ja')
      expect(siteMetadata).toHaveProperty('en')
    })

    it('各ロケールに必須フィールドが含まれる', () => {
      ;(['ja', 'en'] as const).forEach((locale) => {
        expect(siteMetadata[locale]).toHaveProperty('title')
        expect(siteMetadata[locale]).toHaveProperty('description')
        expect(siteMetadata[locale]).toHaveProperty('keywords')
      })
    })
  })

  describe('日本語メタデータ', () => {
    it('タイトルが定義されている', () => {
      expect(siteMetadata.ja.title).toBe('Dev Roar Lab')
      expect(typeof siteMetadata.ja.title).toBe('string')
    })

    it('説明文が定義されている', () => {
      expect(typeof siteMetadata.ja.description).toBe('string')
      expect(siteMetadata.ja.description.length).toBeGreaterThan(0)
      expect(siteMetadata.ja.description).toContain('Dev Roar Lab')
    })

    it('キーワードが配列である', () => {
      expect(Array.isArray(siteMetadata.ja.keywords)).toBe(true)
      expect(siteMetadata.ja.keywords.length).toBeGreaterThan(0)
    })

    it('主要な技術キーワードが含まれる', () => {
      const expectedKeywords = ['AWS', 'Python', 'TypeScript', 'Next.js']
      expectedKeywords.forEach((keyword) => {
        expect(siteMetadata.ja.keywords).toContain(keyword)
      })
    })

    it('全てのキーワードが文字列である', () => {
      siteMetadata.ja.keywords.forEach((keyword) => {
        expect(typeof keyword).toBe('string')
        expect(keyword.length).toBeGreaterThan(0)
      })
    })
  })

  describe('英語メタデータ', () => {
    it('タイトルが定義されている', () => {
      expect(siteMetadata.en.title).toBe('Dev Roar Lab')
      expect(typeof siteMetadata.en.title).toBe('string')
    })

    it('説明文が定義されている', () => {
      expect(typeof siteMetadata.en.description).toBe('string')
      expect(siteMetadata.en.description.length).toBeGreaterThan(0)
      expect(siteMetadata.en.description).toContain('Dev Roar Lab')
    })

    it('キーワードが配列である', () => {
      expect(Array.isArray(siteMetadata.en.keywords)).toBe(true)
      expect(siteMetadata.en.keywords.length).toBeGreaterThan(0)
    })

    it('主要な技術キーワードが含まれる', () => {
      const expectedKeywords = ['AWS', 'Python', 'TypeScript', 'Next.js']
      expectedKeywords.forEach((keyword) => {
        expect(siteMetadata.en.keywords).toContain(keyword)
      })
    })

    it('全てのキーワードが文字列である', () => {
      siteMetadata.en.keywords.forEach((keyword) => {
        expect(typeof keyword).toBe('string')
        expect(keyword.length).toBeGreaterThan(0)
      })
    })
  })

  describe('一貫性', () => {
    it('jaとenで同じタイトルを使用する', () => {
      expect(siteMetadata.ja.title).toBe(siteMetadata.en.title)
    })

    it('jaとenで同じキーワード数を持つ', () => {
      expect(siteMetadata.ja.keywords.length).toBe(siteMetadata.en.keywords.length)
    })

    it('jaとenで共通の技術キーワードが含まれる', () => {
      const commonKeywords = ['AWS', 'Python', 'TypeScript', 'React', 'Next.js']
      commonKeywords.forEach((keyword) => {
        expect(siteMetadata.ja.keywords).toContain(keyword)
        expect(siteMetadata.en.keywords).toContain(keyword)
      })
    })
  })

  describe('SEO要件', () => {
    it('説明文が50文字以上である', () => {
      expect(siteMetadata.ja.description.length).toBeGreaterThanOrEqual(50)
      expect(siteMetadata.en.description.length).toBeGreaterThanOrEqual(50)
    })

    it('説明文が160文字以下である（推奨）', () => {
      // SEOのベストプラクティスとして、メタディスクリプションは160文字程度が推奨される
      // 日本語は全角を考慮して倍の320文字までを許容
      expect(siteMetadata.ja.description.length).toBeLessThanOrEqual(320)
      expect(siteMetadata.en.description.length).toBeLessThanOrEqual(160)
    })

    it('キーワードが5個以上含まれる', () => {
      expect(siteMetadata.ja.keywords.length).toBeGreaterThanOrEqual(5)
      expect(siteMetadata.en.keywords.length).toBeGreaterThanOrEqual(5)
    })
  })
})
