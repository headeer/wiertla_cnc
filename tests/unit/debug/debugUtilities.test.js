// Unit tests for debug utilities

// Mock the debug utility functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Debug utility object
 */
const WiertlaDebug = {
  version: '1.0.0',
  
  /**
   * Log current state
   * @returns {Object} Current state object
   */
  logState: function() {
    const state = {
      activeTabType: window.WiertlaCNC && window.WiertlaCNC.activeTabType,
      productsCount: window.WiertlaCNC && Array.isArray(window.WiertlaCNC.products) ? window.WiertlaCNC.products.length : null,
      itemsPerPage: window.itemsPerPage,
      currentPage: window.currentPage
    };
    console.table(state);
    return state;
  },

  /**
   * Get SKU prefix from SKU
   * @param {string} sku - Product SKU
   * @returns {string} SKU prefix
   */
  getSkuPrefix: function(sku) {
    try { 
      return String(sku || '').substring(0, 2).toUpperCase(); 
    } catch(_) { 
      return ''; 
    }
  },

  /**
   * Get allowed prefixes for tab type
   * @param {string} tabType - Tab type
   * @returns {Array} Array of allowed prefixes
   */
  getAllowedPrefixesForTab: function(tabType) {
    const mapping = (window.WiertlaCNC && window.WiertlaCNC.tabPrefixMapping) || {
      wiertla: ['VW','WV','PR','WW','PS','WK','WA'],
      plytki: ['PW'],
      koronki: ['KK','KW','KI','KT','KS','KA','KG']
    };
    return mapping[tabType] || [];
  },

  /**
   * Get visible row SKUs
   * @returns {Array} Array of visible SKUs
   */
  getVisibleRowSkus: function() {
    const rows = document.querySelectorAll('.wiertla-categories__table tbody tr:not([style*="display: none"])');
    return Array.from(rows).map(row => {
      const skuElement = row.querySelector('[data-sku]');
      return skuElement ? skuElement.dataset.sku : null;
    }).filter(sku => sku !== null);
  },

  /**
   * Get filter state
   * @returns {Object} Current filter state
   */
  getFilterState: function() {
    return {
      manufacturer: window.WiertlaCNC && window.WiertlaCNC.filters ? window.WiertlaCNC.filters.manufacturer : null,
      search: window.WiertlaCNC && window.WiertlaCNC.filters ? window.WiertlaCNC.filters.search : null,
      category: window.WiertlaCNC && window.WiertlaCNC.filters ? window.WiertlaCNC.filters.category : null
    };
  },

  /**
   * Validate product data
   * @param {Object} product - Product object
   * @returns {Object} Validation result
   */
  validateProduct: function(product) {
    const errors = [];
    const warnings = [];

    if (!product) {
      errors.push('Product is null or undefined');
      return { valid: false, errors, warnings };
    }

    if (!product.sku && !product.custom_symbol && !product.custom_kod_producenta) {
      errors.push('Product missing SKU, custom_symbol, and custom_kod_producenta');
    }

    if (!product.title) {
      warnings.push('Product missing title');
    }

    if (!product.vendor) {
      warnings.push('Product missing vendor');
    }

    if (product.price === undefined || product.price === null) {
      warnings.push('Product missing price');
    }

    if (product.available === undefined || product.available === null) {
      warnings.push('Product missing availability status');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  },

  /**
   * Get performance metrics
   * @returns {Object} Performance metrics
   */
  getPerformanceMetrics: function() {
    const metrics = {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    };

    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      metrics.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      metrics.domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    }

    if (window.performance && window.performance.memory) {
      metrics.memoryUsage = {
        used: window.performance.memory.usedJSHeapSize,
        total: window.performance.memory.totalJSHeapSize,
        limit: window.performance.memory.jsHeapSizeLimit
      };
    }

    return metrics;
  },

  /**
   * Log error with context
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logError: function(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context
    };

    console.error('Wiertla Debug Error:', errorInfo);
    return errorInfo;
  },

  /**
   * Check if debug mode is enabled
   * @returns {boolean} True if debug mode is enabled
   */
  isDebugMode: function() {
    return localStorage.getItem('wiertla-debug') === 'true' || 
           window.location.search.includes('debug=true');
  },

  /**
   * Enable debug mode
   */
  enableDebugMode: function() {
    localStorage.setItem('wiertla-debug', 'true');
    console.log('Wiertla Debug Mode Enabled');
  },

  /**
   * Disable debug mode
   */
  disableDebugMode: function() {
    localStorage.removeItem('wiertla-debug');
    console.log('Wiertla Debug Mode Disabled');
  }
};

describe('Debug Utilities', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'table').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    
    // Reset global objects
    window.WiertlaCNC = {
      activeTabType: 'wiertla',
      products: [
        { id: 1, sku: 'VW.123' },
        { id: 2, sku: 'PD.456' }
      ],
      tabPrefixMapping: {
        wiertla: ['VW','WV','PR','WW','PS','WK','WA'],
        plytki: ['PW'],
        koronki: ['KK','KW','KI','KT','KS','KA','KG']
      },
      filters: {
        manufacturer: 'Sandvik',
        search: 'test',
        category: 'koronkowe'
      }
    };
    
    window.itemsPerPage = 25;
    window.currentPage = 1;
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    jest.restoreAllMocks();
  });

  describe('logState', () => {
    test('should log current state and return state object', () => {
      const state = WiertlaDebug.logState();
      
      expect(consoleSpy).toHaveBeenCalledWith(state);
      expect(state).toEqual({
        activeTabType: 'wiertla',
        productsCount: 2,
        itemsPerPage: 25,
        currentPage: 1
      });
    });

    test('should handle missing WiertlaCNC object', () => {
      window.WiertlaCNC = null;
      
      const state = WiertlaDebug.logState();
      
      expect(state).toEqual({
        activeTabType: null,
        productsCount: null,
        itemsPerPage: 25,
        currentPage: 1
      });
    });

    test('should handle missing products array', () => {
      window.WiertlaCNC.products = null;
      
      const state = WiertlaDebug.logState();
      
      expect(state.productsCount).toBe(null);
    });
  });

  describe('getSkuPrefix', () => {
    test('should extract SKU prefix correctly', () => {
      expect(WiertlaDebug.getSkuPrefix('VW.123')).toBe('VW');
      expect(WiertlaDebug.getSkuPrefix('PD.456')).toBe('PD');
      expect(WiertlaDebug.getSkuPrefix('KK.789')).toBe('KK');
    });

    test('should handle short SKUs', () => {
      expect(WiertlaDebug.getSkuPrefix('V')).toBe('V');
      expect(WiertlaDebug.getSkuPrefix('VW')).toBe('VW');
    });

    test('should handle null/undefined SKUs', () => {
      expect(WiertlaDebug.getSkuPrefix(null)).toBe('');
      expect(WiertlaDebug.getSkuPrefix(undefined)).toBe('');
      expect(WiertlaDebug.getSkuPrefix('')).toBe('');
    });

    test('should handle non-string inputs', () => {
      expect(WiertlaDebug.getSkuPrefix(123)).toBe('12');
      expect(WiertlaDebug.getSkuPrefix({})).toBe('[O');
    });
  });

  describe('getAllowedPrefixesForTab', () => {
    test('should return correct prefixes for wiertla tab', () => {
      const prefixes = WiertlaDebug.getAllowedPrefixesForTab('wiertla');
      expect(prefixes).toEqual(['VW','WV','PR','WW','PS','WK','WA']);
    });

    test('should return correct prefixes for plytki tab', () => {
      const prefixes = WiertlaDebug.getAllowedPrefixesForTab('plytki');
      expect(prefixes).toEqual(['PW']);
    });

    test('should return correct prefixes for koronki tab', () => {
      const prefixes = WiertlaDebug.getAllowedPrefixesForTab('koronki');
      expect(prefixes).toEqual(['KK','KW','KI','KT','KS','KA','KG']);
    });

    test('should return empty array for unknown tab type', () => {
      const prefixes = WiertlaDebug.getAllowedPrefixesForTab('unknown');
      expect(prefixes).toEqual([]);
    });

    test('should handle missing WiertlaCNC object', () => {
      window.WiertlaCNC = null;
      
      const prefixes = WiertlaDebug.getAllowedPrefixesForTab('wiertla');
      expect(prefixes).toEqual(['VW','WV','PR','WW','PS','WK','WA']);
    });
  });

  describe('getVisibleRowSkus', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <table class="wiertla-categories__table">
          <tbody>
            <tr data-sku="VW.123">
              <td data-sku="VW.123">Product 1</td>
            </tr>
            <tr data-sku="PD.456" style="display: none">
              <td data-sku="PD.456">Product 2</td>
            </tr>
            <tr data-sku="KK.789">
              <td data-sku="KK.789">Product 3</td>
            </tr>
          </tbody>
        </table>
      `;
    });

    test('should return visible row SKUs', () => {
      const skus = WiertlaDebug.getVisibleRowSkus();
      expect(skus).toEqual(['VW.123', 'KK.789']);
    });

    test('should handle missing table', () => {
      document.body.innerHTML = '';
      
      const skus = WiertlaDebug.getVisibleRowSkus();
      expect(skus).toEqual([]);
    });

    test('should handle rows without SKU data', () => {
      document.body.innerHTML = `
        <table class="wiertla-categories__table">
          <tbody>
            <tr>
              <td>Product without SKU</td>
            </tr>
          </tbody>
        </table>
      `;
      
      const skus = WiertlaDebug.getVisibleRowSkus();
      expect(skus).toEqual([]);
    });
  });

  describe('getFilterState', () => {
    test('should return current filter state', () => {
      const filterState = WiertlaDebug.getFilterState();
      
      expect(filterState).toEqual({
        manufacturer: 'Sandvik',
        search: 'test',
        category: 'koronkowe'
      });
    });

    test('should handle missing WiertlaCNC object', () => {
      window.WiertlaCNC = null;
      
      const filterState = WiertlaDebug.getFilterState();
      
      expect(filterState).toEqual({
        manufacturer: null,
        search: null,
        category: null
      });
    });

    test('should handle missing filters object', () => {
      window.WiertlaCNC.filters = null;
      
      const filterState = WiertlaDebug.getFilterState();
      
      expect(filterState).toEqual({
        manufacturer: null,
        search: null,
        category: null
      });
    });
  });

  describe('validateProduct', () => {
    test('should validate complete product', () => {
      const product = {
        sku: 'VW.123',
        title: 'Test Product',
        vendor: 'Sandvik',
        price: 10000,
        available: true
      };
      
      const result = WiertlaDebug.validateProduct(product);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    test('should detect missing SKU', () => {
      const product = {
        title: 'Test Product',
        vendor: 'Sandvik'
      };
      
      const result = WiertlaDebug.validateProduct(product);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Product missing SKU, custom_symbol, and custom_kod_producenta');
    });

    test('should detect missing title', () => {
      const product = {
        sku: 'VW.123',
        vendor: 'Sandvik'
      };
      
      const result = WiertlaDebug.validateProduct(product);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Product missing title');
    });

    test('should detect missing vendor', () => {
      const product = {
        sku: 'VW.123',
        title: 'Test Product'
      };
      
      const result = WiertlaDebug.validateProduct(product);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Product missing vendor');
    });

    test('should detect missing price', () => {
      const product = {
        sku: 'VW.123',
        title: 'Test Product',
        vendor: 'Sandvik'
      };
      
      const result = WiertlaDebug.validateProduct(product);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Product missing price');
    });

    test('should detect missing availability', () => {
      const product = {
        sku: 'VW.123',
        title: 'Test Product',
        vendor: 'Sandvik',
        price: 10000
      };
      
      const result = WiertlaDebug.validateProduct(product);
      
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain('Product missing availability status');
    });

    test('should handle null product', () => {
      const result = WiertlaDebug.validateProduct(null);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Product is null or undefined');
    });
  });

  describe('getPerformanceMetrics', () => {
    test('should return basic performance metrics', () => {
      const metrics = WiertlaDebug.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('timestamp');
      expect(metrics).toHaveProperty('userAgent');
      expect(metrics).toHaveProperty('language');
      expect(metrics).toHaveProperty('platform');
      expect(typeof metrics.timestamp).toBe('number');
    });

    test('should include timing data if available', () => {
      // Mock performance.timing using Object.defineProperty
      const originalPerformance = window.performance;
      
      Object.defineProperty(window, 'performance', {
        value: {
          timing: {
            navigationStart: 1000,
            domContentLoadedEventEnd: 1500,
            loadEventEnd: 2000
          },
          memory: undefined
        },
        writable: true,
        configurable: true
      });
      
      const metrics = WiertlaDebug.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('pageLoadTime');
      expect(metrics).toHaveProperty('domContentLoadedTime');
      expect(typeof metrics.pageLoadTime).toBe('number');
      expect(typeof metrics.domContentLoadedTime).toBe('number');
      expect(metrics.pageLoadTime).toBe(1000);
      expect(metrics.domContentLoadedTime).toBe(500);
      
      // Restore original performance
      Object.defineProperty(window, 'performance', {
        value: originalPerformance,
        writable: true,
        configurable: true
      });
    });

    test('should include memory data if available', () => {
      // Mock performance.memory using Object.defineProperty
      const originalPerformance = window.performance;
      
      Object.defineProperty(window, 'performance', {
        value: {
          timing: undefined,
          memory: {
            usedJSHeapSize: 1000000,
            totalJSHeapSize: 2000000,
            jsHeapSizeLimit: 5000000
          }
        },
        writable: true,
        configurable: true
      });
      
      const metrics = WiertlaDebug.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('memoryUsage');
      expect(metrics.memoryUsage).toEqual({
        used: 1000000,
        total: 2000000,
        limit: 5000000
      });
      
      // Restore original performance
      Object.defineProperty(window, 'performance', {
        value: originalPerformance,
        writable: true,
        configurable: true
      });
    });
  });

  describe('logError', () => {
    test('should log error with context', () => {
      const error = new Error('Test error');
      const context = { userId: 123, action: 'test' };
      
      const errorInfo = WiertlaDebug.logError(error, context);
      
      expect(console.error).toHaveBeenCalledWith('Wiertla Debug Error:', errorInfo);
      expect(errorInfo).toHaveProperty('message', 'Test error');
      expect(errorInfo).toHaveProperty('stack');
      expect(errorInfo).toHaveProperty('timestamp');
      expect(errorInfo).toHaveProperty('url');
      expect(errorInfo).toHaveProperty('userAgent');
      expect(errorInfo).toHaveProperty('context', context);
    });

    test('should handle error without context', () => {
      const error = new Error('Test error');
      
      const errorInfo = WiertlaDebug.logError(error);
      
      expect(errorInfo.context).toEqual({});
    });
  });

  describe('Debug Mode', () => {
    test('should check debug mode from localStorage', () => {
      localStorage.setItem('wiertla-debug', 'true');
      expect(WiertlaDebug.isDebugMode()).toBe(true);
      
      localStorage.removeItem('wiertla-debug');
      expect(WiertlaDebug.isDebugMode()).toBe(false);
    });

    test('should check debug mode from URL', () => {
      // Mock window.location.search
      Object.defineProperty(window, 'location', {
        value: { search: '?debug=true' },
        writable: true
      });
      
      expect(WiertlaDebug.isDebugMode()).toBe(true);
    });

    test('should enable debug mode', () => {
      WiertlaDebug.enableDebugMode();
      
      expect(localStorage.getItem('wiertla-debug')).toBe('true');
      expect(console.log).toHaveBeenCalledWith('Wiertla Debug Mode Enabled');
    });

    test('should disable debug mode', () => {
      localStorage.setItem('wiertla-debug', 'true');
      
      WiertlaDebug.disableDebugMode();
      
      expect(localStorage.getItem('wiertla-debug')).toBe(null);
      expect(console.log).toHaveBeenCalledWith('Wiertla Debug Mode Disabled');
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete debug workflow', () => {
      // Enable debug mode
      WiertlaDebug.enableDebugMode();
      expect(WiertlaDebug.isDebugMode()).toBe(true);
      
      // Log state
      const state = WiertlaDebug.logState();
      expect(state).toBeDefined();
      
      // Get filter state
      const filterState = WiertlaDebug.getFilterState();
      expect(filterState).toBeDefined();
      
      // Get performance metrics
      const metrics = WiertlaDebug.getPerformanceMetrics();
      expect(metrics).toBeDefined();
      
      // Disable debug mode
      WiertlaDebug.disableDebugMode();
      expect(WiertlaDebug.isDebugMode()).toBe(false);
    });

    test('should handle error logging workflow', () => {
      const error = new Error('Test error');
      const context = { component: 'test' };
      
      const errorInfo = WiertlaDebug.logError(error, context);
      
      expect(errorInfo).toBeDefined();
      expect(errorInfo.message).toBe('Test error');
      expect(errorInfo.context).toEqual(context);
    });
  });
});
