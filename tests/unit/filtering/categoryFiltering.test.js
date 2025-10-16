// Unit tests for category filtering logic

import { createMockProduct, createMockProducts } from '../../fixtures/productFactory.js';

// Mock the category filtering functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Category mappings for filtering
 */
const categoryMappings = {
  koronkowe: "VW",
  plytkowe: "PR", 
  vhm: "WW",
  sandvik: "PS",
  ksem: "WK",
  amec: "WA",
  wcmx: "WCMX",
  lcmx: "LCMX",
  "811": "811",
  dft: "DFT",
  "880": "880",
  wogx: "WOGX",
  spgx: "SPGX",
  p284: "P284",
  idi: "IDI",
  p600: "P600",
  icm: "ICM",
  icp: "ICP",
  "870": "870",
  ktip: "KTIP"
};

/**
 * Crown types for filtering
 */
const crownTypes = ["KK", "KI", "KS", "KT", "KA"];

/**
 * Warehouse mappings
 */
const warehouseMappings = {
  M: "Poznan",
  T: "Czechy", 
  E: "eBay",
  U: "UK"
};

/**
 * Filter products by category
 * @param {Array} products - Array of products
 * @param {string} category - Category to filter by
 * @returns {Array} Filtered products
 */
const filterByCategory = (products, category) => {
  if (category === "wszystkie") {
    return products;
  }

  const categoryCode = categoryMappings[category] || category;
  
  return products.filter(product => {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    return sku.startsWith(categoryCode);
  });
};

/**
 * Filter products by brand/manufacturer
 * @param {Array} products - Array of products
 * @param {string} brand - Brand to filter by
 * @returns {Array} Filtered products
 */
const filterByBrand = (products, brand) => {
  if (!brand) {
    return products;
  }

  const brandLower = brand.toLowerCase();
  
  return products.filter(product => {
    const vendor = (product.vendor || '').toLowerCase();
    return vendor.includes(brandLower);
  });
};

/**
 * Filter products by crown type
 * @param {Array} products - Array of products
 * @param {string} crownType - Crown type to filter by
 * @returns {Array} Filtered products
 */
const filterByCrownType = (products, crownType) => {
  if (!crownType) {
    return products;
  }

  return products.filter(product => {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    return sku.startsWith(crownType);
  });
};

/**
 * Filter products by warehouse location
 * @param {Array} products - Array of products
 * @param {string} warehouse - Warehouse to filter by
 * @returns {Array} Filtered products
 */
const filterByWarehouse = (products, warehouse) => {
  if (!warehouse) {
    return products;
  }

  return products.filter(product => {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    if (sku.length < 3) return false;
    
    const thirdChar = sku.charAt(2).toUpperCase();
    return warehouseMappings[thirdChar] === warehouse;
  });
};

/**
 * Get warehouse location from SKU
 * @param {string} sku - Product SKU
 * @returns {string|null} Warehouse location or null
 */
const getWarehouseFromSku = (sku) => {
  if (!sku || sku.length < 3) return null;
  
  const thirdChar = sku.charAt(2).toUpperCase();
  return warehouseMappings[thirdChar] || null;
};

/**
 * Get category code from category name
 * @param {string} category - Category name
 * @returns {string} Category code
 */
const getCategoryCode = (category) => {
  return categoryMappings[category] || category;
};

/**
 * Check if SKU matches crown type
 * @param {string} sku - Product SKU
 * @returns {boolean} True if SKU matches crown type
 */
const isCrownType = (sku) => {
  if (!sku) return false;
  return crownTypes.some(type => sku.startsWith(type));
};

describe('Category Filtering Logic', () => {
  let mockProducts;

  beforeEach(() => {
    mockProducts = [
      createMockProduct({ sku: 'VW.123', vendor: 'Sandvik', custom_category: 'koronkowe' }),
      createMockProduct({ sku: 'PR.456', vendor: 'Walter', custom_category: 'plytkowe' }),
      createMockProduct({ sku: 'WW.789', vendor: 'Sandvik', custom_category: 'vhm' }),
      createMockProduct({ sku: 'PS.012', vendor: 'Sandvik', custom_category: 'sandvik' }),
      createMockProduct({ sku: 'WK.345', vendor: 'Walter', custom_category: 'ksem' }),
      createMockProduct({ sku: 'WA.678', vendor: 'AMEC', custom_category: 'amec' }),
      createMockProduct({ sku: 'KK.901', vendor: 'ISCAR', custom_category: 'koronki' }),
      createMockProduct({ sku: 'KI.234', vendor: 'KENNAMETAL', custom_category: 'koronki' }),
      createMockProduct({ sku: 'VWM123', vendor: 'Sandvik', custom_category: 'koronkowe' }), // Poznan warehouse
      createMockProduct({ sku: 'VWT456', vendor: 'Walter', custom_category: 'koronkowe' }), // Czechy warehouse
      createMockProduct({ sku: 'VWE789', vendor: 'Sandvik', custom_category: 'koronkowe' }), // eBay warehouse
      createMockProduct({ sku: 'VWU012', vendor: 'Walter', custom_category: 'koronkowe' }), // UK warehouse
    ];
  });

  describe('filterByCategory', () => {
    test('should return all products when category is "wszystkie"', () => {
      const filtered = filterByCategory(mockProducts, 'wszystkie');
      expect(filtered).toHaveLength(mockProducts.length);
    });

    test('should filter by koronkowe category', () => {
      const filtered = filterByCategory(mockProducts, 'koronkowe');
      expect(filtered).toHaveLength(5); // VW.123, VWM123, VWT456, VWE789, VWU012
      expect(filtered.every(p => p.sku.startsWith('VW'))).toBe(true);
    });

    test('should filter by plytkowe category', () => {
      const filtered = filterByCategory(mockProducts, 'plytkowe');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('PR.456');
    });

    test('should filter by vhm category', () => {
      const filtered = filterByCategory(mockProducts, 'vhm');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('WW.789');
    });

    test('should filter by sandvik category', () => {
      const filtered = filterByCategory(mockProducts, 'sandvik');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('PS.012');
    });

    test('should filter by ksem category', () => {
      const filtered = filterByCategory(mockProducts, 'ksem');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('WK.345');
    });

    test('should filter by amec category', () => {
      const filtered = filterByCategory(mockProducts, 'amec');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('WA.678');
    });

    test('should handle unknown category', () => {
      const filtered = filterByCategory(mockProducts, 'unknown');
      expect(filtered).toHaveLength(0);
    });

    test('should handle empty products array', () => {
      const filtered = filterByCategory([], 'koronkowe');
      expect(filtered).toHaveLength(0);
    });

    test('should handle products with missing SKU', () => {
      const productsWithMissingSku = [
        createMockProduct({ sku: null, custom_symbol: 'VW.123', custom_category: 'koronkowe' }),
        createMockProduct({ sku: '', custom_symbol: 'PR.456', custom_kod_producenta: 'PR.456', custom_category: 'plytkowe' })
      ];
      
      const filtered = filterByCategory(productsWithMissingSku, 'koronkowe');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].custom_symbol).toBe('VW.123');
    });
  });

  describe('filterByBrand', () => {
    test('should return all products when no brand specified', () => {
      const filtered = filterByBrand(mockProducts, '');
      expect(filtered).toHaveLength(mockProducts.length);
    });

    test('should filter by Sandvik brand', () => {
      const filtered = filterByBrand(mockProducts, 'Sandvik');
      expect(filtered).toHaveLength(5);
      expect(filtered.every(p => p.vendor === 'Sandvik')).toBe(true);
    });

    test('should filter by Walter brand', () => {
      const filtered = filterByBrand(mockProducts, 'Walter');
      expect(filtered).toHaveLength(4);
      expect(filtered.every(p => p.vendor === 'Walter')).toBe(true);
    });

    test('should filter by AMEC brand', () => {
      const filtered = filterByBrand(mockProducts, 'AMEC');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].vendor).toBe('AMEC');
    });

    test('should handle case insensitive brand filtering', () => {
      const filtered = filterByBrand(mockProducts, 'sandvik');
      expect(filtered).toHaveLength(5);
      expect(filtered.every(p => p.vendor === 'Sandvik')).toBe(true);
    });

    test('should handle partial brand matching', () => {
      const filtered = filterByBrand(mockProducts, 'Sand');
      expect(filtered).toHaveLength(5);
      expect(filtered.every(p => p.vendor === 'Sandvik')).toBe(true);
    });

    test('should return empty array for unknown brand', () => {
      const filtered = filterByBrand(mockProducts, 'UnknownBrand');
      expect(filtered).toHaveLength(0);
    });

    test('should handle products with missing vendor', () => {
      const productsWithMissingVendor = [
        createMockProduct({ vendor: null }),
        createMockProduct({ vendor: '' }),
        createMockProduct({ vendor: 'Sandvik' })
      ];
      
      const filtered = filterByBrand(productsWithMissingVendor, 'Sandvik');
      expect(filtered).toHaveLength(1);
    });
  });

  describe('filterByCrownType', () => {
    test('should return all products when no crown type specified', () => {
      const filtered = filterByCrownType(mockProducts, '');
      expect(filtered).toHaveLength(mockProducts.length);
    });

    test('should filter by KK crown type', () => {
      const filtered = filterByCrownType(mockProducts, 'KK');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('KK.901');
    });

    test('should filter by KI crown type', () => {
      const filtered = filterByCrownType(mockProducts, 'KI');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('KI.234');
    });

    test('should return empty array for non-crown products', () => {
      const nonCrownProducts = [
        createMockProduct({ sku: 'VW.123' }),
        createMockProduct({ sku: 'PR.456' }),
        createMockProduct({ sku: 'WW.789' })
      ];
      
      const filtered = filterByCrownType(nonCrownProducts, 'KK');
      expect(filtered).toHaveLength(0);
    });

    test('should handle products with missing SKU', () => {
      const productsWithMissingSku = [
        createMockProduct({ sku: null }),
        createMockProduct({ sku: 'KK.123' })
      ];
      
      const filtered = filterByCrownType(productsWithMissingSku, 'KK');
      expect(filtered).toHaveLength(1);
    });
  });

  describe('filterByWarehouse', () => {
    test('should return all products when no warehouse specified', () => {
      const filtered = filterByWarehouse(mockProducts, '');
      expect(filtered).toHaveLength(mockProducts.length);
    });

    test('should filter by Poznan warehouse', () => {
      const filtered = filterByWarehouse(mockProducts, 'Poznan');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VWM123');
    });

    test('should filter by Czechy warehouse', () => {
      const filtered = filterByWarehouse(mockProducts, 'Czechy');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VWT456');
    });

    test('should filter by eBay warehouse', () => {
      const filtered = filterByWarehouse(mockProducts, 'eBay');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VWE789');
    });

    test('should filter by UK warehouse', () => {
      const filtered = filterByWarehouse(mockProducts, 'UK');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VWU012');
    });

    test('should return empty array for unknown warehouse', () => {
      const filtered = filterByWarehouse(mockProducts, 'UnknownWarehouse');
      expect(filtered).toHaveLength(0);
    });

    test('should handle products with short SKUs', () => {
      const shortSkuProducts = [
        createMockProduct({ sku: 'VW' }),
        createMockProduct({ sku: 'VW1' }),
        createMockProduct({ sku: 'VWM123' })
      ];
      
      const filtered = filterByWarehouse(shortSkuProducts, 'Poznan');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VWM123');
    });
  });

  describe('getWarehouseFromSku', () => {
    test('should return correct warehouse for valid SKUs', () => {
      expect(getWarehouseFromSku('VWM123')).toBe('Poznan');
      expect(getWarehouseFromSku('VWT456')).toBe('Czechy');
      expect(getWarehouseFromSku('VWE789')).toBe('eBay');
      expect(getWarehouseFromSku('VWU012')).toBe('UK');
    });

    test('should return null for short SKUs', () => {
      expect(getWarehouseFromSku('VW')).toBe(null);
      expect(getWarehouseFromSku('VW1')).toBe(null);
      expect(getWarehouseFromSku('VW12')).toBe(null);
    });

    test('should return null for unknown warehouse codes', () => {
      expect(getWarehouseFromSku('VWX123')).toBe(null);
      expect(getWarehouseFromSku('VWY456')).toBe(null);
    });

    test('should return null for null/undefined SKU', () => {
      expect(getWarehouseFromSku(null)).toBe(null);
      expect(getWarehouseFromSku(undefined)).toBe(null);
      expect(getWarehouseFromSku('')).toBe(null);
    });
  });

  describe('getCategoryCode', () => {
    test('should return correct category codes', () => {
      expect(getCategoryCode('koronkowe')).toBe('VW');
      expect(getCategoryCode('plytkowe')).toBe('PR');
      expect(getCategoryCode('vhm')).toBe('WW');
      expect(getCategoryCode('sandvik')).toBe('PS');
      expect(getCategoryCode('ksem')).toBe('WK');
      expect(getCategoryCode('amec')).toBe('WA');
    });

    test('should return original category for unknown categories', () => {
      expect(getCategoryCode('unknown')).toBe('unknown');
      expect(getCategoryCode('custom')).toBe('custom');
    });

    test('should handle null/undefined category', () => {
      expect(getCategoryCode(null)).toBe(null);
      expect(getCategoryCode(undefined)).toBe(undefined);
    });
  });

  describe('isCrownType', () => {
    test('should return true for crown type SKUs', () => {
      expect(isCrownType('KK.123')).toBe(true);
      expect(isCrownType('KI.456')).toBe(true);
      expect(isCrownType('KS.789')).toBe(true);
      expect(isCrownType('KT.012')).toBe(true);
      expect(isCrownType('KA.345')).toBe(true);
    });

    test('should return false for non-crown type SKUs', () => {
      expect(isCrownType('VW.123')).toBe(false);
      expect(isCrownType('PR.456')).toBe(false);
      expect(isCrownType('WW.789')).toBe(false);
    });

    test('should return false for null/undefined SKU', () => {
      expect(isCrownType(null)).toBe(false);
      expect(isCrownType(undefined)).toBe(false);
      expect(isCrownType('')).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    test('should combine multiple filters correctly', () => {
      // Filter by category and brand
      let filtered = filterByCategory(mockProducts, 'koronkowe');
      filtered = filterByBrand(filtered, 'Sandvik');
      
      expect(filtered).toHaveLength(3); // VW.123, VWM123, VWE789
      expect(filtered.every(p => p.sku.startsWith('VW') && p.vendor === 'Sandvik')).toBe(true);
    });

    test('should filter by category and warehouse', () => {
      let filtered = filterByCategory(mockProducts, 'koronkowe');
      filtered = filterByWarehouse(filtered, 'Poznan');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('VWM123');
    });

    test('should handle complex filtering scenarios', () => {
      // Filter by crown type and brand
      let filtered = filterByCrownType(mockProducts, 'KK');
      filtered = filterByBrand(filtered, 'ISCAR');
      
      expect(filtered).toHaveLength(1);
      expect(filtered[0].sku).toBe('KK.901');
      expect(filtered[0].vendor).toBe('ISCAR');
    });

    test('should handle empty results gracefully', () => {
      let filtered = filterByCategory(mockProducts, 'koronkowe');
      filtered = filterByBrand(filtered, 'UnknownBrand');
      
      expect(filtered).toHaveLength(0);
    });
  });
});
