import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { formatDate } from '../formatDate'

describe('formatDate', () => {
  // タイムゾーンの影響を受けないようにシステム時刻を固定
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('基本動作', () => {
    it('日付を英語フォーマットで返す（相対表記なし）', () => {
      // Arrange
      const date = '2025-01-01'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('January 1, 2025')
    })

    it('日付を英語フォーマットで返す（相対表記あり）', () => {
      // Arrange
      const date = '2025-01-01'

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('January 1, 2025')
      expect(result).toContain('(')
      expect(result).toContain(')')
    })

    it('ISO 8601形式（T付き）の日付を処理できる', () => {
      // Arrange
      const date = '2025-01-01T00:00:00'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('January 1, 2025')
    })

    it('T区切りなしの日付にT00:00:00を自動追加する', () => {
      // Arrange
      const date = '2025-01-10'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('January 10, 2025')
    })
  })

  describe('相対表記（includeRelative = true）', () => {
    it('今日の日付は "Today" と表示される', () => {
      // Arrange
      const date = '2025-01-15' // システム時刻と同じ

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('(Today)')
    })

    it('1日前の日付は "1d ago" と表示される', () => {
      // Arrange
      const date = '2025-01-14' // 1日前

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('(1d ago)')
    })

    it('複数日前の日付は "Nd ago" と表示される', () => {
      // Arrange
      const date = '2025-01-10' // 5日前

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('(5d ago)')
    })

    it('前年の12月は "1y ago" と表示される（年の差分優先）', () => {
      // Arrange
      const date = '2024-12-15' // 1ヶ月前だが年が違う

      // Act
      const result = formatDate(date, true)

      // Assert
      // 注: formatDate関数は年の差分を優先するため、月の差分ではなく年で判定される
      expect(result).toContain('(1y ago)')
    })

    it('前年の10月は "1y ago" と表示される（年の差分優先）', () => {
      // Arrange
      const date = '2024-10-15' // 3ヶ月前だが年が違う

      // Act
      const result = formatDate(date, true)

      // Assert
      // 注: formatDate関数は年の差分を優先するため、月の差分ではなく年で判定される
      expect(result).toContain('(1y ago)')
    })

    it('同年内で1ヶ月前の日付は "1mo ago" と表示される', () => {
      // Arrange
      // システム時刻は2025-01-15なので、2024-12ではなく同年内の日付を使う
      vi.setSystemTime(new Date('2025-02-20T12:00:00Z'))
      const date = '2025-01-20' // 1ヶ月前（同年内）

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('(1mo ago)')

      // テスト後はシステム時刻を元に戻す
      vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
    })

    it('1年前の日付は "1y ago" と表示される', () => {
      // Arrange
      const date = '2024-01-15' // 1年前

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('(1y ago)')
    })

    it('複数年前の日付は "Ny ago" と表示される', () => {
      // Arrange
      const date = '2022-01-15' // 3年前

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toContain('(3y ago)')
    })
  })

  describe('エッジケース', () => {
    it('月末の日付を正しく処理できる', () => {
      // Arrange
      const date = '2025-01-31'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('January 31, 2025')
    })

    it('うるう年の2月29日を正しく処理できる', () => {
      // Arrange
      const date = '2024-02-29'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('February 29, 2024')
    })

    it('年初の日付を正しく処理できる', () => {
      // Arrange
      const date = '2025-01-01'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('January 1, 2025')
    })

    it('年末の日付を正しく処理できる', () => {
      // Arrange
      const date = '2024-12-31'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('December 31, 2024')
    })
  })

  describe('様々な月', () => {
    it('1月の日付をフォーマットできる', () => {
      expect(formatDate('2025-01-15', false)).toBe('January 15, 2025')
    })

    it('2月の日付をフォーマットできる', () => {
      expect(formatDate('2025-02-20', false)).toBe('February 20, 2025')
    })

    it('3月の日付をフォーマットできる', () => {
      expect(formatDate('2025-03-10', false)).toBe('March 10, 2025')
    })

    it('6月の日付をフォーマットできる', () => {
      expect(formatDate('2025-06-15', false)).toBe('June 15, 2025')
    })

    it('12月の日付をフォーマットできる', () => {
      expect(formatDate('2025-12-25', false)).toBe('December 25, 2025')
    })
  })

  describe('デフォルト引数', () => {
    it('第2引数を省略した場合はincludeRelative = falseとして動作する', () => {
      // Arrange
      const date = '2025-01-01'

      // Act
      const result = formatDate(date)

      // Assert
      expect(result).toBe('January 1, 2025')
      expect(result).not.toContain('(')
    })
  })

  describe('返り値の形式', () => {
    it('相対表記なしの場合、正確なフォーマットで返る', () => {
      // Arrange
      const date = '2025-06-15'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toMatch(/^[A-Z][a-z]+ \d+, \d{4}$/)
    })

    it('相対表記ありの場合、"完全日付 (相対表記)" の形式で返る', () => {
      // Arrange
      const date = '2025-01-10'

      // Act
      const result = formatDate(date, true)

      // Assert
      expect(result).toMatch(/^[A-Z][a-z]+ \d+, \d{4} \(.+\)$/)
    })
  })

  describe('過去の日付', () => {
    it('数年前の日付も正しくフォーマットできる', () => {
      // Arrange
      const date = '2020-05-20'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('May 20, 2020')
    })

    it('数十年前の日付も正しくフォーマットできる', () => {
      // Arrange
      const date = '1990-12-01'

      // Act
      const result = formatDate(date, false)

      // Assert
      expect(result).toBe('December 1, 1990')
    })
  })
})
