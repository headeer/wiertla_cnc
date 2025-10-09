// Unit tests for product filtering logic

import { 
  createMockProduct, 
  createMockProducts, 
  createMockProductsByCategory,
  createMockProductsByManufacturer 
} from '../../fixtures/productFactory.js';
import { mockWiertlaCNC } from '../../helpers/testHelpers.js';

// Mock the filtering functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Filters products by SKU prefix
 * @param {Array} products - Array of products
 * @param {string} prefix - SKU prefix to filter by
 * @returns {Array} Filtered products
 */
const filterByPrefix = (products, prefix) => {
  return products.filter(product => {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    return sku.toUpperCase().startsWith(prefix.toUpperCase());
  });
};

/**
 * Filters products by manufacturer
 * @param {Array} products - Array of products
 * @param {string} manufacturer - Manufacturer to filter by
 * @returns {Array} Filtered products
 */
const filterByManufacturer = (products, manufacturer) => {
  return products.filter(product => {
    const productVendor = (product.vendor || '').toString().trim();
    return productVendor.toLowerCase() === manufacturer.toLowerCase();
  });
};

/**
 * Filters products by availability
 * @param {Array} products - Array of products
 * @returns {Array} Available products
 */
const filterAvailable = (products) => {
  return products.filter(product => {
    if (!product) return false;
    
    // Check main inventory
    if (product.inventory_quantity > 0) return true;
    
    // Check variants inventory
    if (Array.isArray(product.variants)) {
      return product.variants.some(variant => variant.inventory_quantity > 0);
    }
    
    return false;
  });
};

/**
 * Filters products by category
 * @param {Array} products - Array of products
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered products
 */
const filterByCategory = (products, category) => {
  return products.filter(product => {
    const productCategory = product.custom_category || '';
    return productCategory.toLowerCase() === category.toLowerCase();
  });
};

/**
 * Gets SKU prefix from product
 * @param {Object} product - Product object
 * @returns {string} SKU prefix
 */
const getSkuPrefix = (product) => {
  try {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    return sku.substring(0, 2).toUpperCase();
  } catch (_) {
    return '';
  }
};

describe('Product Filtering Logic', () => {
  beforeEach(() => {
    // Reset global state before each test
    mockWiertlaCNC();
  });

  describe('filterByPrefix', () => {
    test('should filter products by SKU prefix correctly', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'PD.456', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'KK.789', vendor: 'Walter' })
      ];
      
      const wiertlaProducts = filterByPrefix(products, 'VW');
      expect(wiertlaProducts).toHaveLength(1);
      expect(wiertlaProducts[0].sku).toBe('VW.123');
    });

    test('should handle case insensitive prefix matching', () => {
      const products = [
        createMockProduct({ sku: 'vw.123', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'VW.456', vendor: 'Walter' })
      ];
      
      const wiertlaProducts = filterByPrefix(products, 'vw');
      expect(wiertlaProducts).toHaveLength(2);
    });

    test('should work with custom_symbol when sku is missing', () => {
      const products = [
        createMockProduct({ sku: '', custom_symbol: 'VW.123', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'PD.456', vendor: 'Sandvik' })
      ];
      
      const wiertlaProducts = filterByPrefix(products, 'VW');
      expect(wiertlaProducts).toHaveLength(1);
      expect(wiertlaProducts[0].custom_symbol).toBe('VW.123');
    });

    test('should work with custom_kod_producenta when other fields are missing', () => {
      const products = [
        createMockProduct({ 
          sku: '', 
          custom_symbol: '', 
          custom_kod_producenta: 'VW.123', 
          vendor: 'Sandvik' 
        }),
        createMockProduct({ sku: 'PD.456', vendor: 'Sandvik' })
      ];
      
      const wiertlaProducts = filterByPrefix(products, 'VW');
      expect(wiertlaProducts).toHaveLength(1);
      expect(wiertlaProducts[0].custom_kod_producenta).toBe('VW.123');
    });

    test('should return empty array when no products match prefix', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'PD.456', vendor: 'Sandvik' })
      ];
      
      const koronkiProducts = filterByPrefix(products, 'KK');
      expect(koronkiProducts).toHaveLength(0);
    });
  });

  describe('filterByManufacturer', () => {
    test('should filter products by manufacturer correctly', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'PD.456', vendor: 'Walter' }),
        createMockProduct({ sku: 'KK.789', vendor: 'Sandvik' })
      ];
      
      const sandvikProducts = filterByManufacturer(products, 'Sandvik');
      expect(sandvikProducts).toHaveLength(2);
      expect(sandvikProducts.every(p => p.vendor === 'Sandvik')).toBe(true);
    });

    test('should handle case insensitive manufacturer matching', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', vendor: 'sandvik' }),
        createMockProduct({ sku: 'PD.456', vendor: 'SANDVIK' }),
        createMockProduct({ sku: 'KK.789', vendor: 'Walter' })
      ];
      
      const sandvikProducts = filterByManufacturer(products, 'Sandvik');
      expect(sandvikProducts).toHaveLength(2);
    });

    test('should handle empty vendor field', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', vendor: '' }),
        createMockProduct({ sku: 'PD.456', vendor: 'Sandvik' })
      ];
      
      const sandvikProducts = filterByManufacturer(products, 'Sandvik');
      expect(sandvikProducts).toHaveLength(1);
    });

    test('should return empty array when no products match manufacturer', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', vendor: 'Sandvik' }),
        createMockProduct({ sku: 'PD.456', vendor: 'Walter' })
      ];
      
      const iscarProducts = filterByManufacturer(products, 'ISCAR');
      expect(iscarProducts).toHaveLength(0);
    });
  });

  describe('filterAvailable', () => {
    test('should filter out products with no inventory', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', inventory_quantity: 5, available: true }),
        createMockProduct({ 
          sku: 'PD.456', 
          inventory_quantity: 0, 
          available: false,
          variants: [{ id: 1, sku: 'PD.456', inventory_quantity: 0, available: false }]
        }),
        createMockProduct({ sku: 'KK.789', inventory_quantity: 10, available: true })
      ];
      
      const availableProducts = filterAvailable(products);
      expect(availableProducts).toHaveLength(2);
      expect(availableProducts.every(p => p.inventory_quantity > 0)).toBe(true);
    });

    test('should include products with variant inventory', () => {
      const products = [
        createMockProduct({ 
          sku: 'VW.123', 
          inventory_quantity: 0,
          variants: [
            { inventory_quantity: 5, available: true }
          ]
        }),
        createMockProduct({ 
          sku: 'PD.456', 
          inventory_quantity: 0,
          variants: [
            { inventory_quantity: 0, available: false }
          ]
        })
      ];
      
      const availableProducts = filterAvailable(products);
      expect(availableProducts).toHaveLength(1);
      expect(availableProducts[0].sku).toBe('VW.123');
    });

    test('should handle products with no variants', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', inventory_quantity: 5, variants: [] }),
        createMockProduct({ sku: 'PD.456', inventory_quantity: 0, variants: [] })
      ];
      
      const availableProducts = filterAvailable(products);
      expect(availableProducts).toHaveLength(1);
      expect(availableProducts[0].sku).toBe('VW.123');
    });

    test('should handle null/undefined products', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', inventory_quantity: 5 }),
        null,
        undefined,
        createMockProduct({ 
          sku: 'PD.456', 
          inventory_quantity: 0,
          variants: [{ id: 1, sku: 'PD.456', inventory_quantity: 0, available: false }]
        })
      ];
      
      const availableProducts = filterAvailable(products);
      expect(availableProducts).toHaveLength(1);
      expect(availableProducts[0].sku).toBe('VW.123');
    });
  });

  describe('filterByCategory', () => {
    test('should filter products by category correctly', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', custom_category: 'koronkowe' }),
        createMockProduct({ sku: 'PD.456', custom_category: 'plytkowe' }),
        createMockProduct({ sku: 'KK.789', custom_category: 'koronkowe' })
      ];
      
      const koronkoweProducts = filterByCategory(products, 'koronkowe');
      expect(koronkoweProducts).toHaveLength(2);
      expect(koronkoweProducts.every(p => p.custom_category === 'koronkowe')).toBe(true);
    });

    test('should handle case insensitive category matching', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', custom_category: 'KORONKOWE' }),
        createMockProduct({ sku: 'PD.456', custom_category: 'koronkowe' })
      ];
      
      const koronkoweProducts = filterByCategory(products, 'KORONKOWE');
      expect(koronkoweProducts).toHaveLength(2);
    });

    test('should handle empty category field', () => {
      const products = [
        createMockProduct({ sku: 'VW.123', custom_category: '' }),
        createMockProduct({ sku: 'PD.456', custom_category: 'koronkowe' })
      ];
      
      const koronkoweProducts = filterByCategory(products, 'koronkowe');
      expect(koronkoweProducts).toHaveLength(1);
    });
  });

  describe('getSkuPrefix', () => {
    test('should extract SKU prefix correctly', () => {
      const product = createMockProduct({ sku: 'VW.123' });
      expect(getSkuPrefix(product)).toBe('VW');
    });

    test('should handle custom_symbol when sku is missing', () => {
      const product = createMockProduct({ sku: '', custom_symbol: 'PD.456' });
      expect(getSkuPrefix(product)).toBe('PD');
    });

    test('should handle custom_kod_producenta when other fields are missing', () => {
      const product = createMockProduct({ 
        sku: '', 
        custom_symbol: '', 
        custom_kod_producenta: 'KK.789' 
      });
      expect(getSkuPrefix(product)).toBe('KK');
    });

    test('should return empty string for invalid input', () => {
      const product = createMockProduct({ sku: '', custom_symbol: '', custom_kod_producenta: '' });
      expect(getSkuPrefix(product)).toBe('');
    });

    test('should handle null/undefined product', () => {
      expect(getSkuPrefix(null)).toBe('');
      expect(getSkuPrefix(undefined)).toBe('');
    });
  });

  describe('Integration Tests', () => {
    test('should filter products by multiple criteria', () => {
      const products = [
        createMockProduct({ 
          sku: 'VW.123', 
          vendor: 'Sandvik', 
          custom_category: 'koronkowe',
          inventory_quantity: 5
        }),
        createMockProduct({ 
          sku: 'VW.456', 
          vendor: 'Walter', 
          custom_category: 'koronkowe',
          inventory_quantity: 3
        }),
        createMockProduct({ 
          sku: 'PD.789', 
          vendor: 'Sandvik', 
          custom_category: 'plytkowe',
          inventory_quantity: 0
        })
      ];
      
      // Filter by prefix, manufacturer, and availability
      let filtered = filterByPrefix(products, 'VW');
      filtered = filterByManufacturer(filtered, 'Sandvik');
      filtered = filterAvailable(filtered);
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VW.123');
    });

    test('should work with real-world product data structure', () => {
      const productsByCategory = createMockProductsByCategory();
      const allProducts = [
        ...productsByCategory.wiertla,
        ...productsByCategory.plytki,
        ...productsByCategory.koronki
      ];
      
      // Filter wiertla products
      const wiertlaProducts = filterByPrefix(allProducts, 'VW');
      expect(wiertlaProducts.length).toBeGreaterThan(0);
      expect(wiertlaProducts.every(p => p.sku.startsWith('VW'))).toBe(true);
      
      // Filter plytki products
      const plytkiProducts = filterByPrefix(allProducts, 'PW');
      expect(plytkiProducts.length).toBeGreaterThan(0);
      expect(plytkiProducts.every(p => p.sku.startsWith('PW'))).toBe(true);
    });
  });
});
