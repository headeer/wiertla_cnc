/**
 * E2E tests for critical user workflows
 * Tests complete user journeys from search to purchase
 */

const { test, expect } = require('@playwright/test');

// Mock data for testing
const mockProducts = [
  {
    id: 'VW.123',
    title: 'VHM Drill Bit 123',
    vendor: 'Sandvik',
    price: 15000,
    available: true,
    sku: 'VW.123',
    custom_symbol: 'VW.123',
    custom_kod_producenta: 'VW123'
  },
  {
    id: 'PD.456',
    title: 'Plywood Drill 456',
    vendor: 'AMEC',
    price: 8500,
    available: true,
    sku: 'PD.456',
    custom_symbol: 'PD.456',
    custom_kod_producenta: 'PD456'
  },
  {
    id: 'KK.789',
    title: 'Crown Drill 789',
    vendor: 'Kennametal',
    price: 22000,
    available: false,
    sku: 'KK.789',
    custom_symbol: 'KK.789',
    custom_kod_producenta: 'KK789'
  }
];

test.describe('User Journey E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the theme data
    await page.addInitScript(() => {
      // Mock WiertlaCNC global object
      window.WiertlaCNC = {
        products: mockProducts,
        activeTabType: 'wiertla',
        filters: {
          manufacturer: null,
          search: null,
          category: null
        },
        tabPrefixMapping: {
          wiertla: ['VW','WV','PR','WW','PS','WK','WA'],
          plytki: ['PD'],
          koronki: ['KK','KW','KI','KT','KS','KA','KG']
        }
      };

      // Mock WiertlaTranslations
      window.WiertlaTranslations = {
        pl: {
          'product.price': 'Cena: {price} PLN',
          'product.available': 'Dostępny',
          'product.unavailable': 'Niedostępny',
          'search.placeholder': 'Szukaj produktów...',
          'filter.manufacturer': 'Producent',
          'filter.category': 'Kategoria'
        },
        en: {
          'product.price': 'Price: {price} PLN',
          'product.available': 'Available',
          'product.unavailable': 'Unavailable',
          'search.placeholder': 'Search products...',
          'filter.manufacturer': 'Manufacturer',
          'filter.category': 'Category'
        }
      };
    });

    // Navigate to the categories page
    await page.goto('/collections/all');
  });

  test('should complete search and filter workflow', async ({ page }) => {
    // 1. User searches for products
    await page.fill('input[name="q"]', 'VHM');
    await page.press('input[name="q"]', 'Enter');

    // Wait for search results
    await page.waitForSelector('.wiertla-categories__table tbody tr', { timeout: 5000 });

    // 2. Verify search results
    const searchResults = await page.locator('.wiertla-categories__table tbody tr').count();
    expect(searchResults).toBeGreaterThan(0);

    // 3. User applies manufacturer filter
    await page.selectOption('select[name="manufacturer"]', 'Sandvik');

    // Wait for filtered results
    await page.waitForTimeout(500);

    // 4. Verify filtered results
    const filteredResults = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    expect(filteredResults).toBeGreaterThan(0);

    // 5. User clears filters
    await page.click('button[data-clear-filters]');

    // 6. Verify all products are shown again
    await page.waitForTimeout(500);
    const allResults = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    expect(allResults).toBe(mockProducts.length);
  });

  test('should handle product availability filtering', async ({ page }) => {
    // 1. Filter by available products only
    await page.check('input[name="available_only"]');

    // Wait for filtered results
    await page.waitForTimeout(500);

    // 2. Verify only available products are shown
    const availableProducts = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    const expectedAvailable = mockProducts.filter(p => p.available).length;
    expect(availableProducts).toBe(expectedAvailable);

    // 3. Uncheck availability filter
    await page.uncheck('input[name="available_only"]');

    // 4. Verify all products are shown
    await page.waitForTimeout(500);
    const allProducts = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    expect(allProducts).toBe(mockProducts.length);
  });

  test('should handle tab switching workflow', async ({ page }) => {
    // 1. Start on wiertla tab
    await page.click('button[data-tab="wiertla"]');
    await page.waitForTimeout(300);

    // 2. Verify wiertla products are shown
    const wiertlaProducts = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    const expectedWiertla = mockProducts.filter(p => p.sku.startsWith('VW')).length;
    expect(wiertlaProducts).toBe(expectedWiertla);

    // 3. Switch to koronki tab
    await page.click('button[data-tab="koronki"]');
    await page.waitForTimeout(300);

    // 4. Verify koronki products are shown
    const koronkiProducts = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    const expectedKoronki = mockProducts.filter(p => p.sku.startsWith('KK')).length;
    expect(koronkiProducts).toBe(expectedKoronki);

    // 5. Switch back to wiertla tab
    await page.click('button[data-tab="wiertla"]');
    await page.waitForTimeout(300);

    // 6. Verify wiertla products are shown again
    const wiertlaProductsAgain = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    expect(wiertlaProductsAgain).toBe(expectedWiertla);
  });

  test('should handle rent modal workflow', async ({ page }) => {
    // 1. Click rent button on a product
    await page.click('.wiertla-categories__table tbody tr:first-child .rent-button');

    // 2. Verify modal opens
    await page.waitForSelector('.wiertla-categories__mobile-rent-modal.active', { timeout: 3000 });
    const modal = page.locator('.wiertla-categories__mobile-rent-modal');
    await expect(modal).toBeVisible();

    // 3. Fill rent form
    await page.fill('input[name="contact[contact_person]"]', 'John Doe');
    await page.fill('input[name="contact[company_name]"]', 'Test Company');
    await page.fill('input[name="contact[phone]"]', '+1234567890');
    await page.fill('input[name="contact[email]"]', 'john@test.com');
    await page.fill('input[name="contact[drill_symbol]"]', 'VW.123');
    await page.fill('input[name="contact[rental_date]"]', '2024-01-15');

    // 4. Submit form
    await page.click('.wiertla-categories__mobile-rent-form-content button[type="submit"]');

    // 5. Verify success message
    await page.waitForSelector('.wiertla-categories__mobile-rent-success', { timeout: 3000 });
    const successMessage = page.locator('.wiertla-categories__mobile-rent-success');
    await expect(successMessage).toBeVisible();

    // 6. Close modal
    await page.click('.wiertla-categories__mobile-rent-button');

    // 7. Verify modal is closed
    await expect(modal).not.toBeVisible();
  });

  test('should handle search synchronization across multiple inputs', async ({ page }) => {
    // 1. Type in main search input
    await page.fill('#Search', 'test query');

    // 2. Verify other search inputs are synchronized
    const categorySearchValue = await page.inputValue('#CategorySearch');
    expect(categorySearchValue).toBe('test query');

    // 3. Clear main search
    await page.fill('#Search', '');

    // 4. Verify other inputs are cleared
    const clearedValue = await page.inputValue('#CategorySearch');
    expect(clearedValue).toBe('');
  });

  test('should handle language switching workflow', async ({ page }) => {
    // 1. Start with Polish language
    await page.evaluate(() => {
      window.WiertlaTranslations.currentLanguage = 'pl';
    });

    // 2. Verify Polish text is displayed
    const polishText = await page.textContent('.language-indicator');
    expect(polishText).toContain('PL');

    // 3. Switch to English
    await page.click('button[data-language="en"]');
    await page.waitForTimeout(300);

    // 4. Verify English text is displayed
    const englishText = await page.textContent('.language-indicator');
    expect(englishText).toContain('EN');

    // 5. Verify product prices are translated
    const priceElement = page.locator('.product-price').first();
    const priceText = await priceElement.textContent();
    expect(priceText).toContain('Price:');
  });

  test('should handle responsive design on mobile', async ({ page }) => {
    // 1. Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. Verify mobile layout is active
    const mobileMenu = page.locator('.mobile-menu');
    await expect(mobileMenu).toBeVisible();

    // 3. Open mobile menu
    await page.click('.mobile-menu-toggle');
    await page.waitForTimeout(300);

    // 4. Verify menu is open
    const mobileNav = page.locator('.mobile-navigation');
    await expect(mobileNav).toBeVisible();

    // 5. Close mobile menu
    await page.click('.mobile-menu-close');
    await page.waitForTimeout(300);

    // 6. Verify menu is closed
    await expect(mobileNav).not.toBeVisible();
  });

  test('should handle error states gracefully', async ({ page }) => {
    // 1. Simulate network error
    await page.route('**/api/products**', route => route.abort());

    // 2. Try to load products
    await page.reload();

    // 3. Verify error message is displayed
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();

    // 4. Verify retry button works
    await page.route('**/api/products**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProducts)
    }));

    await page.click('.retry-button');
    await page.waitForTimeout(1000);

    // 5. Verify products are loaded
    const products = await page.locator('.wiertla-categories__table tbody tr').count();
    expect(products).toBe(mockProducts.length);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // 1. Focus on search input
    await page.focus('input[name="q"]');

    // 2. Use Tab to navigate to next element
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedElement).toBe('SELECT'); // Should focus on manufacturer filter

    // 3. Use Tab to navigate to filter button
    await page.keyboard.press('Tab');
    const focusedButton = await page.evaluate(() => document.activeElement.tagName);
    expect(focusedButton).toBe('BUTTON');

    // 4. Use Enter to activate button
    await page.keyboard.press('Enter');

    // 5. Verify filter is applied
    await page.waitForTimeout(500);
    const filteredProducts = await page.locator('.wiertla-categories__table tbody tr:visible').count();
    expect(filteredProducts).toBeGreaterThan(0);
  });

  test('should handle complete purchase workflow', async ({ page }) => {
    // 1. Search for a product
    await page.fill('input[name="q"]', 'VW.123');
    await page.press('input[name="q"]', 'Enter');
    await page.waitForTimeout(500);

    // 2. Click on product to view details
    await page.click('.wiertla-categories__table tbody tr:first-child .product-link');

    // 3. Verify product details page loads
    await page.waitForSelector('.product-details', { timeout: 5000 });
    const productTitle = page.locator('.product-title');
    await expect(productTitle).toContainText('VHM Drill Bit 123');

    // 4. Add product to cart
    await page.click('.add-to-cart-button');
    await page.waitForTimeout(500);

    // 5. Verify cart notification
    const cartNotification = page.locator('.cart-notification');
    await expect(cartNotification).toBeVisible();

    // 6. Go to cart
    await page.click('.cart-link');
    await page.waitForSelector('.cart-page', { timeout: 5000 });

    // 7. Verify product is in cart
    const cartItem = page.locator('.cart-item');
    await expect(cartItem).toContainText('VHM Drill Bit 123');

    // 8. Proceed to checkout
    await page.click('.checkout-button');
    await page.waitForTimeout(1000);

    // 9. Verify checkout page loads
    const checkoutForm = page.locator('.checkout-form');
    await expect(checkoutForm).toBeVisible();
  });
});

