/**
 * E2E accessibility tests
 * Tests keyboard navigation, screen reader compatibility, and WCAG compliance
 */

const { test, expect } = require('@playwright/test');

test.describe('Accessibility E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Mock theme data
    await page.addInitScript(() => {
      window.WiertlaCNC = {
        products: [
          {
            id: 'VW.123',
            title: 'VHM Drill Bit 123',
            vendor: 'Sandvik',
            price: 15000,
            available: true,
            sku: 'VW.123'
          }
        ],
        activeTabType: 'wiertla',
        filters: { manufacturer: null, search: null, category: null }
      };
    });

    await page.goto('/collections/all');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    // Check that h1 exists and is unique
    const h1Elements = await page.locator('h1').count();
    expect(h1Elements).toBe(1);

    // Check that headings follow proper hierarchy
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    let previousLevel = 0;

    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName);
      const level = parseInt(tagName.substring(1));
      
      // Heading levels should not skip (e.g., h1 to h3)
      expect(level - previousLevel).toBeLessThanOrEqual(1);
      previousLevel = level;
    }
  });

  test('should have proper form labels and ARIA attributes', async ({ page }) => {
    // Check search input has proper label
    const searchInput = page.locator('input[name="q"]');
    const searchLabel = page.locator('label[for="search-input"]');
    await expect(searchLabel).toBeVisible();

    // Check form inputs have proper ARIA attributes
    const formInputs = page.locator('input, select, textarea');
    const inputCount = await formInputs.count();

    for (let i = 0; i < inputCount; i++) {
      const input = formInputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const id = await input.getAttribute('id');
      
      // Each input should have either aria-label, aria-labelledby, or associated label
      const hasLabel = ariaLabel || ariaLabelledBy || id;
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test Tab navigation through interactive elements
    await page.keyboard.press('Tab');
    let focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['INPUT', 'BUTTON', 'SELECT', 'A']).toContain(focusedElement);

    // Continue tabbing through elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      focusedElement = await page.evaluate(() => document.activeElement.tagName);
      expect(['INPUT', 'BUTTON', 'SELECT', 'A']).toContain(focusedElement);
    }

    // Test Enter key activation
    await page.keyboard.press('Enter');
    // Should not throw error or cause page navigation
  });

  test('should have proper focus indicators', async ({ page }) => {
    // Focus on an interactive element
    await page.focus('input[name="q"]');
    
    // Check that focus is visible
    const focusedElement = page.locator('input[name="q"]:focus');
    await expect(focusedElement).toBeVisible();

    // Check focus styles are applied
    const focusStyles = await focusedElement.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow
      };
    });

    // Should have visible focus indicator
    const hasFocusIndicator = 
      focusStyles.outline !== 'none' || 
      focusStyles.outlineWidth !== '0px' || 
      focusStyles.boxShadow !== 'none';
    
    expect(hasFocusIndicator).toBe(true);
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check text elements have sufficient contrast
    const textElements = page.locator('p, span, div, h1, h2, h3, h4, h5, h6');
    const textCount = await textElements.count();

    for (let i = 0; i < Math.min(textCount, 10); i++) {
      const element = textElements.nth(i);
      const isVisible = await element.isVisible();
      
      if (isVisible) {
        const contrast = await element.evaluate(el => {
          const styles = window.getComputedStyle(el);
          const color = styles.color;
          const backgroundColor = styles.backgroundColor;
          
          // Simple contrast check (in real implementation, use proper contrast calculation)
          return color !== backgroundColor;
        });
        
        expect(contrast).toBe(true);
      }
    }
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img');
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Images should have alt text or be decorative (role="presentation")
      const hasAltOrDecorative = alt !== null || role === 'presentation';
      expect(hasAltOrDecorative).toBe(true);
    }
  });

  test('should announce dynamic content changes', async ({ page }) => {
    // Check for live regions
    const liveRegions = page.locator('[aria-live], [aria-atomic], [aria-relevant]');
    const liveRegionCount = await liveRegions.count();
    
    // Should have at least one live region for dynamic content
    expect(liveRegionCount).toBeGreaterThan(0);

    // Test that search results are announced
    await page.fill('input[name="q"]', 'test');
    await page.waitForTimeout(500);
    
    // Check that results are announced to screen readers
    const announcement = page.locator('[aria-live="polite"], [aria-live="assertive"]');
    await expect(announcement).toBeVisible();
  });

  test('should handle screen reader navigation', async ({ page }) => {
    // Test landmark navigation
    const landmarks = page.locator('main, nav, header, footer, aside, section[aria-label], section[aria-labelledby]');
    const landmarkCount = await landmarks.count();
    
    // Should have proper landmarks
    expect(landmarkCount).toBeGreaterThan(0);

    // Test heading navigation
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    const headingCount = await headings.count();
    
    // Should have headings for navigation
    expect(headingCount).toBeGreaterThan(0);
  });

  test('should have proper button and link semantics', async ({ page }) => {
    // Check buttons have proper roles
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      // Buttons should have accessible text
      const hasAccessibleText = text?.trim() || ariaLabel;
      expect(hasAccessibleText).toBeTruthy();
    }

    // Check links have proper href or role
    const links = page.locator('a');
    const linkCount = await links.count();

    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const role = await link.getAttribute('role');
      
      // Links should have href or proper role
      const hasHrefOrRole = href || role;
      expect(hasHrefOrRole).toBeTruthy();
    }
  });

  test('should handle form validation accessibility', async ({ page }) => {
    // Test form with validation
    await page.fill('input[name="contact_person"]', '');
    await page.click('button[type="submit"]');

    // Check that validation errors are properly associated
    const errorElements = page.locator('[aria-invalid="true"], .error');
    const errorCount = await errorElements.count();
    
    if (errorCount > 0) {
      const firstError = errorElements.first();
      const ariaDescribedBy = await firstError.getAttribute('aria-describedby');
      const ariaInvalid = await firstError.getAttribute('aria-invalid');
      
      // Error should be properly marked
      expect(ariaInvalid === 'true' || ariaDescribedBy).toBeTruthy();
    }
  });

  test('should support reduced motion preferences', async ({ page }) => {
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    // Check that animations are disabled
    const animatedElements = page.locator('[style*="animation"], [style*="transition"]');
    const animatedCount = await animatedElements.count();
    
    // Should respect reduced motion preference
    expect(animatedCount).toBe(0);
  });

  test('should have proper table accessibility', async ({ page }) => {
    const tables = page.locator('table');
    const tableCount = await tables.count();

    for (let i = 0; i < tableCount; i++) {
      const table = tables.nth(i);
      
      // Check for table headers
      const headers = table.locator('th');
      const headerCount = await headers.count();
      
      if (headerCount > 0) {
        // Check for proper scope attributes
        const scopedHeaders = table.locator('th[scope]');
        const scopedCount = await scopedHeaders.count();
        
        // Should have proper scope attributes
        expect(scopedCount).toBeGreaterThan(0);
      }

      // Check for table caption or aria-label
      const caption = table.locator('caption');
      const ariaLabel = await table.getAttribute('aria-label');
      const ariaLabelledBy = await table.getAttribute('aria-labelledby');
      
      const hasAccessibleName = 
        (await caption.count()) > 0 || 
        ariaLabel || 
        ariaLabelledBy;
      
      expect(hasAccessibleName).toBe(true);
    }
  });
});

