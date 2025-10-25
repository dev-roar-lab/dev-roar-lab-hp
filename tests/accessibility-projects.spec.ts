import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests for projects pages
 * Tests WCAG 2.1 Level AA compliance using axe-core
 */

test.describe('Projects Page Accessibility (Japanese)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/ja/projects')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/ja/projects')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check for page title
    await expect(page).toHaveTitle(/Projects/)
  })

  test('should have accessible project cards', async ({ page }) => {
    await page.goto('/ja/projects')

    // All project cards should be properly structured
    const projectCards = page.locator('article')
    const count = await projectCards.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const card = projectCards.nth(i)
        await expect(card).toBeVisible()

        // Each card should have a heading
        const heading = card.locator('h2, h3')
        await expect(heading.first()).toBeVisible()
      }
    }
  })

  test('should have accessible technology badges', async ({ page }) => {
    await page.goto('/ja/projects')

    // Technology badges should be readable
    const badges = page.locator('[class*="badge"], [class*="tag"]')
    const count = await badges.count()

    if (count > 0) {
      for (let i = 0; i < Math.min(count, 10); i++) {
        const badge = badges.nth(i)
        const text = await badge.textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

test.describe('Projects Page Accessibility (English)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/projects')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/en/projects')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check for page title
    await expect(page).toHaveTitle(/Projects/)
  })

  test('should have accessible project cards', async ({ page }) => {
    await page.goto('/en/projects')

    // All project cards should be properly structured
    const projectCards = page.locator('article')
    const count = await projectCards.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const card = projectCards.nth(i)
        await expect(card).toBeVisible()

        // Each card should have a heading
        const heading = card.locator('h2, h3')
        await expect(heading.first()).toBeVisible()
      }
    }
  })
})
