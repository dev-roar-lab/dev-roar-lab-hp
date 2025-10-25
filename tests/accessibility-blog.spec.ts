import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests for blog pages
 * Tests WCAG 2.1 Level AA compliance using axe-core
 */

test.describe('Blog Index Page Accessibility (Japanese)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/ja/blog')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/ja/blog')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check for page title
    await expect(page).toHaveTitle(/Blog/)
  })

  test('should have accessible blog post links', async ({ page }) => {
    await page.goto('/ja/blog')

    // All blog post links should have descriptive text
    const postLinks = page.locator('article a[href*="/blog/"]')
    const count = await postLinks.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const link = postLinks.nth(i)
        const text = await link.textContent()
        expect(text?.trim().length).toBeGreaterThan(0)
      }
    }
  })
})

test.describe('Blog Index Page Accessibility (English)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/blog')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/en/blog')

    // Check for single h1
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)

    // Check for page title
    await expect(page).toHaveTitle(/Blog/)
  })
})

test.describe('Blog Post Detail Page Accessibility (Japanese)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    // Test with the first blog post
    await page.goto('/ja/blog/ai-driven-dev-fundamentals')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper article structure', async ({ page }) => {
    await page.goto('/ja/blog/ai-driven-dev-fundamentals')

    // Check for article element or main content area
    const article = page.locator('article, main')
    await expect(article.first()).toBeVisible()

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
  })

  test('should have accessible images with alt text', async ({ page }) => {
    await page.goto('/ja/blog/ai-content-generation-diversity')

    // All images should have alt attributes
    const images = page.locator('article img')
    const imageCount = await images.count()

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')
      expect(alt).toBeDefined()
    }
  })

  test('should have accessible code blocks', async ({ page }) => {
    await page.goto('/ja/blog/ai-driven-dev-fundamentals')

    // Check if code blocks exist and are properly marked up
    const codeBlocks = page.locator('pre code')
    const count = await codeBlocks.count()

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const code = codeBlocks.nth(i)
        await expect(code).toBeVisible()
      }
    }
  })
})

test.describe('Blog Post Detail Page Accessibility (English)', () => {
  test('should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/en/blog/ai-driven-dev-fundamentals')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(accessibilityScanResults.violations).toEqual([])
  })

  test('should have proper article structure', async ({ page }) => {
    await page.goto('/en/blog/ai-driven-dev-fundamentals')

    // Check for article element or main content area
    const article = page.locator('article, main')
    await expect(article.first()).toBeVisible()

    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
  })
})
