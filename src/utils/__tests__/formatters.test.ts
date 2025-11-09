import { describe, it, expect } from 'vitest'
import {
  getImageUrl,
  formatDate,
  formatRating,
  formatRuntime,
  truncateText,
  formatNumber,
  formatCurrency,
} from '../formatters'

describe('formatters', () => {
  describe('formatRating', () => {
    it('should format rating correctly', () => {
      expect(formatRating(8.5)).toBe('8.5')
      expect(formatRating(7.234)).toBe('7.2')
      expect(formatRating(10)).toBe('10.0')
      expect(formatRating(0)).toBe('0.0')
    })
  })

  describe('formatRuntime', () => {
    it('should format runtime correctly', () => {
      expect(formatRuntime(120)).toBe('2h 0m')
      expect(formatRuntime(150)).toBe('2h 30m')
      expect(formatRuntime(90)).toBe('1h 30m')
      expect(formatRuntime(45)).toBe('0h 45m')
    })
  })

  describe('truncateText', () => {
    it('should truncate text correctly', () => {
      const text = 'This is a long text that needs to be truncated'
      expect(truncateText(text, 20)).toBe('This is a long text ...')
      expect(truncateText('Short', 10)).toBe('Short')
      expect(truncateText('Exact', 5)).toBe('Exact')
    })
  })

  describe('getImageUrl', () => {
    it('should return correct image URL for poster', () => {
      const path = '/abc123.jpg'
      const url = getImageUrl(path, 'poster', 'medium')
      expect(url).toContain('image.tmdb.org')
      expect(url).toContain('w342')
      expect(url).toContain(path)
    })

    it('should return correct image URL for backdrop', () => {
      const path = '/xyz789.jpg'
      const url = getImageUrl(path, 'backdrop', 'large')
      expect(url).toContain('image.tmdb.org')
      expect(url).toContain('w1280')
      expect(url).toContain(path)
    })

    it('should return placeholder when path is null', () => {
      const url = getImageUrl(null, 'poster', 'medium')
      expect(url).toContain('placeholder')
      expect(url).toContain('342x513')
    })

    it('should return placeholder for backdrop when path is null', () => {
      const url = getImageUrl(null, 'backdrop', 'medium')
      expect(url).toContain('placeholder')
      expect(url).toContain('1280x720')
    })

    it('should handle original size', () => {
      const path = '/original.jpg'
      const url = getImageUrl(path, 'poster', 'original')
      expect(url).toContain('original')
      expect(url).toContain(path)
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toContain('2024')
      expect(result).toContain('enero')
    })

    it('should handle invalid dates', () => {
      const invalidDate = 'invalid-date'
      const result = formatDate(invalidDate)
      expect(result).toBe(invalidDate)
    })
  })

  describe('formatNumber', () => {
    it('should format large numbers correctly', () => {
      expect(formatNumber(1_500_000)).toBe('1.5M')
      expect(formatNumber(2_300_000)).toBe('2.3M')
      expect(formatNumber(5_500)).toBe('5.5K')
      expect(formatNumber(500)).toBe('500')
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1_000_000)).toBe('$1,000,000')
      expect(formatCurrency(500)).toBe('$500')
      expect(formatCurrency(0)).toBe('N/A')
    })

    it('should handle zero and undefined', () => {
      expect(formatCurrency(0)).toBe('N/A')
    })
  })
})
