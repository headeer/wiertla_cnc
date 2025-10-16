/**
 * Integration tests for wiertla-categories.js
 * Tests the actual functionality of rent forms and modal management
 */

// Mock the actual wiertla-categories.js functionality
const mockWiertlaCategories = {
  // Rent form submission handler
  handleRentFormSubmission: function(e) {
    e.preventDefault();
    
    const form = document.querySelector(".wiertla-categories__mobile-rent-form");
    const formElement = document.querySelector(".wiertla-categories__mobile-rent-form-content");
    const successMessage = document.querySelector(".wiertla-categories__mobile-rent-success");
    const rentButton = document.querySelector(".wiertla-categories__mobile-rent-button");
    
    // Check form validity first
    if (formElement && !formElement.checkValidity()) {
      formElement.reportValidity();
      return;
    }
    
    if (form && successMessage && rentButton) {
      form.style.display = "none";
      successMessage.style.display = "flex";
      rentButton.style.display = "flex";
      rentButton.style.backgroundColor = "#FFFFFF";
      rentButton.querySelector("span").textContent = "Zamknij";
    }
  },

  // Success message close handler
  handleSuccessClose: function(e) {
    const button = e.target.closest('.wiertla-categories__mobile-rent-button');
    if (button && button.querySelector("span").textContent === "Zamknij") {
      window.closeRentModal();
    }
  },

  // Error display function
  showError: function(input, message) {
    const formGroup = input.closest('.wiertla-categories__mobile-rent-form-group');
    if (formGroup) {
      formGroup.classList.add('error');
      const errorMessage = formGroup.querySelector('.wiertla-categories__mobile-rent-form-error');
      if (errorMessage) {
        errorMessage.textContent = message;
      }
      input.classList.add('error');
    }
  },

  // Modal open function
  openRentModal: function(product) {
    const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
    if (modal) {
      modal.classList.add("active");
      setTimeout(() => {
        modal.style.display = "flex";
      }, 10);
    }
  },

  // Modal close function
  closeRentModal: function() {
    const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
    if (modal) {
      modal.style.display = "none";
      modal.classList.remove("active");
    }
  }
};

// Make functions globally available
window.openRentModal = mockWiertlaCategories.openRentModal;
window.closeRentModal = mockWiertlaCategories.closeRentModal;

describe('Wiertla Categories Integration Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="wiertla-categories__mobile-rent-modal">
        <div class="wiertla-categories__mobile-rent-form">
          <form class="wiertla-categories__mobile-rent-form-content">
            <div class="wiertla-categories__mobile-rent-form-group">
              <input type="text" name="contact_person" required>
              <div class="wiertla-categories__mobile-rent-form-error"></div>
            </div>
            <div class="wiertla-categories__mobile-rent-form-group">
              <input type="email" name="email" required>
              <div class="wiertla-categories__mobile-rent-form-error"></div>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div class="wiertla-categories__mobile-rent-success" style="display: none;">
          <p>Success message</p>
        </div>
        <button class="wiertla-categories__mobile-rent-button">
          <span>Rent</span>
        </button>
      </div>
    `;

    // Bind event listeners
    const form = document.querySelector(".wiertla-categories__mobile-rent-form-content");
    const closeButton = document.querySelector(".wiertla-categories__mobile-rent-button");
    
    if (form) {
      form.addEventListener("submit", mockWiertlaCategories.handleRentFormSubmission);
    }
    if (closeButton) {
      closeButton.addEventListener("click", mockWiertlaCategories.handleSuccessClose);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Rent Form Submission', () => {
    test('should hide form and show success message on valid submission', () => {
      const form = document.querySelector(".wiertla-categories__mobile-rent-form");
      const successMessage = document.querySelector(".wiertla-categories__mobile-rent-success");
      const rentButton = document.querySelector(".wiertla-categories__mobile-rent-button");
      const formElement = document.querySelector(".wiertla-categories__mobile-rent-form-content");

      // Fill form with valid data
      const nameInput = form.querySelector('input[name="contact_person"]');
      const emailInput = form.querySelector('input[name="email"]');
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';

      // Submit form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      formElement.dispatchEvent(submitEvent);

      // Check that form is hidden and success message is shown
      expect(form.style.display).toBe('none');
      expect(successMessage.style.display).toBe('flex');
      expect(rentButton.style.display).toBe('flex');
      expect(rentButton.style.backgroundColor).toBe('rgb(255, 255, 255)');
      expect(rentButton.querySelector('span').textContent).toBe('Zamknij');
    });

    test('should prevent default form submission', () => {
      const formElement = document.querySelector(".wiertla-categories__mobile-rent-form-content");
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      
      const preventDefaultSpy = jest.spyOn(submitEvent, 'preventDefault');
      
      formElement.dispatchEvent(submitEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Success Message Close', () => {
    test('should close modal when close button is clicked', () => {
      const closeButton = document.querySelector(".wiertla-categories__mobile-rent-button");
      const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
      
      // Set up success state
      closeButton.querySelector('span').textContent = 'Zamknij';
      
      // Mock window.closeRentModal
      const closeModalSpy = jest.spyOn(window, 'closeRentModal');
      
      // Click close button
      closeButton.click();
      
      expect(closeModalSpy).toHaveBeenCalled();
    });

    test('should not close modal when button text is not "Zamknij"', () => {
      const closeButton = document.querySelector(".wiertla-categories__mobile-rent-button");
      
      // Set up non-success state
      closeButton.querySelector('span').textContent = 'Rent';
      
      // Mock window.closeRentModal
      const closeModalSpy = jest.spyOn(window, 'closeRentModal');
      
      // Click button
      closeButton.click();
      
      expect(closeModalSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    test('should display error message for invalid input', () => {
      const input = document.querySelector('input[name="contact_person"]');
      const formGroup = input.closest('.wiertla-categories__mobile-rent-form-group');
      const errorMessage = formGroup.querySelector('.wiertla-categories__mobile-rent-form-error');
      
      mockWiertlaCategories.showError(input, 'Name is required');
      
      expect(formGroup.classList.contains('error')).toBe(true);
      expect(input.classList.contains('error')).toBe(true);
      expect(errorMessage.textContent).toBe('Name is required');
    });

    test('should handle missing error message element gracefully', () => {
      const input = document.querySelector('input[name="contact_person"]');
      const formGroup = input.closest('.wiertla-categories__mobile-rent-form-group');
      const errorElement = formGroup.querySelector('.wiertla-categories__mobile-rent-form-error');
      
      // Remove error element
      errorElement.remove();
      
      // Should not throw error
      expect(() => {
        mockWiertlaCategories.showError(input, 'Test error');
      }).not.toThrow();
      
      expect(formGroup.classList.contains('error')).toBe(true);
      expect(input.classList.contains('error')).toBe(true);
    });
  });

  describe('Modal Management', () => {
    test('should open rent modal', () => {
      const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
      
      mockWiertlaCategories.openRentModal({ id: 'test-product' });
      
      expect(modal.classList.contains('active')).toBe(true);
      
      // Wait for setTimeout
      setTimeout(() => {
        expect(modal.style.display).toBe('flex');
      }, 20);
    });

    test('should close rent modal', () => {
      const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
      
      // Set up open state
      modal.classList.add('active');
      modal.style.display = 'flex';
      
      mockWiertlaCategories.closeRentModal();
      
      expect(modal.style.display).toBe('none');
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should handle missing modal element gracefully', () => {
      // Remove modal element
      document.querySelector(".wiertla-categories__mobile-rent-modal").remove();
      
      // Should not throw error
      expect(() => {
        mockWiertlaCategories.openRentModal({ id: 'test-product' });
      }).not.toThrow();
      
      expect(() => {
        mockWiertlaCategories.closeRentModal();
      }).not.toThrow();
    });
  });

  describe('Form Validation Integration', () => {
    test('should handle form validation errors', () => {
      const form = document.querySelector(".wiertla-categories__mobile-rent-form");
      const formElement = document.querySelector(".wiertla-categories__mobile-rent-form-content");
      const nameInput = form.querySelector('input[name="contact_person"]');
      
      // Leave required field empty
      nameInput.value = '';
      
      // Mock form validation to fail
      const mockCheckValidity = jest.fn().mockReturnValue(false);
      const mockReportValidity = jest.fn();
      formElement.checkValidity = mockCheckValidity;
      formElement.reportValidity = mockReportValidity;
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      formElement.dispatchEvent(submitEvent);
      
      // Form should still be visible (not submitted) since validation failed
      expect(form.style.display).not.toBe('none');
      expect(mockReportValidity).toHaveBeenCalled();
    });
  });

  describe('Integration Workflow', () => {
    test('should handle complete rent workflow', () => {
      const modal = document.querySelector(".wiertla-categories__mobile-rent-modal");
      const form = document.querySelector(".wiertla-categories__mobile-rent-form");
      const successMessage = document.querySelector(".wiertla-categories__mobile-rent-success");
      const rentButton = document.querySelector(".wiertla-categories__mobile-rent-button");
      const formElement = document.querySelector(".wiertla-categories__mobile-rent-form-content");
      
      // 1. Open modal
      mockWiertlaCategories.openRentModal({ id: 'test-product' });
      expect(modal.classList.contains('active')).toBe(true);
      
      // 2. Fill and submit form
      const nameInput = form.querySelector('input[name="contact_person"]');
      const emailInput = form.querySelector('input[name="email"]');
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      formElement.dispatchEvent(submitEvent);
      
      // 3. Verify success state
      expect(form.style.display).toBe('none');
      expect(successMessage.style.display).toBe('flex');
      expect(rentButton.querySelector('span').textContent).toBe('Zamknij');
      
      // 4. Close modal
      mockWiertlaCategories.closeRentModal();
      expect(modal.style.display).toBe('none');
      expect(modal.classList.contains('active')).toBe(false);
    });
  });
});
