// Visual regression tests for Wiertla CNC

import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set consistent viewport for all visual tests
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('homepage should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of the entire page
    await expect(page).toHaveScreenshot('homepage.png');
  });

  test('product categories table should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on wiertła tab to show the table
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    // Take screenshot of the product table
    await expect(page.locator('.wiertla-categories__table-container')).toHaveScreenshot('product-table-wiertla.png');
  });

  test('product categories table with filters should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on płytki tab
    await page.click('[data-tab-type="plytki"]');
    await page.waitForTimeout(1000);
    
    // Apply manufacturer filter
    await page.selectOption('[data-filter="manufacturer"]', 'Sandvik');
    await page.waitForTimeout(500);
    
    // Take screenshot of filtered table
    await expect(page.locator('.wiertla-categories__table-container')).toHaveScreenshot('product-table-plytki-filtered.png');
  });

  test('customer login page should look correct', async ({ page }) => {
    await page.goto('/account/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of login page
    await expect(page.locator('.wiertla-auth')).toHaveScreenshot('customer-login.png');
  });

  test('customer register page should look correct', async ({ page }) => {
    await page.goto('/account/register');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of register page
    await expect(page.locator('.wiertla-auth')).toHaveScreenshot('customer-register.png');
  });

  test('customer account page should look correct', async ({ page }) => {
    // Mock login by setting cookies or localStorage
    await page.goto('/account/login');
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to account page
    await expect(page).toHaveURL('/account');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of account page
    await expect(page).toHaveScreenshot('customer-account.png');
  });

  test('customer addresses page should look correct', async ({ page }) => {
    // Mock login
    await page.goto('/account/login');
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to addresses page
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of addresses page
    await expect(page.locator('.wiertla-addresses')).toHaveScreenshot('customer-addresses.png');
  });

  test('customer order details page should look correct', async ({ page }) => {
    // Mock login
    await page.goto('/account/login');
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to order details page
    await page.goto('/account/orders/1001');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of order details page
    await expect(page).toHaveScreenshot('customer-order-details.png');
  });

  test('product details page should look correct', async ({ page }) => {
    await page.goto('/products/test-product');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of product details page
    await expect(page).toHaveScreenshot('product-details.png');
  });

  test('product details page with related tools should look correct', async ({ page }) => {
    await page.goto('/products/product-with-related');
    await page.waitForLoadState('networkidle');
    
    // Wait for related tools to load
    try {
      await page.waitForSelector('.swiper-slide', { timeout: 10000 });
    } catch (error) {
      // If no related tools, continue with test
    }
    
    // Take screenshot of product details with related tools
    await expect(page).toHaveScreenshot('product-details-with-related.png');
  });

  test('header navigation should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of header
    await expect(page.locator('header')).toHaveScreenshot('header-navigation.png');
  });

  test('footer should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Take screenshot of footer
    await expect(page.locator('footer')).toHaveScreenshot('footer.png');
  });

  test('mobile viewport should look correct', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of mobile homepage
    await expect(page).toHaveScreenshot('homepage-mobile.png');
  });

  test('mobile product table should look correct', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on koronki tab
    await page.click('[data-tab-type="koronki"]');
    await page.waitForTimeout(1000);
    
    // Take screenshot of mobile product table
    await expect(page.locator('.wiertla-categories__table-container')).toHaveScreenshot('product-table-mobile.png');
  });

  test('mobile customer login should look correct', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/account/login');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of mobile login page
    await expect(page.locator('.wiertla-auth')).toHaveScreenshot('customer-login-mobile.png');
  });

  test('tablet viewport should look correct', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of tablet homepage
    await expect(page).toHaveScreenshot('homepage-tablet.png');
  });

  test('error states should look correct', async ({ page }) => {
    // Navigate to non-existent page to trigger 404
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of 404 page
    await expect(page).toHaveScreenshot('404-error.png');
  });

  test('loading states should look correct', async ({ page }) => {
    await page.goto('/products/product-with-slow-loading');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot while related tools are loading
    await expect(page.locator('.related-skeleton')).toHaveScreenshot('loading-skeleton.png');
  });

  test('filter interface should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on wiertła tab to show filters
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    // Take screenshot of filter interface
    await expect(page.locator('.wiertla-categories__filters')).toHaveScreenshot('filter-interface.png');
  });

  test('pagination should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    // Set per page to 25 to trigger pagination
    await page.selectOption('[data-filter="perPage"]', '25');
    await page.waitForTimeout(500);
    
    // Take screenshot of pagination
    await expect(page.locator('.wiertla-categories__pagination')).toHaveScreenshot('pagination.png');
  });

  test('search results should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    // Perform search
    await page.fill('[data-filter="search"]', 'VW');
    await page.waitForTimeout(500);
    
    // Take screenshot of search results
    await expect(page.locator('.wiertla-categories__table-container')).toHaveScreenshot('search-results.png');
  });

  test('empty search results should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Click on wiertła tab
    await page.click('[data-tab-type="wiertla"]');
    await page.waitForTimeout(1000);
    
    // Perform search that returns no results
    await page.fill('[data-filter="search"]', 'NONEXISTENTPRODUCT123');
    await page.waitForTimeout(500);
    
    // Take screenshot of empty results
    await expect(page.locator('.wiertla-categories__table-container')).toHaveScreenshot('empty-search-results.png');
  });

  test('language switcher should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of language switcher
    const languageSwitcher = page.locator('.language-switcher');
    if (await languageSwitcher.isVisible()) {
      await expect(languageSwitcher).toHaveScreenshot('language-switcher.png');
    }
  });

  test('brand logos should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of brand logos section
    const brandLogos = page.locator('.wiertla-logos');
    if (await brandLogos.isVisible()) {
      await expect(brandLogos).toHaveScreenshot('brand-logos.png');
    }
  });

  test('latest products section should look correct', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of latest products section
    const latestProducts = page.locator('.latest-products');
    if (await latestProducts.isVisible()) {
      await expect(latestProducts).toHaveScreenshot('latest-products.png');
    }
  });
});

