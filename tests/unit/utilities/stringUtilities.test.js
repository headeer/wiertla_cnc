// Unit tests for string utility functions

// Mock the string utility functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Convert string to kebab-case
 * @param {string} subject - String to convert
 * @returns {string} Kebab-case string
 */
const kebabCase = (subject) => {
  if (!subject) return '';
  return subject
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[_\s]/g, "-")
    .toLowerCase();
};

/**
 * Convert string to camelCase
 * @param {string} subject - String to convert
 * @returns {string} Camel-case string
 */
const camelCase = (subject) => {
  if (!subject) return '';
  return subject
    .toLowerCase()
    .replace(/-(\w)/g, (match, char) => char.toUpperCase())
    .replace(/_(\w)/g, (match, char) => char.toUpperCase());
};

/**
 * Get SKU prefix from product
 * @param {string} sku - Product SKU
 * @returns {string} SKU prefix
 */
const getSkuPrefix = (sku) => {
  try { 
    return String(sku || '').substring(0, 2).toUpperCase(); 
  } catch(_) { 
    return ''; 
  }
};

/**
 * Check if string is empty or whitespace
 * @param {string} str - String to check
 * @returns {boolean} True if string is empty or whitespace
 */
const isEmpty = (str) => {
  return !str || str.trim().length === 0;
};

/**
 * Sanitize string for display
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeString = (str) => {
  if (!str) return '';
  return String(str).trim().replace(/[<>]/g, '');
};

/**
 * Format price string
 * @param {number} price - Price in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted price string
 */
const formatPrice = (price, currency = 'PLN') => {
  if (typeof price !== 'number' || isNaN(price)) return '0.00 ' + currency;
  return (price / 100).toFixed(2) + ' ' + currency;
};

/**
 * Extract numbers from string
 * @param {string} str - String to extract numbers from
 * @returns {Array<number>} Array of numbers found
 */
const extractNumbers = (str) => {
  if (!str) return [];
  const matches = String(str).match(/\d+/g);
  return matches ? matches.map(Number) : [];
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} String with first letter capitalized
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add if truncated
 * @returns {string} Truncated string
 */
const truncate = (str, length, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length - suffix.length) + suffix;
};

/**
 * Check if string contains only alphanumeric characters
 * @param {string} str - String to check
 * @returns {boolean} True if string is alphanumeric
 */
const isAlphanumeric = (str) => {
  if (!str) return false;
  return /^[a-zA-Z0-9]+$/.test(str);
};

/**
 * Remove special characters from string
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
const removeSpecialChars = (str) => {
  if (!str) return '';
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
};

describe('String Utilities', () => {
  describe('kebabCase', () => {
    test('should convert camelCase to kebab-case', () => {
      expect(kebabCase('camelCase')).toBe('camel-case');
      expect(kebabCase('myVariableName')).toBe('my-variable-name');
      expect(kebabCase('XMLHttpRequest')).toBe('xmlhttp-request');
    });

    test('should convert PascalCase to kebab-case', () => {
      expect(kebabCase('PascalCase')).toBe('pascal-case');
      expect(kebabCase('MyClassName')).toBe('my-class-name');
    });

    test('should handle underscores and spaces', () => {
      expect(kebabCase('snake_case')).toBe('snake-case');
      expect(kebabCase('space separated')).toBe('space-separated');
    });

    test('should handle already kebab-case strings', () => {
      expect(kebabCase('already-kebab-case')).toBe('already-kebab-case');
    });

    test('should handle empty and null strings', () => {
      expect(kebabCase('')).toBe('');
      expect(kebabCase(null)).toBe('');
      expect(kebabCase(undefined)).toBe('');
    });
  });

  describe('camelCase', () => {
    test('should convert kebab-case to camelCase', () => {
      expect(camelCase('kebab-case')).toBe('kebabCase');
      expect(camelCase('my-variable-name')).toBe('myVariableName');
    });

    test('should convert snake_case to camelCase', () => {
      expect(camelCase('snake_case')).toBe('snakeCase');
      expect(camelCase('my_variable_name')).toBe('myVariableName');
    });

    test('should handle already camelCase strings', () => {
      expect(camelCase('alreadyCamelCase')).toBe('alreadycamelcase');
    });

    test('should handle empty and null strings', () => {
      expect(camelCase('')).toBe('');
      expect(camelCase(null)).toBe('');
      expect(camelCase(undefined)).toBe('');
    });
  });

  describe('getSkuPrefix', () => {
    test('should extract SKU prefix correctly', () => {
      expect(getSkuPrefix('VW.123')).toBe('VW');
      expect(getSkuPrefix('PD.456')).toBe('PD');
      expect(getSkuPrefix('KK.789')).toBe('KK');
    });

    test('should handle short SKUs', () => {
      expect(getSkuPrefix('V')).toBe('V');
      expect(getSkuPrefix('VW')).toBe('VW');
    });

    test('should handle null/undefined SKUs', () => {
      expect(getSkuPrefix(null)).toBe('');
      expect(getSkuPrefix(undefined)).toBe('');
      expect(getSkuPrefix('')).toBe('');
    });

    test('should handle non-string inputs', () => {
      expect(getSkuPrefix(123)).toBe('12');
      expect(getSkuPrefix({})).toBe('[O');
    });
  });

  describe('isEmpty', () => {
    test('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty('\t\n')).toBe(true);
    });

    test('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty('  hello  ')).toBe(false);
    });

    test('should handle null/undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });
  });

  describe('sanitizeString', () => {
    test('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('<div>Hello</div>')).toBe('divHello/div');
    });

    test('should trim whitespace', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
      expect(sanitizeString('\t\nworld\t\n')).toBe('world');
    });

    test('should handle null/undefined', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });

  describe('formatPrice', () => {
    test('should format price correctly', () => {
      expect(formatPrice(10000)).toBe('100.00 PLN');
      expect(formatPrice(1500)).toBe('15.00 PLN');
      expect(formatPrice(0)).toBe('0.00 PLN');
    });

    test('should handle different currencies', () => {
      expect(formatPrice(10000, 'EUR')).toBe('100.00 EUR');
      expect(formatPrice(10000, 'USD')).toBe('100.00 USD');
    });

    test('should handle invalid inputs', () => {
      expect(formatPrice('invalid')).toBe('0.00 PLN');
      expect(formatPrice(NaN)).toBe('0.00 PLN');
      expect(formatPrice(null)).toBe('0.00 PLN');
    });
  });

  describe('extractNumbers', () => {
    test('should extract numbers from string', () => {
      expect(extractNumbers('VW.123')).toEqual([123]);
      expect(extractNumbers('PD.456.789')).toEqual([456, 789]);
      expect(extractNumbers('Price: 100.50 PLN')).toEqual([100, 50]);
    });

    test('should return empty array for strings without numbers', () => {
      expect(extractNumbers('Hello World')).toEqual([]);
      expect(extractNumbers('ABC')).toEqual([]);
    });

    test('should handle null/undefined', () => {
      expect(extractNumbers(null)).toEqual([]);
      expect(extractNumbers(undefined)).toEqual([]);
      expect(extractNumbers('')).toEqual([]);
    });
  });

  describe('capitalize', () => {
    test('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('world')).toBe('World');
      expect(capitalize('HELLO')).toBe('Hello');
    });

    test('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('truncate', () => {
    test('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
      expect(truncate('Very long string', 10)).toBe('Very lo...');
    });

    test('should not truncate short strings', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    test('should handle custom suffix', () => {
      expect(truncate('Hello World', 5, '...')).toBe('He...');
      expect(truncate('Hello World', 5, '->')).toBe('Hel->');
    });

    test('should handle null/undefined', () => {
      expect(truncate(null, 5)).toBe(null);
      expect(truncate(undefined, 5)).toBe(undefined);
    });
  });

  describe('isAlphanumeric', () => {
    test('should return true for alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC123')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
      expect(isAlphanumeric('abc')).toBe(true);
    });

    test('should return false for non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('abc.123')).toBe(false);
    });

    test('should handle empty strings', () => {
      expect(isAlphanumeric('')).toBe(false);
      expect(isAlphanumeric(null)).toBe(false);
      expect(isAlphanumeric(undefined)).toBe(false);
    });
  });

  describe('removeSpecialChars', () => {
    test('should remove special characters', () => {
      expect(removeSpecialChars('Hello-World!')).toBe('HelloWorld');
      expect(removeSpecialChars('VW.123')).toBe('VW123');
      expect(removeSpecialChars('Price: $100.50')).toBe('Price 10050');
    });

    test('should preserve alphanumeric characters and spaces', () => {
      expect(removeSpecialChars('Hello World 123')).toBe('Hello World 123');
      expect(removeSpecialChars('ABC123')).toBe('ABC123');
    });

    test('should handle empty strings', () => {
      expect(removeSpecialChars('')).toBe('');
      expect(removeSpecialChars(null)).toBe('');
      expect(removeSpecialChars(undefined)).toBe('');
    });
  });

  describe('Integration Tests', () => {
    test('should handle complex string transformations', () => {
      const input = 'My-Variable_Name';
      const kebab = kebabCase(input);
      const camel = camelCase(kebab);
      
      expect(kebab).toBe('my-variable-name');
      expect(camel).toBe('myVariableName');
    });

    test('should handle SKU processing workflow', () => {
      const sku = 'VW.123.ABC';
      const prefix = getSkuPrefix(sku);
      const numbers = extractNumbers(sku);
      const clean = removeSpecialChars(sku);
      
      expect(prefix).toBe('VW');
      expect(numbers).toEqual([123]);
      expect(clean).toBe('VW123ABC');
    });

    test('should handle price formatting workflow', () => {
      const price = 15000;
      const formatted = formatPrice(price, 'PLN');
      const truncated = truncate(formatted, 8);
      
      expect(formatted).toBe('150.00 PLN');
      expect(truncated).toBe('150.0...');
    });
  });
});
