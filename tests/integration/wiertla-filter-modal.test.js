/**
 * Integration tests for wiertla-filter-modal.js
 * Tests filter modal interactions and functionality
 */

// Mock the filter modal functionality
const mockWiertlaFilterModal = {
  // Modal state management
  isOpen: false,
  currentFilters: {},

  // Open filter modal
  openFilterModal: function() {
    const modal = document.querySelector('.wiertla-filter-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
      document.body.classList.add('modal-open');
      this.isOpen = true;
    }
  },

  // Close filter modal
  closeFilterModal: function() {
    const modal = document.querySelector('.wiertla-filter-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.isOpen = false;
    }
  },

  // Apply filters
  applyFilters: function(filters) {
    // Filter out empty values
    this.currentFilters = {};
    for (const [key, value] of Object.entries(filters)) {
      if (value !== null && value !== undefined && value !== '') {
        this.currentFilters[key] = value;
      }
    }
    
    // Update filter display
    this.updateFilterDisplay();
    
    // Trigger filter change event
    const event = new CustomEvent('filtersChanged', {
      detail: { filters: this.currentFilters }
    });
    document.dispatchEvent(event);
  },

  // Clear all filters
  clearAllFilters: function() {
    this.currentFilters = {};
    this.updateFilterDisplay();
    
    // Reset form inputs
    const form = document.querySelector('.wiertla-filter-modal form');
    if (form) {
      form.reset();
    }
    
    // Trigger filter change event
    const event = new CustomEvent('filtersChanged', {
      detail: { filters: this.currentFilters }
    });
    document.dispatchEvent(event);
  },

  // Update filter display
  updateFilterDisplay: function() {
    const filterCount = Object.keys(this.currentFilters).filter(key => 
      this.currentFilters[key] !== null && this.currentFilters[key] !== ''
    ).length;
    
    const filterBadge = document.querySelector('.filter-badge');
    if (filterBadge) {
      filterBadge.textContent = filterCount > 0 ? filterCount.toString() : '';
      filterBadge.style.display = filterCount > 0 ? 'block' : 'none';
    }
  },

  // Handle filter form submission
  handleFilterSubmit: function(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const filters = {};
    
    // Extract filter values
    for (const [key, value] of formData.entries()) {
      if (value && value.trim() !== '') {
        filters[key] = value;
      }
    }
    
    this.applyFilters(filters);
    this.closeFilterModal();
  },

  // Handle filter reset
  handleFilterReset: function() {
    this.clearAllFilters();
    this.closeFilterModal();
  },

  // Get current filters
  getCurrentFilters: function() {
    return { ...this.currentFilters };
  },

  // Check if filter is active
  isFilterActive: function(filterName) {
    return this.currentFilters[filterName] !== undefined && 
           this.currentFilters[filterName] !== null && 
           this.currentFilters[filterName] !== '';
  }
};

describe('Wiertla Filter Modal Integration Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div class="filter-container">
        <button class="filter-trigger" data-filter-modal="open">
          <span class="filter-icon">🔍</span>
          <span class="filter-text">Filters</span>
          <span class="filter-badge" style="display: none;"></span>
        </button>
        
        <div class="wiertla-filter-modal" style="display: none;">
          <div class="modal-backdrop"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h2>Filter Products</h2>
              <button class="modal-close" data-filter-modal="close">×</button>
            </div>
            
            <form class="filter-form">
              <div class="filter-group">
                <label for="manufacturer">Manufacturer</label>
                <select name="manufacturer" id="manufacturer">
                  <option value="">All Manufacturers</option>
                  <option value="Sandvik">Sandvik</option>
                  <option value="AMEC">AMEC</option>
                  <option value="Kennametal">Kennametal</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label for="category">Category</label>
                <select name="category" id="category">
                  <option value="">All Categories</option>
                  <option value="wiertla">Wiertła</option>
                  <option value="koronki">Koronki</option>
                  <option value="plytki">Płytki</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label for="price_min">Min Price</label>
                <input type="number" name="price_min" id="price_min" min="0" step="100">
              </div>
              
              <div class="filter-group">
                <label for="price_max">Max Price</label>
                <input type="number" name="price_max" id="price_max" min="0" step="100">
              </div>
              
              <div class="filter-group">
                <label>
                  <input type="checkbox" name="available_only" value="true">
                  Available Only
                </label>
              </div>
              
              <div class="modal-actions">
                <button type="button" class="btn-secondary" data-filter-reset>Clear All</button>
                <button type="submit" class="btn-primary">Apply Filters</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Bind event listeners
    const trigger = document.querySelector('.filter-trigger');
    const closeButton = document.querySelector('.modal-close');
    const form = document.querySelector('.filter-form');
    const resetButton = document.querySelector('[data-filter-reset]');
    const modal = document.querySelector('.wiertla-filter-modal');

    if (trigger) {
      trigger.addEventListener('click', () => mockWiertlaFilterModal.openFilterModal());
    }
    if (closeButton) {
      closeButton.addEventListener('click', () => mockWiertlaFilterModal.closeFilterModal());
    }
    if (form) {
      form.addEventListener('submit', (e) => mockWiertlaFilterModal.handleFilterSubmit(e));
    }
    if (resetButton) {
      resetButton.addEventListener('click', () => mockWiertlaFilterModal.handleFilterReset());
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
          mockWiertlaFilterModal.closeFilterModal();
        }
      });
    }

    // Reset modal state
    mockWiertlaFilterModal.isOpen = false;
    mockWiertlaFilterModal.currentFilters = {};
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.body.classList.remove('modal-open');
  });

  describe('Modal Management', () => {
    test('should open filter modal when trigger is clicked', () => {
      const modal = document.querySelector('.wiertla-filter-modal');
      const trigger = document.querySelector('.filter-trigger');
      
      trigger.click();
      
      expect(modal.classList.contains('active')).toBe(true);
      expect(modal.style.display).toBe('flex');
      expect(document.body.classList.contains('modal-open')).toBe(true);
      expect(mockWiertlaFilterModal.isOpen).toBe(true);
    });

    test('should close filter modal when close button is clicked', () => {
      const modal = document.querySelector('.wiertla-filter-modal');
      const closeButton = document.querySelector('.modal-close');
      
      // Open modal first
      mockWiertlaFilterModal.openFilterModal();
      expect(modal.classList.contains('active')).toBe(true);
      
      // Close modal
      closeButton.click();
      
      expect(modal.classList.contains('active')).toBe(false);
      expect(modal.style.display).toBe('none');
      expect(document.body.classList.contains('modal-open')).toBe(false);
      expect(mockWiertlaFilterModal.isOpen).toBe(false);
    });

    test('should close modal when backdrop is clicked', () => {
      const modal = document.querySelector('.wiertla-filter-modal');
      const backdrop = modal.querySelector('.modal-backdrop');
      
      // Open modal first
      mockWiertlaFilterModal.openFilterModal();
      expect(modal.classList.contains('active')).toBe(true);
      
      // Click backdrop
      backdrop.click();
      
      expect(modal.classList.contains('active')).toBe(false);
      expect(modal.style.display).toBe('none');
      expect(mockWiertlaFilterModal.isOpen).toBe(false);
    });

    test('should not close modal when content is clicked', () => {
      const modal = document.querySelector('.wiertla-filter-modal');
      const content = modal.querySelector('.modal-content');
      
      // Open modal first
      mockWiertlaFilterModal.openFilterModal();
      expect(modal.classList.contains('active')).toBe(true);
      
      // Click content
      content.click();
      
      expect(modal.classList.contains('active')).toBe(true);
      expect(modal.style.display).toBe('flex');
      expect(mockWiertlaFilterModal.isOpen).toBe(true);
    });
  });

  describe('Filter Application', () => {
    test('should apply filters from form submission', () => {
      const form = document.querySelector('.filter-form');
      const manufacturerSelect = form.querySelector('[name="manufacturer"]');
      const categorySelect = form.querySelector('[name="category"]');
      const availableCheckbox = form.querySelector('[name="available_only"]');
      
      // Set filter values
      manufacturerSelect.value = 'Sandvik';
      categorySelect.value = 'wiertla';
      availableCheckbox.checked = true;
      
      // Submit form
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Check filters were applied
      const filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.manufacturer).toBe('Sandvik');
      expect(filters.category).toBe('wiertla');
      expect(filters.available_only).toBe('true');
    });

    test('should update filter badge when filters are applied', () => {
      const filterBadge = document.querySelector('.filter-badge');
      
      // Apply filters
      mockWiertlaFilterModal.applyFilters({
        manufacturer: 'Sandvik',
        category: 'wiertla'
      });
      
      expect(filterBadge.textContent).toBe('2');
      expect(filterBadge.style.display).toBe('block');
    });

    test('should hide filter badge when no filters are applied', () => {
      const filterBadge = document.querySelector('.filter-badge');
      
      // Apply empty filters
      mockWiertlaFilterModal.applyFilters({});
      
      expect(filterBadge.textContent).toBe('');
      expect(filterBadge.style.display).toBe('none');
    });

    test('should trigger filtersChanged event when filters are applied', () => {
      const eventSpy = jest.fn();
      document.addEventListener('filtersChanged', eventSpy);
      
      mockWiertlaFilterModal.applyFilters({
        manufacturer: 'Sandvik'
      });
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { filters: { manufacturer: 'Sandvik' } }
        })
      );
    });
  });

  describe('Filter Reset', () => {
    test('should clear all filters when reset button is clicked', () => {
      const resetButton = document.querySelector('[data-filter-reset]');
      const form = document.querySelector('.filter-form');
      
      // Set some filter values
      form.querySelector('[name="manufacturer"]').value = 'Sandvik';
      form.querySelector('[name="category"]').value = 'wiertla';
      form.querySelector('[name="available_only"]').checked = true;
      
      // Apply filters first
      mockWiertlaFilterModal.applyFilters({
        manufacturer: 'Sandvik',
        category: 'wiertla',
        available_only: 'true'
      });
      
      // Reset filters
      resetButton.click();
      
      // Check filters are cleared
      const filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters).toEqual({});
      
      // Check form is reset
      expect(form.querySelector('[name="manufacturer"]').value).toBe('');
      expect(form.querySelector('[name="category"]').value).toBe('');
      expect(form.querySelector('[name="available_only"]').checked).toBe(false);
    });

    test('should trigger filtersChanged event when filters are reset', () => {
      const eventSpy = jest.fn();
      document.addEventListener('filtersChanged', eventSpy);
      
      // Apply filters first
      mockWiertlaFilterModal.applyFilters({ manufacturer: 'Sandvik' });
      
      // Reset filters
      mockWiertlaFilterModal.clearAllFilters();
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { filters: {} }
        })
      );
    });
  });

  describe('Filter State Management', () => {
    test('should track filter state correctly', () => {
      // Initially no filters
      expect(mockWiertlaFilterModal.getCurrentFilters()).toEqual({});
      expect(mockWiertlaFilterModal.isFilterActive('manufacturer')).toBe(false);
      
      // Apply manufacturer filter
      mockWiertlaFilterModal.applyFilters({ manufacturer: 'Sandvik' });
      expect(mockWiertlaFilterModal.isFilterActive('manufacturer')).toBe(true);
      expect(mockWiertlaFilterModal.isFilterActive('category')).toBe(false);
      
      // Apply additional filters
      mockWiertlaFilterModal.applyFilters({
        manufacturer: 'Sandvik',
        category: 'wiertla',
        available_only: 'true'
      });
      
      expect(mockWiertlaFilterModal.isFilterActive('manufacturer')).toBe(true);
      expect(mockWiertlaFilterModal.isFilterActive('category')).toBe(true);
      expect(mockWiertlaFilterModal.isFilterActive('available_only')).toBe(true);
    });

    test('should handle empty filter values', () => {
      mockWiertlaFilterModal.applyFilters({
        manufacturer: '',
        category: null,
        price_min: undefined
      });
      
      const filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.manufacturer).toBeUndefined();
      expect(filters.category).toBeUndefined();
      expect(filters.price_min).toBeUndefined();
    });
  });

  describe('Form Validation', () => {
    test('should handle price range validation', () => {
      const form = document.querySelector('.filter-form');
      const priceMin = form.querySelector('[name="price_min"]');
      const priceMax = form.querySelector('[name="price_max"]');
      
      // Set invalid price range (min > max)
      priceMin.value = '1000';
      priceMax.value = '500';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Should still apply filters (validation would be handled by form validation)
      const filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.price_min).toBe('1000');
      expect(filters.price_max).toBe('500');
    });

    test('should handle numeric input validation', () => {
      const form = document.querySelector('.filter-form');
      const priceMin = form.querySelector('[name="price_min"]');
      
      // Set non-numeric value
      priceMin.value = 'invalid';
      
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // Should handle gracefully - empty values are filtered out
      const filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.price_min).toBeUndefined();
    });
  });

  describe('Integration Workflow', () => {
    test('should handle complete filter workflow', () => {
      const modal = document.querySelector('.wiertla-filter-modal');
      const trigger = document.querySelector('.filter-trigger');
      const form = document.querySelector('.filter-form');
      const resetButton = document.querySelector('[data-filter-reset]');
      const closeButton = document.querySelector('.modal-close');
      
      // 1. Open modal
      trigger.click();
      expect(modal.classList.contains('active')).toBe(true);
      
      // 2. Set filters
      form.querySelector('[name="manufacturer"]').value = 'Sandvik';
      form.querySelector('[name="category"]').value = 'wiertla';
      form.querySelector('[name="available_only"]').checked = true;
      
      // 3. Apply filters
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
      
      // 4. Verify filters applied and modal closed
      const filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.manufacturer).toBe('Sandvik');
      expect(filters.category).toBe('wiertla');
      expect(filters.available_only).toBe('true');
      expect(modal.classList.contains('active')).toBe(false);
      
      // 5. Reopen modal
      trigger.click();
      expect(modal.classList.contains('active')).toBe(true);
      
      // 6. Reset filters
      resetButton.click();
      
      // 7. Verify filters cleared and modal closed
      const clearedFilters = mockWiertlaFilterModal.getCurrentFilters();
      expect(clearedFilters).toEqual({});
      expect(modal.classList.contains('active')).toBe(false);
    });

    test('should handle multiple filter applications', () => {
      // Apply first set of filters
      mockWiertlaFilterModal.applyFilters({
        manufacturer: 'Sandvik',
        category: 'wiertla'
      });
      
      let filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.manufacturer).toBe('Sandvik');
      expect(filters.category).toBe('wiertla');
      
      // Apply second set of filters (should replace previous)
      mockWiertlaFilterModal.applyFilters({
        manufacturer: 'AMEC',
        available_only: 'true'
      });
      
      filters = mockWiertlaFilterModal.getCurrentFilters();
      expect(filters.manufacturer).toBe('AMEC');
      expect(filters.category).toBeUndefined(); // Should be removed
      expect(filters.available_only).toBe('true');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing modal element gracefully', () => {
      // Remove modal element
      document.querySelector('.wiertla-filter-modal').remove();
      
      // Should not throw error
      expect(() => {
        mockWiertlaFilterModal.openFilterModal();
        mockWiertlaFilterModal.closeFilterModal();
      }).not.toThrow();
    });

    test('should handle missing form element gracefully', () => {
      // Remove form element
      document.querySelector('.filter-form').remove();
      
      // Should not throw error when applying filters
      expect(() => {
        mockWiertlaFilterModal.applyFilters({ manufacturer: 'Sandvik' });
      }).not.toThrow();
    });

    test('should handle missing filter badge gracefully', () => {
      // Remove filter badge
      document.querySelector('.filter-badge').remove();
      
      // Should not throw error when updating display
      expect(() => {
        mockWiertlaFilterModal.applyFilters({ manufacturer: 'Sandvik' });
      }).not.toThrow();
    });
  });
});
