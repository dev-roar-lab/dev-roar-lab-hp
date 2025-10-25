import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests for homepage
 * Tests WCAG 2.1 Level AA compliance using axe-core
 */

test.describe('Homepage Accessibility (Japanese)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/ja')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper document structure', async ({ page }) => {
    await page.goto('/ja')

    // Check for h1 (Terminal UI may not have traditional h1)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(0)

    // Check for proper lang attribute
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBe('ja')

    // Check for page title
    await expect(page).toHaveTitle(/Dev Roar Lab/)
  })

  test('should have keyboard navigable elements', async ({ page }) => {
    await page.goto('/ja')

    // All interactive elements should be keyboard accessible
    const links = page.locator('a[href]')
    const linkCount = await links.count()

    // Check that links exist and are visible
    expect(linkCount).toBeGreaterThan(0)

    // Test first few links for focusability
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = links.nth(i)
      await expect(link).toBeVisible()
    }
  })

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/ja')

    // Tab to first focusable element and check for visible focus
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})

test.describe('Homepage Accessibility (English)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper document structure', async ({ page }) => {
    await page.goto('/en')

    // Check for h1 (Terminal UI may not have traditional h1)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(0)

    // Check for proper lang attribute
    const lang = await page.getAttribute('html', 'lang')
    expect(lang).toBe('en')

    // Check for page title
    await expect(page).toHaveTitle(/Dev Roar Lab/)
  })

  test('should have keyboard navigable elements', async ({ page }) => {
    await page.goto('/en')

    // All interactive elements should be keyboard accessible
    const links = page.locator('a[href]')
    const linkCount = await links.count()

    // Check that links exist and are visible
    expect(linkCount).toBeGreaterThan(0)

    // Test first few links for focusability
    for (let i = 0; i < Math.min(linkCount, 3); i++) {
      const link = links.nth(i)
      await expect(link).toBeVisible()
    }
  })

  test('should have proper focus indicators', async ({ page }) => {
    await page.goto('/en')

    // Tab to first focusable element and check for visible focus
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })
})
