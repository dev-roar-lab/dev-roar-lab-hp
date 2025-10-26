import { describe, it, expect } from 'vitest'
import { techIconMap, getTechInfo } from '../techIconMap'

describe('techIconMap', () => {
  describe('データ構造', () => {
    it('techIconMapが定義されている', () => {
      expect(techIconMap).toBeDefined()
      expect(typeof techIconMap).toBe('object')
    })

    it('各技術に必須フィールドが含まれる', () => {
      Object.entries(techIconMap).forEach(([techName, techInfo]) => {
        expect(techInfo).toHaveProperty('icon')
        expect(techInfo).toHaveProperty('color')
        expect(typeof techInfo.icon).toBe('function')
        expect(typeof techInfo.color).toBe('string')
        expect(techInfo.color).toMatch(/^#[0-9A-F]{6}$/i)
      }, `Technology: ${techIconMap}`)
    })

    it('主要な技術が含まれる', () => {
      const expectedTechs = [
        'AWS',
        'Python',
        'TypeScript',
        'React',
        'Next.js',
        'Docker',
        'Playwright',
        'Git',
        'Claude Code',
        'CI/CD'
      ]

      expectedTechs.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
      })
    })
  })

  describe('技術カテゴリ', () => {
    it('クラウド & インフラ技術が含まれる', () => {
      const cloudTechs = ['AWS', 'Lambda', 'API Gateway', 'DynamoDB', 'CloudFormation']
      cloudTechs.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
        expect(techIconMap[tech].color).toBe('#FF9900') // AWS orange
      })
    })

    it('プログラミング言語が含まれる', () => {
      const languages = ['Python', 'TypeScript', 'JavaScript', 'C#']
      languages.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
      })
    })

    it('フロントエンド技術が含まれる', () => {
      const frontendTechs = ['React', 'Next.js', 'Tailwind CSS']
      frontendTechs.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
      })
    })

    it('バックエンド & ランタイムが含まれる', () => {
      const backendTechs = ['Node.js', 'GraphQL']
      backendTechs.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
      })
    })

    it('データベース技術が含まれる', () => {
      const databases = ['PostgreSQL', 'MongoDB', 'Redis']
      databases.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
      })
    })

    it('DevOps & ツールが含まれる', () => {
      const devopsTechs = ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Git', 'Cloudflare', 'Playwright']
      devopsTechs.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
      })
    })

    it('AI & 開発ツールが含まれる', () => {
      const aiTools = ['Claude Code', 'Claude', 'Anthropic']
      aiTools.forEach((tech) => {
        expect(techIconMap).toHaveProperty(tech)
        expect(techIconMap[tech].color).toBe('#CC9B7A') // Claude color
      })
    })
  })

  describe('色の一貫性', () => {
    it('AWSサービスは同じ色を使用する', () => {
      const awsServices = ['AWS', 'Lambda', 'API Gateway', 'DynamoDB', 'CloudFormation']
      const awsColor = '#FF9900'
      awsServices.forEach((service) => {
        expect(techIconMap[service].color).toBe(awsColor)
      })
    })

    it('Claude関連サービスは同じ色を使用する', () => {
      const claudeServices = ['Claude Code', 'Claude', 'Anthropic']
      const claudeColor = '#CC9B7A'
      claudeServices.forEach((service) => {
        expect(techIconMap[service].color).toBe(claudeColor)
      })
    })
  })
})

describe('getTechInfo', () => {
  describe('正常系', () => {
    it('存在する技術の情報を取得できる', () => {
      const result = getTechInfo('TypeScript')
      expect(result).not.toBeNull()
      expect(result).toHaveProperty('icon')
      expect(result).toHaveProperty('color')
      expect(result?.color).toBe('#3178C6')
    })

    it('複数の技術情報を取得できる', () => {
      const techs = ['React', 'Next.js', 'Python']
      techs.forEach((tech) => {
        const result = getTechInfo(tech)
        expect(result).not.toBeNull()
      })
    })

    it('大文字小文字を区別する', () => {
      const typescript = getTechInfo('TypeScript')
      const lowercase = getTechInfo('typescript')

      expect(typescript).not.toBeNull()
      expect(lowercase).toBeNull()
    })
  })

  describe('エッジケース', () => {
    it('存在しない技術に対してnullを返す', () => {
      const result = getTechInfo('NonExistentTech')
      expect(result).toBeNull()
    })

    it('空文字列に対してnullを返す', () => {
      const result = getTechInfo('')
      expect(result).toBeNull()
    })

    it('特殊文字を含む技術名を処理できる', () => {
      const result = getTechInfo('Next.js')
      expect(result).not.toBeNull()
    })

    it('スペースを含む技術名を処理できる', () => {
      const result = getTechInfo('API Gateway')
      expect(result).not.toBeNull()
    })
  })

  describe('返り値の型', () => {
    it('存在する技術に対して正しい型を返す', () => {
      const result = getTechInfo('Docker')
      expect(result).toMatchObject({
        icon: expect.any(Function),
        color: expect.stringMatching(/^#[0-9A-F]{6}$/i)
      })
    })
  })
})
