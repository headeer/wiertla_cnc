// Integration tests for filter interactions

import { 
  createMockProduct, 
  createMockProducts, 
  createMockProductsByManufacturer 
} from '../../fixtures/productFactory.js';
import { 
  createMockDOM, 
  simulateClick, 
  simulateChange, 
  waitForElement,
  mockWiertlaCNC,
  mockWiertlaTranslations 
} from '../../helpers/testHelpers.js';

// Mock the filter interaction functions that would be extracted from the main code
// These test the integration between UI interactions and filtering logic

/**
 * Creates a filter interface with dropdowns and search
 * @param {Array} products - Products to filter
 * @returns {HTMLElement} Filter interface element
 */
const createFilterInterface = (products) => {
  const container = document.createElement('div');
  container.className = 'wiertla-categories__filters';
  
  container.innerHTML = `
    <div class="wiertla-categories__filters-left">
      <select class="wiertla-categories__filter" data-filter="manufacturer">
        <option value="">Producent</option>
        <option value="Sandvik">SANDVIK</option>
        <option value="Walter">WALTER</option>
        <option value="ISCAR">ISCAR</option>
        <option value="KENNAMETAL">KENNAMETAL</option>
        <option value="DSK">DSK</option>
        <option value="AMEC">AMEC</option>
      </select>
      
      <select class="wiertla-categories__filter" data-filter="category">
        <option value="">Kategoria</option>
        <option value="koronkowe">Koronkowe</option>
        <option value="plytkowe">Płytkowe</option>
        <option value="vhm">VHM</option>
        <option value="sandvik">Sandvik</option>
        <option value="ksem">KSEM</option>
        <option value="amec">AMEC</option>
      </select>
      
      <input type="text" class="wiertla-categories__filter" data-filter="search" placeholder="Szukaj...">
      
      <button class="wiertla-categories__filter-btn" data-action="reset">Resetuj filtry</button>
    </div>
    
    <div class="wiertla-categories__filters-right">
      <select class="wiertla-categories__filter" data-filter="perPage">
        <option value="25">25 na stronę</option>
        <option value="50" selected>50 na stronę</option>
        <option value="100">100 na stronę</option>
      </select>
    </div>
  `;
  
  return container;
};

/**
 * Applies filters to products
 * @param {Array} products - Products to filter
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered products
 */
const applyFilters = (products, filters) => {
  let filtered = [...products];
  
  // Manufacturer filter
  if (filters.manufacturer && filters.manufacturer !== '') {
    filtered = filtered.filter(product => 
      (product.vendor || '').toLowerCase() === filters.manufacturer.toLowerCase()
    );
  }
  
  // Category filter
  if (filters.category && filters.category !== '') {
    filtered = filtered.filter(product => 
      (product.custom_category || '').toLowerCase() === filters.category.toLowerCase()
    );
  }
  
  // Search filter
  if (filters.search && filters.search.trim() !== '') {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(product => {
      const searchableText = [
        product.title,
        product.sku,
        product.custom_symbol,
        product.custom_kod_producenta,
        product.vendor
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
  }
  
  return filtered;
};

/**
 * Updates filter UI state
 * @param {HTMLElement} filterInterface - Filter interface element
 * @param {Object} filters - Current filter values
 */
const updateFilterUI = (filterInterface, filters) => {
  // Update manufacturer filter
  const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
  if (manufacturerSelect) {
    manufacturerSelect.value = filters.manufacturer || '';
  }
  
  // Update category filter
  const categorySelect = filterInterface.querySelector('[data-filter="category"]');
  if (categorySelect) {
    categorySelect.value = filters.category || '';
  }
  
  // Update search input
  const searchInput = filterInterface.querySelector('[data-filter="search"]');
  if (searchInput) {
    searchInput.value = filters.search || '';
  }
  
  // Update per page filter
  const perPageSelect = filterInterface.querySelector('[data-filter="perPage"]');
  if (perPageSelect) {
    perPageSelect.value = filters.perPage || '50';
  }
};

/**
 * Resets all filters to default values
 * @param {HTMLElement} filterInterface - Filter interface element
 * @returns {Object} Reset filter values
 */
const resetFilters = (filterInterface) => {
  const resetValues = {
    manufacturer: '',
    category: '',
    search: '',
    perPage: '50'
  };
  
  updateFilterUI(filterInterface, resetValues);
  return resetValues;
};

/**
 * Gets current filter values from UI
 * @param {HTMLElement} filterInterface - Filter interface element
 * @returns {Object} Current filter values
 */
const getCurrentFilters = (filterInterface) => {
  return {
    manufacturer: filterInterface.querySelector('[data-filter="manufacturer"]')?.value || '',
    category: filterInterface.querySelector('[data-filter="category"]')?.value || '',
    search: filterInterface.querySelector('[data-filter="search"]')?.value || '',
    perPage: filterInterface.querySelector('[data-filter="perPage"]')?.value || '50'
  };
};

/**
 * Sets up filter event listeners
 * @param {HTMLElement} filterInterface - Filter interface element
 * @param {Function} onFilterChange - Callback for filter changes
 */
const setupFilterListeners = (filterInterface, onFilterChange) => {
  // Manufacturer filter
  const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
  if (manufacturerSelect) {
    manufacturerSelect.addEventListener('change', () => {
      const filters = getCurrentFilters(filterInterface);
      onFilterChange(filters);
    });
  }
  
  // Category filter
  const categorySelect = filterInterface.querySelector('[data-filter="category"]');
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      const filters = getCurrentFilters(filterInterface);
      onFilterChange(filters);
    });
  }
  
  // Search input
  const searchInput = filterInterface.querySelector('[data-filter="search"]');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const filters = getCurrentFilters(filterInterface);
        onFilterChange(filters);
      }, 300); // Debounce search
    });
  }
  
  // Per page filter
  const perPageSelect = filterInterface.querySelector('[data-filter="perPage"]');
  if (perPageSelect) {
    perPageSelect.addEventListener('change', () => {
      const filters = getCurrentFilters(filterInterface);
      onFilterChange(filters);
    });
  }
  
  // Reset button
  const resetButton = filterInterface.querySelector('[data-action="reset"]');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      const resetValues = resetFilters(filterInterface);
      onFilterChange(resetValues);
    });
  }
};

describe('Filter Interactions Integration', () => {
  let mockProducts;
  let filterInterface;
  
  beforeEach(() => {
    // Reset DOM and global state
    document.body.innerHTML = '';
    mockWiertlaCNC();
    mockWiertlaTranslations();
    
    // Create mock products
    mockProducts = [
      createMockProduct({ 
        id: 1, 
        sku: 'VW.123', 
        vendor: 'Sandvik', 
        custom_category: 'koronkowe',
        title: 'Koronka VW Test'
      }),
      createMockProduct({ 
        id: 2, 
        sku: 'PD.456', 
        vendor: 'Sandvik', 
        custom_category: 'plytkowe',
        title: 'Płytka PD Test'
      }),
      createMockProduct({ 
        id: 3, 
        sku: 'KK.789', 
        vendor: 'Walter', 
        custom_category: 'koronkowe',
        title: 'Koronka KK Test'
      }),
      createMockProduct({ 
        id: 4, 
        sku: 'WA.012', 
        vendor: 'AMEC', 
        custom_category: 'amec',
        title: 'Wiertło WA Test'
      })
    ];
    
    // Create filter interface
    filterInterface = createFilterInterface(mockProducts);
    document.body.appendChild(filterInterface);
  });

  describe('createFilterInterface', () => {
    test('should create filter interface with all required elements', () => {
      expect(filterInterface).toBeTruthy();
      expect(filterInterface.className).toBe('wiertla-categories__filters');
      
      // Check manufacturer filter
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      expect(manufacturerSelect).toBeTruthy();
      expect(manufacturerSelect.tagName).toBe('SELECT');
      
      // Check category filter
      const categorySelect = filterInterface.querySelector('[data-filter="category"]');
      expect(categorySelect).toBeTruthy();
      expect(categorySelect.tagName).toBe('SELECT');
      
      // Check search input
      const searchInput = filterInterface.querySelector('[data-filter="search"]');
      expect(searchInput).toBeTruthy();
      expect(searchInput.tagName).toBe('INPUT');
      
      // Check reset button
      const resetButton = filterInterface.querySelector('[data-action="reset"]');
      expect(resetButton).toBeTruthy();
      expect(resetButton.tagName).toBe('BUTTON');
      
      // Check per page filter
      const perPageSelect = filterInterface.querySelector('[data-filter="perPage"]');
      expect(perPageSelect).toBeTruthy();
      expect(perPageSelect.tagName).toBe('SELECT');
    });

    test('should have correct default values', () => {
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      const categorySelect = filterInterface.querySelector('[data-filter="category"]');
      const searchInput = filterInterface.querySelector('[data-filter="search"]');
      const perPageSelect = filterInterface.querySelector('[data-filter="perPage"]');
      
      expect(manufacturerSelect.value).toBe('');
      expect(categorySelect.value).toBe('');
      expect(searchInput.value).toBe('');
      expect(perPageSelect.value).toBe('50');
    });
  });

  describe('applyFilters', () => {
    test('should filter by manufacturer correctly', () => {
      const filters = { manufacturer: 'Sandvik' };
      const filtered = applyFilters(mockProducts, filters);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.vendor === 'Sandvik')).toBe(true);
    });

    test('should filter by category correctly', () => {
      const filters = { category: 'koronkowe' };
      const filtered = applyFilters(mockProducts, filters);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.custom_category === 'koronkowe')).toBe(true);
    });

    test('should filter by search term correctly', () => {
      const filters = { search: 'VW' };
      const filtered = applyFilters(mockProducts, filters);
      
      // Should find products that contain 'VW' in their searchable text
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.some(p => p.sku === 'VW.123')).toBe(true);
    });

    test('should filter by multiple criteria', () => {
      const filters = { 
        manufacturer: 'Sandvik',
        category: 'koronkowe'
      };
      const filtered = applyFilters(mockProducts, filters);
      
      expect(filtered.length).toBe(1);
      expect(filtered[0].vendor).toBe('Sandvik');
      expect(filtered[0].custom_category).toBe('koronkowe');
    });

    test('should handle case insensitive filtering', () => {
      const filters = { search: 'sandvik' };
      const filtered = applyFilters(mockProducts, filters);
      
      expect(filtered.length).toBe(2);
      expect(filtered.every(p => p.vendor === 'Sandvik')).toBe(true);
    });

    test('should return all products when no filters applied', () => {
      const filters = {};
      const filtered = applyFilters(mockProducts, filters);
      
      expect(filtered.length).toBe(mockProducts.length);
    });

    test('should return empty array when no products match filters', () => {
      const filters = { manufacturer: 'Nonexistent' };
      const filtered = applyFilters(mockProducts, filters);
      
      expect(filtered.length).toBe(0);
    });
  });

  describe('updateFilterUI', () => {
    test('should update filter UI with new values', () => {
      const newFilters = {
        manufacturer: 'Walter',
        category: 'koronkowe',
        search: 'test search',
        perPage: '100'
      };
      
      updateFilterUI(filterInterface, newFilters);
      
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      const categorySelect = filterInterface.querySelector('[data-filter="category"]');
      const searchInput = filterInterface.querySelector('[data-filter="search"]');
      const perPageSelect = filterInterface.querySelector('[data-filter="perPage"]');
      
      expect(manufacturerSelect.value).toBe('Walter');
      expect(categorySelect.value).toBe('koronkowe');
      expect(searchInput.value).toBe('test search');
      expect(perPageSelect.value).toBe('100');
    });

    test('should handle partial filter updates', () => {
      const partialFilters = {
        manufacturer: 'Sandvik'
      };
      
      updateFilterUI(filterInterface, partialFilters);
      
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      const categorySelect = filterInterface.querySelector('[data-filter="category"]');
      
      expect(manufacturerSelect.value).toBe('Sandvik');
      expect(categorySelect.value).toBe(''); // Should remain unchanged
    });
  });

  describe('resetFilters', () => {
    test('should reset all filters to default values', () => {
      // Set some filter values first
      updateFilterUI(filterInterface, {
        manufacturer: 'Sandvik',
        category: 'koronkowe',
        search: 'test',
        perPage: '100'
      });
      
      // Reset filters
      const resetValues = resetFilters(filterInterface);
      
      // Check that UI was reset
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      const categorySelect = filterInterface.querySelector('[data-filter="category"]');
      const searchInput = filterInterface.querySelector('[data-filter="search"]');
      const perPageSelect = filterInterface.querySelector('[data-filter="perPage"]');
      
      expect(manufacturerSelect.value).toBe('');
      expect(categorySelect.value).toBe('');
      expect(searchInput.value).toBe('');
      expect(perPageSelect.value).toBe('50');
      
      // Check return value
      expect(resetValues).toEqual({
        manufacturer: '',
        category: '',
        search: '',
        perPage: '50'
      });
    });
  });

  describe('getCurrentFilters', () => {
    test('should return current filter values from UI', () => {
      // Set some filter values
      updateFilterUI(filterInterface, {
        manufacturer: 'Walter',
        category: 'amec',
        search: 'test search',
        perPage: '25'
      });
      
      const currentFilters = getCurrentFilters(filterInterface);
      
      expect(currentFilters).toEqual({
        manufacturer: 'Walter',
        category: 'amec',
        search: 'test search',
        perPage: '25'
      });
    });

    test('should return default values when UI is not set', () => {
      const currentFilters = getCurrentFilters(filterInterface);
      
      expect(currentFilters).toEqual({
        manufacturer: '',
        category: '',
        search: '',
        perPage: '50'
      });
    });
  });

  describe('setupFilterListeners', () => {
    test('should call onFilterChange when manufacturer filter changes', (done) => {
      const onFilterChange = (filters) => {
        expect(filters.manufacturer).toBe('Sandvik');
        done();
      };
      
      setupFilterListeners(filterInterface, onFilterChange);
      
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      manufacturerSelect.value = 'Sandvik';
      manufacturerSelect.dispatchEvent(new Event('change'));
    });

    test('should call onFilterChange when category filter changes', (done) => {
      const onFilterChange = (filters) => {
        expect(filters.category).toBe('koronkowe');
        done();
      };
      
      setupFilterListeners(filterInterface, onFilterChange);
      
      const categorySelect = filterInterface.querySelector('[data-filter="category"]');
      categorySelect.value = 'koronkowe';
      categorySelect.dispatchEvent(new Event('change'));
    });

    test('should call onFilterChange when search input changes (with debounce)', (done) => {
      const onFilterChange = (filters) => {
        expect(filters.search).toBe('test search');
        done();
      };
      
      setupFilterListeners(filterInterface, onFilterChange);
      
      const searchInput = filterInterface.querySelector('[data-filter="search"]');
      searchInput.value = 'test search';
      searchInput.dispatchEvent(new Event('input'));
    });

    test('should call onFilterChange when reset button is clicked', (done) => {
      const onFilterChange = (filters) => {
        expect(filters).toEqual({
          manufacturer: '',
          category: '',
          search: '',
          perPage: '50'
        });
        done();
      };
      
      setupFilterListeners(filterInterface, onFilterChange);
      
      const resetButton = filterInterface.querySelector('[data-action="reset"]');
      resetButton.click();
    });
  });

  describe('Complete Filter Workflow Integration', () => {
    test('should handle complete filter workflow', (done) => {
      let filterChangeCount = 0;
      const onFilterChange = (filters) => {
        filterChangeCount++;
        
        if (filterChangeCount === 1) {
          // First change: manufacturer filter
          expect(filters.manufacturer).toBe('Sandvik');
          
          // Apply the filter and check results
          const filtered = applyFilters(mockProducts, filters);
          expect(filtered.length).toBe(2);
          expect(filtered.every(p => p.vendor === 'Sandvik')).toBe(true);
          
          // Trigger second filter change
          const categorySelect = filterInterface.querySelector('[data-filter="category"]');
          categorySelect.value = 'koronkowe';
          categorySelect.dispatchEvent(new Event('change'));
          
        } else if (filterChangeCount === 2) {
          // Second change: category filter
          expect(filters.manufacturer).toBe('Sandvik');
          expect(filters.category).toBe('koronkowe');
          
          // Apply combined filters
          const filtered = applyFilters(mockProducts, filters);
          expect(filtered.length).toBe(1);
          expect(filtered[0].vendor).toBe('Sandvik');
          expect(filtered[0].custom_category).toBe('koronkowe');
          
          done();
        }
      };
      
      setupFilterListeners(filterInterface, onFilterChange);
      
      // Trigger first filter change
      const manufacturerSelect = filterInterface.querySelector('[data-filter="manufacturer"]');
      manufacturerSelect.value = 'Sandvik';
      manufacturerSelect.dispatchEvent(new Event('change'));
    });

    test('should handle search with debouncing correctly', (done) => {
      let searchCallCount = 0;
      const onFilterChange = (filters) => {
        searchCallCount++;
        
        if (searchCallCount === 1) {
          expect(filters.search).toBe('final search');
          done();
        }
      };
      
      setupFilterListeners(filterInterface, onFilterChange);
      
      const searchInput = filterInterface.querySelector('[data-filter="search"]');
      
      // Type multiple characters quickly (should be debounced)
      searchInput.value = 'f';
      searchInput.dispatchEvent(new Event('input'));
      
      searchInput.value = 'fi';
      searchInput.dispatchEvent(new Event('input'));
      
      searchInput.value = 'fin';
      searchInput.dispatchEvent(new Event('input'));
      
      searchInput.value = 'final search';
      searchInput.dispatchEvent(new Event('input'));
    });
  });
});
