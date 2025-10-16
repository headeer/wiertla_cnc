// E2E tests for customer account management

import { test, expect } from '@playwright/test';

test.describe('Customer Account Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/account/login');
    await page.waitForLoadState('networkidle');
  });

  test('should allow customer to login successfully', async ({ page }) => {
    // Check that login form is visible
    await expect(page.locator('.wiertla-auth')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Zaloguj się');
    
    // Fill login form
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to account page
    await expect(page).toHaveURL('/account');
    
    // Check that account page is displayed
    await expect(page.locator('h1')).toContainText('Moje konto');
  });

  test('should display login errors for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('#customer_email', 'invalid@example.com');
    await page.fill('#customer_password', 'wrongpassword');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error message
    await expect(page.locator('[data-login-error]')).toBeVisible();
    await expect(page.locator('[data-login-error]')).toContainText('Nieprawidłowe dane logowania');
  });

  test('should allow customer to register new account', async ({ page }) => {
    // Navigate to register page
    await page.goto('/account/register');
    await page.waitForLoadState('networkidle');
    
    // Check that register form is visible
    await expect(page.locator('.wiertla-auth')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Utwórz konto');
    
    // Fill registration form
    await page.fill('#first_name', 'Jan');
    await page.fill('#last_name', 'Kowalski');
    await page.fill('#email', 'newuser@example.com');
    await page.fill('#password', 'newpassword123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should redirect to account page or show success message
    await expect(page).toHaveURL(/\/account/);
  });

  test('should display registration errors for invalid data', async ({ page }) => {
    // Navigate to register page
    await page.goto('/account/register');
    await page.waitForLoadState('networkidle');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    await expect(page.locator('.form-errors')).toBeVisible();
  });

  test('should allow customer to view order history', async ({ page }) => {
    // Login first (assuming we have a test user)
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to account page
    await expect(page).toHaveURL('/account');
    
    // Check that orders section is visible
    await expect(page.locator('h2')).toContainText('Moje Zamówienia');
    
    // Check that orders table is displayed
    await expect(page.locator('table')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('th')).toContainText('Numer zamówienia');
    await expect(page.locator('th')).toContainText('Data');
    await expect(page.locator('th')).toContainText('Status płatności');
    await expect(page.locator('th')).toContainText('Status realizacji');
    await expect(page.locator('th')).toContainText('Suma');
  });

  test('should allow customer to view individual order details', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to account page
    await expect(page).toHaveURL('/account');
    
    // Click on first order link
    const firstOrderLink = page.locator('table a').first();
    if (await firstOrderLink.isVisible()) {
      await firstOrderLink.click();
      
      // Should navigate to order details page
      await expect(page).toHaveURL(/\/account\/orders\//);
      
      // Check that order details are displayed
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('table')).toBeVisible();
      
      // Check order information
      await expect(page.locator('table th')).toContainText('Produkt');
      await expect(page.locator('table th')).toContainText('SKU');
      await expect(page.locator('table th')).toContainText('Cena');
      await expect(page.locator('table th')).toContainText('Ilość');
      await expect(page.locator('table th')).toContainText('Razem');
    }
  });

  test('should allow customer to manage addresses', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to addresses page
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    // Check that addresses page is displayed
    await expect(page.locator('.wiertla-addresses')).toBeVisible();
    await expect(page.locator('h1')).toContainText('Adresy');
    
    // Check that add new address button is visible
    await expect(page.locator('button:has-text("Dodaj nowy adres")')).toBeVisible();
  });

  test('should allow customer to add new address', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to addresses page
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    // Click add new address button
    await page.click('button:has-text("Dodaj nowy adres")');
    
    // Check that address form is visible
    await expect(page.locator('.address-form')).toBeVisible();
    
    // Fill address form
    await page.fill('input[name="address[first_name]"]', 'Jan');
    await page.fill('input[name="address[last_name]"]', 'Kowalski');
    await page.fill('input[name="address[company]"]', 'Test Company');
    await page.fill('input[name="address[address1]"]', 'ul. Testowa 1');
    await page.fill('input[name="address[address2]"]', 'lok. 5');
    await page.fill('input[name="address[city]"]', 'Warszawa');
    await page.selectOption('select[name="address[country]"]', 'Poland');
    await page.fill('input[name="address[zip]"]', '00-001');
    await page.fill('input[name="address[phone]"]', '+48123456789');
    
    // Save address
    await page.click('button:has-text("Zapisz adres")');
    
    // Should show success message or redirect
    await expect(page.locator('.address-item')).toContainText('Jan Kowalski');
  });

  test('should allow customer to edit existing address', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to addresses page
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    // Click edit button on first address
    const editButton = page.locator('button:has-text("Edytuj")').first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Check that edit form is visible
      await expect(page.locator('.address-form')).toBeVisible();
      
      // Modify address
      await page.fill('input[name="address[first_name]"]', 'Jan Updated');
      
      // Save changes
      await page.click('button:has-text("Zapisz adres")');
      
      // Should show updated address
      await expect(page.locator('.address-item')).toContainText('Jan Updated');
    }
  });

  test('should allow customer to delete address with confirmation', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to addresses page
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    // Click delete button on first address
    const deleteButton = page.locator('button:has-text("Usuń")').first();
    if (await deleteButton.isVisible()) {
      // Set up dialog handler
      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toContain('Czy na pewno chcesz usunąć ten adres?');
        await dialog.accept();
      });
      
      await deleteButton.click();
      
      // Address should be removed
      await expect(deleteButton).not.toBeVisible();
    }
  });

  test('should allow customer to set default address', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Navigate to addresses page
    await page.goto('/account/addresses');
    await page.waitForLoadState('networkidle');
    
    // Check default address checkbox
    const defaultCheckbox = page.locator('input[name="address[default]"]').first();
    if (await defaultCheckbox.isVisible()) {
      await defaultCheckbox.check();
      
      // Save address
      await page.click('button:has-text("Zapisz adres")');
      
      // Should show default address indicator
      await expect(page.locator('.address-item')).toContainText('Domyślny adres');
    }
  });

  test('should handle password reset flow', async ({ page }) => {
    // Click forgot password link
    const forgotPasswordLink = page.locator('a:has-text("Zapomniałeś hasła?")');
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Should show password reset form
      await expect(page.locator('h2')).toContainText('Resetowanie hasła');
      
      // Fill email for password reset
      await page.fill('#recover_email', 'test@example.com');
      
      // Submit password reset
      await page.click('input[type="submit"]');
      
      // Should show success message
      await expect(page.locator('[data-recover-success]')).toBeVisible();
      await expect(page.locator('[data-recover-success]')).toContainText('Wysłaliśmy do Ciebie email');
    }
  });

  test('should allow customer to logout', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to account page
    await expect(page).toHaveURL('/account');
    
    // Click logout button
    await page.click('a:has-text("Wyloguj się")');
    
    // Should redirect to login page
    await expect(page).toHaveURL('/account/login');
    
    // Should show login form
    await expect(page.locator('h1')).toContainText('Zaloguj się');
  });

  test('should maintain session across page refreshes', async ({ page }) => {
    // Login first
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to account page
    await expect(page).toHaveURL('/account');
    
    // Refresh page
    await page.reload();
    
    // Should still be logged in
    await expect(page.locator('h1')).toContainText('Moje konto');
    await expect(page.locator('a:has-text("Wyloguj się")')).toBeVisible();
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to login page
    await page.goto('/account/login');
    
    // Check that mobile layout is responsive
    await expect(page.locator('.wiertla-auth')).toBeVisible();
    
    // Fill and submit form
    await page.fill('#customer_email', 'test@example.com');
    await page.fill('#customer_password', 'password123');
    await page.click('button[type="submit"]');
    
    // Should work on mobile
    await expect(page).toHaveURL('/account');
    await expect(page.locator('h1')).toContainText('Moje konto');
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Navigate to login page
    await page.goto('/account/login');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Check that focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Fill form using keyboard
    await page.keyboard.type('test@example.com');
    await page.keyboard.press('Tab');
    await page.keyboard.type('password123');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Should login successfully
    await expect(page).toHaveURL('/account');
  });
});

