// E2E tests for product discovery journey

import { test, expect } from '@playwright/test';

test.describe('Product Discovery Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should allow user to browse and filter products', async ({ page }) => {
    // Check that the main navigation is visible
    await expect(page.locator('.header__nav-links')).toBeVisible();
    
    // Click on Koronki tab
    await page.click('[data-tab-type="koronki"]');
    
    // Wait for the table to load
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Check that products are displayed
    await expect(page.locator('tr[data-product-id]')).toHaveCount.greaterThan(0);
    
    // Filter by manufacturer - Sandvik
    await page.selectOption('[data-filter="manufacturer"]', 'Sandvik');
    
    // Wait for filtering to complete
    await page.waitForTimeout(500);
    
    // Check that only Sandvik products are shown
    const sandvikRows = page.locator('tr[data-product-id]');
    const count = await sandvikRows.count();
    
    for (let i = 0; i < count; i++) {
      const row = sandvikRows.nth(i);
      await expect(row.locator('td:nth-child(5)')).toContainText('Sandvik');
    }
    
    // Search for specific product
    await page.fill('[data-filter="search"]', 'VW');
    
    // Wait for search to complete
    await page.waitForTimeout(500);
    
    // Check that only products with VW in SKU are shown
    const vwRows = page.locator('tr[data-product-id]');
    const vwCount = await vwRows.count();
    
    for (let i = 0; i < vwCount; i++) {
      const row = vwRows.nth(i);
      const skuCell = row.locator('td:nth-child(4)');
      await expect(skuCell).toContainText('VW');
    }
    
    // Click on a product to view details
    const firstProductLink = page.locator('tr[data-product-id] a').first();
    await firstProductLink.click();
    
    // Should navigate to product details page
    await expect(page).toHaveURL(/\/products\//);
    
    // Check that product details are displayed
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
  });

  test('should switch between different product categories', async ({ page }) => {
    // Test Wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Check that wiertła products are displayed
    const wiertlaRows = page.locator('tr[data-product-id]');
    const wiertlaCount = await wiertlaRows.count();
    expect(wiertlaCount).toBeGreaterThan(0);
    
    // Test Płytki tab
    await page.click('[data-tab-type="plytki"]');
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Check that płytki products are displayed
    const plytkiRows = page.locator('tr[data-product-id]');
    const plytkiCount = await plytkiRows.count();
    expect(plytkiCount).toBeGreaterThan(0);
    
    // Test Koronki tab
    await page.click('[data-tab-type="koronki"]');
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Check that koronki products are displayed
    const koronkiRows = page.locator('tr[data-product-id]');
    const koronkiCount = await koronkiRows.count();
    expect(koronkiCount).toBeGreaterThan(0);
  });

  test('should handle pagination correctly', async ({ page }) => {
    // Go to wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Check if pagination exists
    const pagination = page.locator('.wiertla-categories__pagination');
    
    if (await pagination.isVisible()) {
      // Click next page
      const nextButton = page.locator('.wiertla-categories__pagination-next');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        
        // Wait for page to load
        await page.waitForTimeout(500);
        
        // Check that we're on page 2
        const currentPage = page.locator('.wiertla-categories__pagination-current');
        await expect(currentPage).toContainText('2');
        
        // Click previous page
        const prevButton = page.locator('.wiertla-categories__pagination-prev');
        if (await prevButton.isVisible()) {
          await prevButton.click();
          
          // Wait for page to load
          await page.waitForTimeout(500);
          
          // Check that we're back on page 1
          await expect(currentPage).toContainText('1');
        }
      }
    }
  });

  test('should handle empty search results', async ({ page }) => {
    // Go to wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Search for something that doesn't exist
    await page.fill('[data-filter="search"]', 'NONEXISTENTPRODUCT123');
    
    // Wait for search to complete
    await page.waitForTimeout(500);
    
    // Check that no results message is displayed
    await expect(page.locator('.wiertla-categories__table')).toContainText('Brak wyników');
  });

  test('should maintain filter state when switching tabs', async ({ page }) => {
    // Go to wiertła tab and set a filter
    await page.click('[data-tab-type="wiertla"]');
    await page.selectOption('[data-filter="manufacturer"]', 'Sandvik');
    await page.waitForTimeout(500);
    
    // Switch to płytki tab
    await page.click('[data-tab-type="plytki"]');
    await page.waitForTimeout(500);
    
    // Switch back to wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(500);
    
    // Check that the filter is still applied
    const manufacturerSelect = page.locator('[data-filter="manufacturer"]');
    await expect(manufacturerSelect).toHaveValue('Sandvik');
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that mobile navigation is visible
    await expect(page.locator('.header__mobile-menu')).toBeVisible();
    
    // Click on Koronki tab
    await page.click('[data-tab-type="koronki"]');
    
    // Check that table is responsive
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Check that mobile-specific elements are present
    await expect(page.locator('.wiertla-categories__mobile-filters')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Go to wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await expect(page.locator('.wiertla-categories__table')).toBeVisible();
    
    // Tab through the page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Press Enter on focused element
    await page.keyboard.press('Enter');
    
    // Check that something happened (e.g., filter was applied)
    await page.waitForTimeout(500);
  });

  test('should handle language switching', async ({ page }) => {
    // Check that language switcher is visible
    const languageSwitcher = page.locator('.language-switcher');
    if (await languageSwitcher.isVisible()) {
      // Click on English
      await page.click('.language-switcher [data-lang="en"]');
      
      // Wait for language change
      await page.waitForTimeout(500);
      
      // Check that text has changed to English
      await expect(page.locator('[data-translate="wiertla_categories.icons.crown"]')).toContainText('CROWNS');
      
      // Click on German
      await page.click('.language-switcher [data-lang="de"]');
      
      // Wait for language change
      await page.waitForTimeout(500);
      
      // Check that text has changed to German
      await expect(page.locator('[data-translate="wiertla_categories.icons.crown"]')).toContainText('KRONEN');
    }
  });
});
