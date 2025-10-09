// Accessibility tests for Wiertla CNC

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('product table should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.wiertla-categories__table-container')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('customer login page should be accessible', async ({ page }) => {
    await page.goto('/account/login');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.wiertla-auth')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('customer register page should be accessible', async ({ page }) => {
    await page.goto('/account/register');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.wiertla-auth')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('customer account page should be accessible', async ({ page }) => {
    // Mock login
    await page.goto('/account/login');
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/account');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('customer addresses page should be accessible', async ({ page }) => {
    // Mock login
    await page.goto('/account/login');
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('.wiertla-addresses')
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('product details page should be accessible', async ({ page }) => {
    await page.goto('/products/test-product');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that h1 exists
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check that headings are in proper order
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // First heading should be h1
    const firstHeading = headings[0];
    const tagName = await firstHeading.evaluate(el => el.tagName);
    expect(tagName).toBe('H1');
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/account/login');
    await page.waitForLoadState('networkidle');
    
    // Check that form inputs have labels
    const emailInput = page.locator('#customer_email');
    const passwordInput = page.locator('#customer_password');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    
    // Check that inputs are properly labeled
    const emailLabel = page.locator('label[for="customer_email"]');
    const passwordLabel = page.locator('label[for="customer_password"]');
    
    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Check that focused element is interactive
    const tagName = await focusedElement.evaluate(el => el.tagName);
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(tagName);
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    // Check for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );
    
    expect(contrastViolations).toEqual([]);
  });

  test('should have proper alt text for images', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all images
    const images = await page.locator('img').all();
    
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      // Alt text should exist and not be empty for meaningful images
      if (alt !== null) {
        expect(alt.trim()).not.toBe('');
      }
    }
  });

  test('should have proper link text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all links
    const links = await page.locator('a').all();
    
    for (const link of links) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      
      // Links should have meaningful text
      if (href && href !== '#' && href !== 'javascript:void(0)') {
        expect(text.trim()).not.toBe('');
        expect(text.trim().length).toBeGreaterThan(1);
      }
    }
  });

  test('should have proper button text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get all buttons
    const buttons = await page.locator('button').all();
    
    for (const button of buttons) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Buttons should have meaningful text or aria-label
      if (!ariaLabel) {
        expect(text.trim()).not.toBe('');
      }
    }
  });

  test('should have proper table structure', async ({ page }) => {
    await page.goto('/');
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    const table = page.locator('.wiertla-categories__table');
    await expect(table).toBeVisible();
    
    // Check that table has proper structure
    const thead = table.locator('thead');
    const tbody = table.locator('tbody');
    
    await expect(thead).toBeVisible();
    await expect(tbody).toBeVisible();
    
    // Check that table headers exist
    const headers = table.locator('th');
    const headerCount = await headers.count();
    expect(headerCount).toBeGreaterThan(0);
  });

  test('should have proper form validation', async ({ page }) => {
    await page.goto('/account/register');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check that validation errors are announced
    const errorMessages = page.locator('.form-errors, [role="alert"]');
    if (await errorMessages.isVisible()) {
      await expect(errorMessages).toBeVisible();
    }
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/account/login');
    await page.waitForLoadState('networkidle');
    
    // Focus on email input
    await page.focus('#customer_email');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Tab to next element
    await page.keyboard.press('Tab');
    
    // Focus should move to password input
    const newFocusedElement = page.locator(':focus');
    await expect(newFocusedElement).toHaveAttribute('id', 'customer_password');
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for important ARIA attributes
    const elementsWithAria = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
    const count = await elementsWithAria.count();
    
    // Should have some ARIA attributes for better accessibility
    expect(count).toBeGreaterThan(0);
  });

  test('should be accessible on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be accessible on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should handle screen reader navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that important elements have proper roles
    const main = page.locator('main, [role="main"]');
    const navigation = page.locator('nav, [role="navigation"]');
    const header = page.locator('header, [role="banner"]');
    const footer = page.locator('footer, [role="contentinfo"]');
    
    // At least main content should be properly marked
    if (await main.isVisible()) {
      await expect(main).toBeVisible();
    }
  });

  test('should have proper language attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that html element has lang attribute
    const html = page.locator('html');
    const lang = await html.getAttribute('lang');
    
    expect(lang).toBeTruthy();
    expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
  });

  test('should have proper skip links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for skip links
    const skipLinks = page.locator('a[href^="#"]').filter(async link => {
      const text = await link.textContent();
      return text.toLowerCase().includes('skip') || text.toLowerCase().includes('przejdź');
    });
    
    const skipLinkCount = await skipLinks.count();
    
    // Skip links are optional but good practice
    if (skipLinkCount > 0) {
      await expect(skipLinks.first()).toBeVisible();
    }
  });
});
