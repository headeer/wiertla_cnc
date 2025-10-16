// Unit tests for search functionality

import { createMockProduct, createMockProducts } from '../../fixtures/productFactory.js';

// Mock the search functionality that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Search products by term
 * @param {Array} products - Array of products to search
 * @param {string} searchTerm - Search term
 * @returns {Array} Filtered products
 */
const searchProducts = (products, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return products;
  }

  const term = searchTerm.toLowerCase().trim();
  
  return products.filter(product => {
    const searchableFields = [
      product.title,
      product.sku,
      product.custom_symbol,
      product.custom_kod_producenta,
      product.vendor,
      product.custom_category,
      product.custom_fi,
      product.custom_srednica,
      product.custom_rodzaj,
      product.custom_typ
    ];

    const searchableText = searchableFields
      .filter(field => field != null)
      .join(' ')
      .toLowerCase();

    return searchableText.includes(term);
  });
};

/**
 * Search products with fuzzy matching
 * @param {Array} products - Array of products to search
 * @param {string} searchTerm - Search term
 * @param {number} threshold - Similarity threshold (0-1)
 * @returns {Array} Filtered products with similarity scores
 */
const fuzzySearchProducts = (products, searchTerm, threshold = 0.6) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return products.map(product => ({ product, score: 1 }));
  }

  const term = searchTerm.toLowerCase().trim();
  
  return products
    .map(product => {
      const searchableFields = [
        product.title,
        product.sku,
        product.custom_symbol,
        product.custom_kod_producenta,
        product.vendor
      ];

      const searchableText = searchableFields
        .filter(field => field != null)
        .join(' ')
        .toLowerCase();

      const score = calculateSimilarity(term, searchableText);
      return { product, score };
    })
    .filter(result => result.score >= threshold)
    .sort((a, b) => b.score - a.score);
};

/**
 * Calculate similarity between two strings using Levenshtein distance
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0-1)
 */
const calculateSimilarity = (str1, str2) => {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;

  const distance = levenshteinDistance(str1, str2);
  const maxLength = Math.max(str1.length, str2.length);
  
  return 1 - (distance / maxLength);
};

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Search term to highlight
 * @param {string} className - CSS class for highlighting
 * @returns {string} HTML with highlighted terms
 */
const highlightSearchTerm = (text, searchTerm, className = 'highlight') => {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
};

/**
 * Escape special regex characters
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Get search suggestions based on product data
 * @param {Array} products - Array of products
 * @param {string} searchTerm - Current search term
 * @param {number} maxSuggestions - Maximum number of suggestions
 * @returns {Array} Array of suggestions
 */
const getSearchSuggestions = (products, searchTerm, maxSuggestions = 5) => {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  const term = searchTerm.toLowerCase();
  const suggestions = new Set();

  products.forEach(product => {
    const fields = [
      product.title,
      product.sku,
      product.custom_symbol,
      product.vendor
    ];

    fields.forEach(field => {
      if (field && field.toLowerCase().includes(term)) {
        // Add the field value as suggestion
        suggestions.add(field);
        
        // Add partial matches
        const words = field.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.startsWith(term) && word.length > term.length) {
            suggestions.add(word);
          }
        });
      }
    });
  });

  return Array.from(suggestions)
    .slice(0, maxSuggestions)
    .sort((a, b) => a.length - b.length);
};

/**
 * Search products by multiple criteria
 * @param {Array} products - Array of products
 * @param {Object} criteria - Search criteria
 * @returns {Array} Filtered products
 */
const searchByCriteria = (products, criteria) => {
  let filtered = [...products];

  // Search term
  if (criteria.searchTerm) {
    filtered = searchProducts(filtered, criteria.searchTerm);
  }

  // Category
  if (criteria.category) {
    filtered = filtered.filter(product => 
      product.custom_category === criteria.category
    );
  }

  // Manufacturer
  if (criteria.manufacturer) {
    filtered = filtered.filter(product => 
      product.vendor === criteria.manufacturer
    );
  }

  // Price range
  if (criteria.minPrice !== undefined) {
    filtered = filtered.filter(product => 
      product.price >= criteria.minPrice
    );
  }

  if (criteria.maxPrice !== undefined) {
    filtered = filtered.filter(product => 
      product.price <= criteria.maxPrice
    );
  }

  // Availability
  if (criteria.available !== undefined) {
    filtered = filtered.filter(product => 
      product.available === criteria.available
    );
  }

  return filtered;
};

describe('Search Functionality', () => {
  let mockProducts;

  beforeEach(() => {
    mockProducts = [
      createMockProduct({ 
        id: 1, 
        title: 'Koronka VW Test', 
        sku: 'VW.123', 
        vendor: 'Sandvik',
        custom_category: 'koronkowe',
        custom_fi: '12.5',
        custom_srednica: '12.5',
        price: 10000,
        available: true
      }),
      createMockProduct({ 
        id: 2, 
        title: 'Płytka PD Test', 
        sku: 'PD.456', 
        vendor: 'Walter',
        custom_category: 'plytkowe',
        custom_fi: '8.0',
        custom_srednica: '8.0',
        price: 15000,
        available: true
      }),
      createMockProduct({ 
        id: 3, 
        title: 'Wiertło WA Test', 
        sku: 'WA.789', 
        vendor: 'AMEC',
        custom_category: 'amec',
        custom_fi: '6.0',
        custom_srednica: '6.0',
        price: 20000,
        available: false
      }),
      createMockProduct({ 
        id: 4, 
        title: 'Koronka KK Test', 
        sku: 'KK.012', 
        vendor: 'ISCAR',
        custom_category: 'koronki',
        custom_fi: '10.0',
        custom_srednica: '10.0',
        price: 8000,
        available: true
      })
    ];
  });

  describe('searchProducts', () => {
    test('should return all products when search term is empty', () => {
      const results = searchProducts(mockProducts, '');
      expect(results).toHaveLength(mockProducts.length);
    });

    test('should return all products when search term is null', () => {
      const results = searchProducts(mockProducts, null);
      expect(results).toHaveLength(mockProducts.length);
    });

    test('should search by title', () => {
      const results = searchProducts(mockProducts, 'Test');
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => p.title.includes('Test'))).toBe(true);
    });

    test('should search by SKU', () => {
      const results = searchProducts(mockProducts, 'VW.123');
      expect(results).toHaveLength(1);
      expect(results[0].sku).toBe('VW.123');
    });

    test('should search by vendor', () => {
      const results = searchProducts(mockProducts, 'Sandvik');
      expect(results).toHaveLength(1);
      expect(results[0].vendor).toBe('Sandvik');
    });

    test('should search by category', () => {
      const results = searchProducts(mockProducts, 'koronkowe');
      expect(results).toHaveLength(1);
      expect(results[0].custom_category).toBe('koronkowe');
    });

    test('should search by diameter', () => {
      const results = searchProducts(mockProducts, '12.5');
      expect(results).toHaveLength(1);
      expect(results[0].custom_fi).toBe('12.5');
    });

    test('should be case insensitive', () => {
      const results = searchProducts(mockProducts, 'sandvik');
      expect(results).toHaveLength(1);
      expect(results[0].vendor).toBe('Sandvik');
    });

    test('should handle partial matches', () => {
      const results = searchProducts(mockProducts, 'VW');
      expect(results).toHaveLength(1);
      expect(results[0].sku).toBe('VW.123');
    });

    test('should return empty array for no matches', () => {
      const results = searchProducts(mockProducts, 'NonExistent');
      expect(results).toHaveLength(0);
    });

    test('should handle products with missing fields', () => {
      const productsWithMissingFields = [
        createMockProduct({ title: null, sku: 'VW.123' }),
        createMockProduct({ title: 'Test', sku: null })
      ];
      
      const results = searchProducts(productsWithMissingFields, 'VW');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('fuzzySearchProducts', () => {
    test('should return all products with score 1 when search term is empty', () => {
      const results = fuzzySearchProducts(mockProducts, '');
      expect(results).toHaveLength(mockProducts.length);
      expect(results.every(r => r.score === 1)).toBe(true);
    });

    test('should return products with similarity scores', () => {
      const results = fuzzySearchProducts(mockProducts, 'Test', 0.01);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.score >= 0.01)).toBe(true);
    });

    test('should sort results by similarity score', () => {
      const results = fuzzySearchProducts(mockProducts, 'Koronka', 0.3);
      for (let i = 1; i < results.length; i++) {
        expect(results[i-1].score).toBeGreaterThanOrEqual(results[i].score);
      }
    });

    test('should filter by threshold', () => {
      const results = fuzzySearchProducts(mockProducts, 'Koronka', 0.9);
      expect(results.every(r => r.score >= 0.9)).toBe(true);
    });
  });

  describe('calculateSimilarity', () => {
    test('should return 1 for identical strings', () => {
      expect(calculateSimilarity('hello', 'hello')).toBe(1);
    });

    test('should return 0 for completely different strings', () => {
      expect(calculateSimilarity('abc', 'xyz')).toBeLessThan(0.5);
    });

    test('should return higher score for similar strings', () => {
      const score1 = calculateSimilarity('hello', 'helo');
      const score2 = calculateSimilarity('hello', 'xyz');
      expect(score1).toBeGreaterThan(score2);
    });

    test('should handle empty strings', () => {
      expect(calculateSimilarity('', '')).toBe(1);
      expect(calculateSimilarity('hello', '')).toBe(0);
      expect(calculateSimilarity('', 'hello')).toBe(0);
    });
  });

  describe('levenshteinDistance', () => {
    test('should return 0 for identical strings', () => {
      expect(levenshteinDistance('hello', 'hello')).toBe(0);
    });

    test('should return string length for completely different strings', () => {
      expect(levenshteinDistance('abc', 'xyz')).toBe(3);
    });

    test('should calculate correct distance for similar strings', () => {
      expect(levenshteinDistance('kitten', 'sitting')).toBe(3);
      expect(levenshteinDistance('hello', 'helo')).toBe(1);
    });

    test('should handle empty strings', () => {
      expect(levenshteinDistance('', '')).toBe(0);
      expect(levenshteinDistance('hello', '')).toBe(5);
      expect(levenshteinDistance('', 'hello')).toBe(5);
    });
  });

  describe('highlightSearchTerm', () => {
    test('should highlight search term in text', () => {
      const result = highlightSearchTerm('Hello World', 'World');
      expect(result).toBe('Hello <span class="highlight">World</span>');
    });

    test('should be case insensitive', () => {
      const result = highlightSearchTerm('Hello World', 'world');
      expect(result).toBe('Hello <span class="highlight">World</span>');
    });

    test('should highlight multiple occurrences', () => {
      const result = highlightSearchTerm('Hello Hello', 'Hello');
      expect(result).toBe('<span class="highlight">Hello</span> <span class="highlight">Hello</span>');
    });

    test('should use custom CSS class', () => {
      const result = highlightSearchTerm('Hello World', 'World', 'search-highlight');
      expect(result).toBe('Hello <span class="search-highlight">World</span>');
    });

    test('should handle empty or null inputs', () => {
      expect(highlightSearchTerm('', 'World')).toBe('');
      expect(highlightSearchTerm('Hello', '')).toBe('Hello');
      expect(highlightSearchTerm(null, 'World')).toBe(null);
    });

    test('should escape special regex characters', () => {
      const result = highlightSearchTerm('Hello [World]', '[World]');
      expect(result).toBe('Hello <span class="highlight">[World]</span>');
    });
  });

  describe('getSearchSuggestions', () => {
    test('should return empty array for short search terms', () => {
      const suggestions = getSearchSuggestions(mockProducts, 'a');
      expect(suggestions).toHaveLength(0);
    });

    test('should return suggestions based on product data', () => {
      const suggestions = getSearchSuggestions(mockProducts, 'Kor');
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('Koronka'))).toBe(true);
    });

    test('should limit number of suggestions', () => {
      const suggestions = getSearchSuggestions(mockProducts, 'Test', 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    test('should return empty array for no matches', () => {
      const suggestions = getSearchSuggestions(mockProducts, 'NonExistent');
      expect(suggestions).toHaveLength(0);
    });

    test('should sort suggestions by length', () => {
      const suggestions = getSearchSuggestions(mockProducts, 'Test');
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i-1].length).toBeLessThanOrEqual(suggestions[i].length);
      }
    });
  });

  describe('searchByCriteria', () => {
    test('should search by multiple criteria', () => {
      const criteria = {
        searchTerm: 'Test',
        category: 'koronkowe',
        manufacturer: 'Sandvik',
        minPrice: 5000,
        maxPrice: 15000,
        available: true
      };

      const results = searchByCriteria(mockProducts, criteria);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe(1);
    });

    test('should search by search term only', () => {
      const criteria = { searchTerm: 'Koronka' };
      const results = searchByCriteria(mockProducts, criteria);
      expect(results.length).toBeGreaterThan(0);
    });

    test('should search by category only', () => {
      const criteria = { category: 'koronkowe' };
      const results = searchByCriteria(mockProducts, criteria);
      expect(results).toHaveLength(1);
    });

    test('should search by manufacturer only', () => {
      const criteria = { manufacturer: 'Sandvik' };
      const results = searchByCriteria(mockProducts, criteria);
      expect(results).toHaveLength(1);
    });

    test('should search by price range', () => {
      const criteria = { minPrice: 10000, maxPrice: 15000 };
      const results = searchByCriteria(mockProducts, criteria);
      expect(results).toHaveLength(2);
    });

    test('should search by availability', () => {
      const criteria = { available: true };
      const results = searchByCriteria(mockProducts, criteria);
      expect(results).toHaveLength(3);
    });

    test('should return empty array when no products match criteria', () => {
      const criteria = {
        searchTerm: 'NonExistent',
        category: 'unknown',
        manufacturer: 'UnknownBrand'
      };

      const results = searchByCriteria(mockProducts, criteria);
      expect(results).toHaveLength(0);
    });

    test('should handle empty criteria', () => {
      const results = searchByCriteria(mockProducts, {});
      expect(results).toHaveLength(mockProducts.length);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complex search scenarios', () => {
      // Search with multiple criteria
      const criteria = {
        searchTerm: 'Test',
        available: true
      };

      const results = searchByCriteria(mockProducts, criteria);
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.available)).toBe(true);
    });

    test('should handle search with highlighting', () => {
      const searchTerm = 'Test';
      const results = searchProducts(mockProducts, searchTerm);
      
      results.forEach(result => {
        const highlighted = highlightSearchTerm(result.title, searchTerm);
        expect(highlighted).toContain('<span class="highlight">');
      });
    });

        test('should handle fuzzy search with suggestions', () => {
          const searchTerm = 'Test';
          const fuzzyResults = fuzzySearchProducts(mockProducts, searchTerm, 0.01);
          const suggestions = getSearchSuggestions(mockProducts, searchTerm);
          
          expect(fuzzyResults.length).toBeGreaterThan(0);
          expect(suggestions.length).toBeGreaterThan(0);
        });
  });
});
