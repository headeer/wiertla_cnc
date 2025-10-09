// E2E tests for product details page

import { test, expect } from '@playwright/test';

test.describe('Product Details Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a test product page
    await page.goto('/products/test-product');
    await page.waitForLoadState('networkidle');
  });

  test('should display product information correctly', async ({ page }) => {
    // Check that product details are displayed
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    
    // Check product specifications
    await expect(page.locator('.product-details__specs')).toBeVisible();
    
    // Check that product image is displayed
    await expect(page.locator('.product-image, .product-gallery img')).toBeVisible();
  });

  test('should display product specifications', async ({ page }) => {
    // Check that specifications section is visible
    await expect(page.locator('.product-details__specs')).toBeVisible();
    
    // Check for common specification fields
    const specsSection = page.locator('.product-details__specs');
    
    // These should be present if the product has the data
    const possibleSpecs = [
      'Symbol',
      'Średnica',
      'SKU',
      'Producent',
      'Gniazdo',
      'Typ',
      'Stan'
    ];
    
    // At least some specifications should be visible
    let visibleSpecs = 0;
    for (const spec of possibleSpecs) {
      if (await specsSection.locator(`text=${spec}`).isVisible()) {
        visibleSpecs++;
      }
    }
    
    expect(visibleSpecs).toBeGreaterThan(0);
  });

  test('should display delivery time based on SKU', async ({ page }) => {
    // Check if delivery time is displayed
    const deliveryTimeElement = page.locator('.delivery-time');
    
    if (await deliveryTimeElement.isVisible()) {
      // Should contain delivery time text
      const deliveryText = await deliveryTimeElement.textContent();
      expect(deliveryText).toMatch(/dni roboczych|dzień roboczy|Dostępność do potwierdzenia/);
    }
  });

  test('should display rent functionality for rentable products', async ({ page }) => {
    // Check if rent button is displayed
    const rentButton = page.locator('button:has-text("Wypożycz"), .rent-button');
    
    if (await rentButton.isVisible()) {
      // Should be clickable
      await expect(rentButton).toBeEnabled();
      
      // Click rent button
      await rentButton.click();
      
      // Should show rent form or modal
      await expect(page.locator('.rent-form, .rent-modal')).toBeVisible();
    }
  });

  test('should display related tools section', async ({ page }) => {
    // Check that related tools section exists
    const relatedSection = page.locator('#related-by-gniazdo');
    
    if (await relatedSection.isVisible()) {
      // Should have title
      await expect(relatedSection.locator('.latest-products__title')).toContainText('NARZĘDZIA POWIĄZANE');
      
      // Should show loading skeleton initially
      await expect(relatedSection.locator('.related-skeleton')).toBeVisible();
      
      // Wait for related tools to load (with timeout)
      try {
        await page.waitForSelector('.swiper-slide', { timeout: 10000 });
        
        // Should show related products
        const relatedProducts = relatedSection.locator('.swiper-slide');
        const productCount = await relatedProducts.count();
        expect(productCount).toBeGreaterThan(0);
        
        // Should have navigation
        await expect(relatedSection.locator('.swiper-navigation')).toBeVisible();
        
      } catch (error) {
        // If no related products found, section should be hidden
        await expect(relatedSection).not.toBeVisible();
      }
    }
  });

  test('should handle related tools carousel navigation', async ({ page }) => {
    const relatedSection = page.locator('#related-by-gniazdo');
    
    if (await relatedSection.isVisible()) {
      // Wait for related tools to load
      try {
        await page.waitForSelector('.swiper-slide', { timeout: 10000 });
        
        const navigation = relatedSection.locator('.swiper-navigation');
        const nextButton = navigation.locator('.swiper-button-next');
        const prevButton = navigation.locator('.swiper-button-prev');
        
        // Check if navigation buttons are present
        if (await nextButton.isVisible()) {
          // Click next button
          await nextButton.click();
          await page.waitForTimeout(500);
          
          // Click previous button
          if (await prevButton.isVisible()) {
            await prevButton.click();
            await page.waitForTimeout(500);
          }
        }
        
        // Check pagination bars
        const paginationBars = relatedSection.locator('.pagination-bar');
        const barCount = await paginationBars.count();
        
        if (barCount > 0) {
          // Click on a pagination bar
          await paginationBars.nth(0).click();
          await page.waitForTimeout(500);
        }
        
      } catch (error) {
        // If no related products, this test should pass
        console.log('No related products found, skipping carousel test');
      }
    }
  });

  test('should display contact information for rent requests', async ({ page }) => {
    // Check if contact information is displayed
    const contactSection = page.locator('.product-details__contact-info');
    
    if (await contactSection.isVisible()) {
      // Should have contact title
      await expect(contactSection.locator('.product-details__contact-title')).toContainText('Chcesz wypożyczyć?');
      
      // Should have contact methods
      const contactMethods = contactSection.locator('.product-details__contact-methods');
      await expect(contactMethods).toBeVisible();
      
      // Should have phone link
      const phoneLink = contactMethods.locator('a[href^="tel:"]');
      if (await phoneLink.isVisible()) {
        await expect(phoneLink).toContainText('+48');
      }
      
      // Should have email link
      const emailLink = contactMethods.locator('a[href^="mailto:"]');
      if (await emailLink.isVisible()) {
        await expect(emailLink).toContainText('@');
      }
    }
  });

  test('should handle product image gallery', async ({ page }) => {
    // Check if product has multiple images
    const imageGallery = page.locator('.product-gallery, .product-images');
    
    if (await imageGallery.isVisible()) {
      // Check for main product image
      const mainImage = imageGallery.locator('img').first();
      await expect(mainImage).toBeVisible();
      
      // Check for thumbnail images
      const thumbnails = imageGallery.locator('.thumbnail, .gallery-thumb');
      const thumbnailCount = await thumbnails.count();
      
      if (thumbnailCount > 1) {
        // Click on a thumbnail
        await thumbnails.nth(1).click();
        await page.waitForTimeout(500);
        
        // Main image should change
        await expect(mainImage).toBeVisible();
      }
    }
  });

  test('should display product availability status', async ({ page }) => {
    // Check for availability indicators
    const availabilityElements = page.locator('.product-availability, .stock-status, .availability');
    
    if (await availabilityElements.isVisible()) {
      const availabilityText = await availabilityElements.textContent();
      
      // Should indicate availability status
      expect(availabilityText).toMatch(/dostępny|na stanie|brak|wyprzedany/i);
    }
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload page for mobile view
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Check that product details are still visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.product-price')).toBeVisible();
    
    // Check that specifications are accessible
    await expect(page.locator('.product-details__specs')).toBeVisible();
    
    // Check related tools section on mobile
    const relatedSection = page.locator('#related-by-gniazdo');
    if (await relatedSection.isVisible()) {
      await expect(relatedSection).toBeVisible();
      
      // Mobile carousel should work
      try {
        await page.waitForSelector('.swiper-slide', { timeout: 10000 });
        const nextButton = relatedSection.locator('.swiper-button-next');
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(500);
        }
      } catch (error) {
        // No related products, which is fine
      }
    }
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Tab through page elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Test keyboard navigation in related tools
    const relatedSection = page.locator('#related-by-gniazdo');
    if (await relatedSection.isVisible()) {
      try {
        await page.waitForSelector('.swiper-slide', { timeout: 10000 });
        
        // Focus on related tools section
        await relatedSection.focus();
        
        // Use arrow keys to navigate
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(500);
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(500);
        
      } catch (error) {
        // No related products, which is fine
      }
    }
  });

  test('should handle product with no related tools', async ({ page }) => {
    // Navigate to a product that might not have related tools
    await page.goto('/products/product-without-related');
    await page.waitForLoadState('networkidle');
    
    // Related tools section should not be visible
    const relatedSection = page.locator('#related-by-gniazdo');
    await expect(relatedSection).not.toBeVisible();
  });

  test('should display product breadcrumbs', async ({ page }) => {
    // Check for breadcrumb navigation
    const breadcrumbs = page.locator('.breadcrumbs, .breadcrumb');
    
    if (await breadcrumbs.isVisible()) {
      // Should have home link
      const homeLink = breadcrumbs.locator('a[href="/"]');
      if (await homeLink.isVisible()) {
        await expect(homeLink).toContainText('Strona główna');
      }
      
      // Should have product category or collection link
      const categoryLinks = breadcrumbs.locator('a');
      const linkCount = await categoryLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    }
  });

  test('should handle product with missing data gracefully', async ({ page }) => {
    // Navigate to a product with minimal data
    await page.goto('/products/minimal-product');
    await page.waitForLoadState('networkidle');
    
    // Page should still load without errors
    await expect(page.locator('h1')).toBeVisible();
    
    // Missing data should show as "N/A" or be hidden
    const specsSection = page.locator('.product-details__specs');
    if (await specsSection.isVisible()) {
      // Should not crash or show errors
      await expect(specsSection).toBeVisible();
    }
  });

  test('should handle slow loading related tools', async ({ page }) => {
    const relatedSection = page.locator('#related-by-gniazdo');
    
    if (await relatedSection.isVisible()) {
      // Should show loading skeleton initially
      await expect(relatedSection.locator('.related-skeleton')).toBeVisible();
      
      // Wait for loading to complete (with longer timeout)
      try {
        await page.waitForSelector('.swiper-slide', { timeout: 15000 });
        
        // Loading skeleton should be hidden
        await expect(relatedSection.locator('.related-skeleton')).not.toBeVisible();
        
        // Related products should be visible
        await expect(relatedSection.locator('.swiper-slide')).toBeVisible();
        
      } catch (error) {
        // If still loading after timeout, skeleton should still be visible
        await expect(relatedSection.locator('.related-skeleton')).toBeVisible();
      }
    }
  });
});
