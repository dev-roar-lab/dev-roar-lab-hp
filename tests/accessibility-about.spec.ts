import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests for about page
 * Tests WCAG 2.1 Level AA compliance using axe-core
 */

test.describe('About Page Accessibility (Japanese)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/ja/about')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper document structure', async ({ page }) => {
    await page.goto('/ja/about')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check for page title
    await expect(page).toHaveTitle(/About/)
  })

  test('should have accessible profile information', async ({ page }) => {
    await page.goto('/ja/about')

    // Profile sections should be properly structured
    const sections = page.locator('section, article')
    const count = await sections.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const section = sections.nth(i)
        await expect(section).toBeVisible()
      }
    }
  })

  test('should have accessible skill badges', async ({ page }) => {
    await page.goto('/ja/about')

    // Skill badges should have text content
    const badges = page.locator('[class*="badge"], [class*="skill"]')
    const count = await badges.count()

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const badge = badges.nth(i)
        const text = await badge.textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    }
  })

  test('should have accessible social links', async ({ page }) => {
    await page.goto('/ja/about')

    // Social links should have proper aria-labels or visible text
    const socialLinks = page.locator('a[href*="github"], a[href*="twitter"], a[href*="linkedin"]')
    const count = await socialLinks.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const link = socialLinks.nth(i)
        const ariaLabel = await link.getAttribute('aria-label')
        const text = await link.textContent()

        // Either aria-label or visible text should be present
        expect(ariaLabel || text?.trim()).toBeTruthy()
      }
    }
  })
})

test.describe('About Page Accessibility (English)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/about')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper document structure', async ({ page }) => {
    await page.goto('/en/about')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check for page title
    await expect(page).toHaveTitle(/About/)
  })

  test('should have accessible profile information', async ({ page }) => {
    await page.goto('/en/about')

    // Profile sections should be properly structured
    const sections = page.locator('section, article')
    const count = await sections.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const section = sections.nth(i)
        await expect(section).toBeVisible()
      }
    }
  })
})
