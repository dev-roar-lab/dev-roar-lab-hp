import { describe, it, expect } from 'vitest'
import { SKILLS, formatSkillsForTerminal } from '../skills'

describe('SKILLS', () => {
  describe('データ構造', () => {
    it('SKILLSが定義されている', () => {
      expect(SKILLS).toBeDefined()
      expect(Array.isArray(SKILLS)).toBe(true)
    })

    it('SKILLSが空でない', () => {
      expect(SKILLS.length).toBeGreaterThan(0)
    })

    it('全ての要素が文字列である', () => {
      SKILLS.forEach((skill) => {
        expect(typeof skill).toBe('string')
        expect(skill.length).toBeGreaterThan(0)
      })
    })

    it('重複がない', () => {
      const uniqueSkills = new Set(SKILLS)
      expect(uniqueSkills.size).toBe(SKILLS.length)
    })
  })

  describe('コンテンツ', () => {
    it('主要なスキルが含まれる', () => {
      const expectedSkills = ['TypeScript', 'Next.js', 'Playwright', 'Python', 'AWS', 'Docker', 'Git']

      expectedSkills.forEach((skill) => {
        expect(SKILLS).toContain(skill)
      })
    })

    it('TypeScriptが最初のスキルである', () => {
      expect(SKILLS[0]).toBe('TypeScript')
    })
  })
})

describe('formatSkillsForTerminal', () => {
  describe('正常系', () => {
    it('デフォルトで3列のフォーマットを返す', () => {
      const result = formatSkillsForTerminal()

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)

      // 各行が3つのスキルを含む（最後の行以外）
      result.forEach((row, index) => {
        expect(typeof row).toBe('string')
        const skills = row.split(' | ')
        if (index < result.length - 1 || SKILLS.length % 3 === 0) {
          expect(skills.length).toBeLessThanOrEqual(3)
        }
      })
    })

    it('各行がパイプ区切りで整形される', () => {
      const result = formatSkillsForTerminal()

      result.forEach((row) => {
        expect(row).toContain(' | ')
      })
    })

    it('2列のフォーマットを指定できる', () => {
      const result = formatSkillsForTerminal(2)

      expect(Array.isArray(result)).toBe(true)
      result.forEach((row) => {
        const skills = row.split(' | ')
        expect(skills.length).toBeLessThanOrEqual(2)
      })
    })

    it('1列のフォーマットを指定できる', () => {
      const result = formatSkillsForTerminal(1)

      expect(result.length).toBe(SKILLS.length)
      result.forEach((row, index) => {
        expect(row).toBe(SKILLS[index])
      })
    })

    it('4列のフォーマットを指定できる', () => {
      const result = formatSkillsForTerminal(4)

      expect(Array.isArray(result)).toBe(true)
      result.forEach((row) => {
        const skills = row.split(' | ')
        expect(skills.length).toBeLessThanOrEqual(4)
      })
    })
  })

  describe('整列', () => {
    it('各列が適切にパディングされる', () => {
      const result = formatSkillsForTerminal(3)

      result.forEach((row) => {
        // パディングによりスペースが含まれる
        expect(row).toMatch(/\s{2,}/)
      })
    })

    it('全ての行が同じ列数のフォーマットを持つ（最後の行以外）', () => {
      const result = formatSkillsForTerminal(3)

      // 最後の行以外は3列
      for (let i = 0; i < result.length - 1; i++) {
        const skills = result[i].split(' | ')
        expect(skills.length).toBe(3)
      }
    })

    it('最後の行が残りのスキルを含む', () => {
      const columns = 3
      const result = formatSkillsForTerminal(columns)
      const lastRow = result[result.length - 1]
      const lastRowSkills = lastRow.split(' | ')

      const expectedLastRowCount = SKILLS.length % columns || columns
      expect(lastRowSkills.length).toBe(expectedLastRowCount)
    })
  })

  describe('エッジケース', () => {
    it('列数がスキル数より多い場合', () => {
      const result = formatSkillsForTerminal(SKILLS.length + 5)

      expect(result.length).toBe(1)
      expect(result[0]).toContain(' | ')
    })

    it('列数が1の場合、各スキルが1行になる', () => {
      const result = formatSkillsForTerminal(1)

      expect(result.length).toBe(SKILLS.length)
      result.forEach((row, index) => {
        expect(row).toBe(SKILLS[index])
      })
    })

    it('列数がスキル数と等しい場合', () => {
      const result = formatSkillsForTerminal(SKILLS.length)

      expect(result.length).toBe(1)
    })
  })

  describe('出力の正確性', () => {
    it('全てのスキルが出力に含まれる', () => {
      const result = formatSkillsForTerminal()
      const allOutput = result.join(' ')

      SKILLS.forEach((skill) => {
        expect(allOutput).toContain(skill)
      })
    })

    it('スキルの順序が保持される', () => {
      const result = formatSkillsForTerminal(3)
      const extractedSkills: string[] = []

      result.forEach((row) => {
        const skills = row.split(' | ').map((s) => s.trim())
        extractedSkills.push(...skills)
      })

      SKILLS.forEach((skill, index) => {
        expect(extractedSkills[index]).toBe(skill)
      })
    })
  })

  describe('返り値の型', () => {
    it('文字列配列を返す', () => {
      const result = formatSkillsForTerminal()

      expect(Array.isArray(result)).toBe(true)
      result.forEach((row) => {
        expect(typeof row).toBe('string')
      })
    })

    it('空配列を返さない', () => {
      const result = formatSkillsForTerminal()

      expect(result.length).toBeGreaterThan(0)
    })
  })
})
