// Unit tests for DOM utility functions

// Mock the DOM utility functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Check if DOM is ready
 * @returns {Promise} Promise that resolves when DOM is ready
 */
const domReady = () => {
  return new Promise((resolve) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", resolve);
    } else {
      resolve();
    }
  });
};

/**
 * Get unique elements from array
 * @param {Array} array - Array to make unique
 * @returns {Array} Array with unique elements
 */
const arrayUnique = (array) => {
  return Array.from(new Set(array));
};

/**
 * Check if running in test environment
 * @returns {boolean} True if in test environment
 */
const isTesting = () => {
  return (
    navigator.userAgent.includes("Node.js") ||
    navigator.userAgent.includes("jsdom")
  );
};

/**
 * Loose comparison for attributes
 * @param {*} valueA - First value
 * @param {*} valueB - Second value
 * @returns {boolean} True if values are loosely equal
 */
const checkedAttrLooseCompare = (valueA, valueB) => {
  // Handle string to boolean conversion
  if (typeof valueA === 'string' && typeof valueB === 'boolean') {
    if (valueA === 'true') return valueB === true;
    if (valueA === 'false') return valueB === false;
    if (valueA === '') return valueB === false;
  }
  if (typeof valueB === 'string' && typeof valueA === 'boolean') {
    if (valueB === 'true') return valueA === true;
    if (valueB === 'false') return valueA === false;
    if (valueB === '') return valueA === false;
  }
  
  return valueA == valueB;
};

/**
 * Warn if template is malformed
 * @param {HTMLElement} el - Template element
 * @param {string} directive - Directive name
 */
const warnIfMalformedTemplate = (el, directive) => {
  if (el.tagName.toLowerCase() !== "template") {
    console.warn(
      `Alpine: [${directive}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${directive}`
    );
  } else if (el.content.childElementCount !== 1) {
    console.warn(
      `Alpine: <template> tag with [${directive}] encountered with multiple element roots. Make sure <template> only has a single child element.`
    );
  }
};

/**
 * Walk DOM tree and execute callback
 * @param {HTMLElement} el - Root element
 * @param {Function} callback - Callback function
 */
const walk = (el, callback) => {
  if (callback(el) === false) return false;
  let node = el.firstElementChild;

  while (node) {
    if (walk(node, callback) === false) return false;
    node = node.nextElementSibling;
  }
};

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Get element by selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [parent] - Parent element to search in
 * @returns {HTMLElement|null} Found element or null
 */
const safeQuerySelector = (selector, parent = document) => {
  try {
    return parent.querySelector(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return null;
  }
};

/**
 * Get elements by selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} [parent] - Parent element to search in
 * @returns {NodeList} Found elements
 */
const safeQuerySelectorAll = (selector, parent = document) => {
  try {
    return parent.querySelectorAll(selector);
  } catch (error) {
    console.warn(`Invalid selector: ${selector}`, error);
    return [];
  }
};

/**
 * Add event listener with error handling
 * @param {HTMLElement} element - Element to add listener to
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} [options] - Event options
 */
const safeAddEventListener = (element, event, handler, options = {}) => {
  if (!element || typeof element.addEventListener !== 'function') {
    console.warn('Invalid element for event listener');
    return;
  }
  
  try {
    element.addEventListener(event, handler, options);
  } catch (error) {
    console.warn(`Error adding event listener for ${event}:`, error);
  }
};

/**
 * Remove event listener with error handling
 * @param {HTMLElement} element - Element to remove listener from
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} [options] - Event options
 */
const safeRemoveEventListener = (element, event, handler, options = {}) => {
  if (!element || typeof element.removeEventListener !== 'function') {
    console.warn('Invalid element for event listener removal');
    return;
  }
  
  try {
    element.removeEventListener(event, handler, options);
  } catch (error) {
    console.warn(`Error removing event listener for ${event}:`, error);
  }
};

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
const isElementVisible = (element) => {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0';
};

/**
 * Scroll element into view
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} [options] - Scroll options
 */
const scrollIntoView = (element, options = {}) => {
  if (!element || typeof element.scrollIntoView !== 'function') {
    console.warn('Element does not support scrollIntoView');
    return;
  }
  
  try {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options
    });
  } catch (error) {
    console.warn('Error scrolling element into view:', error);
  }
};

describe('DOM Utilities', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('domReady', () => {
    test('should resolve immediately if DOM is already ready', async () => {
      const start = Date.now();
      await domReady();
      const end = Date.now();
      
      // Should resolve quickly since DOM is already ready in test environment
      expect(end - start).toBeLessThan(100);
    });

    test('should be a function that returns a Promise', () => {
      expect(typeof domReady).toBe('function');
      expect(domReady()).toBeInstanceOf(Promise);
    });
  });

  describe('arrayUnique', () => {
    test('should remove duplicate elements', () => {
      expect(arrayUnique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(arrayUnique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });

    test('should handle empty array', () => {
      expect(arrayUnique([])).toEqual([]);
    });

    test('should handle array with no duplicates', () => {
      expect(arrayUnique([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test('should handle mixed types', () => {
      expect(arrayUnique([1, '1', 2, '2'])).toEqual([1, '1', 2, '2']);
    });
  });

  describe('isTesting', () => {
    test('should return true in test environment', () => {
      expect(isTesting()).toBe(true);
    });

    test('should be a function', () => {
      expect(typeof isTesting).toBe('function');
    });
  });

  describe('checkedAttrLooseCompare', () => {
    test('should perform loose comparison', () => {
      expect(checkedAttrLooseCompare('1', 1)).toBe(true);
      expect(checkedAttrLooseCompare('true', true)).toBe(true);
      expect(checkedAttrLooseCompare('false', false)).toBe(true);
      expect(checkedAttrLooseCompare('', false)).toBe(true);
    });

    test('should return false for different values', () => {
      expect(checkedAttrLooseCompare('1', 2)).toBe(false);
      expect(checkedAttrLooseCompare('true', false)).toBe(false);
    });
  });

  describe('warnIfMalformedTemplate', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should warn for non-template elements', () => {
      const div = document.createElement('div');
      warnIfMalformedTemplate(div, 'x-if');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('should only be added to <template> tags')
      );
    });

    test('should warn for templates with multiple children', () => {
      const template = document.createElement('template');
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      template.content.appendChild(div1);
      template.content.appendChild(div2);
      
      warnIfMalformedTemplate(template, 'x-for');
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('multiple element roots')
      );
    });

    test('should not warn for valid templates', () => {
      const template = document.createElement('template');
      const div = document.createElement('div');
      template.content.appendChild(div);
      
      warnIfMalformedTemplate(template, 'x-if');
      
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('walk', () => {
    test('should walk DOM tree and execute callback', () => {
      document.body.innerHTML = `
        <div id="parent">
          <span id="child1">Child 1</span>
          <span id="child2">Child 2</span>
        </div>
      `;
      
      const visited = [];
      const parent = document.getElementById('parent');
      
      walk(parent, (el) => {
        visited.push(el.id || el.tagName.toLowerCase());
      });
      
      expect(visited).toContain('parent');
      expect(visited).toContain('child1');
      expect(visited).toContain('child2');
    });

    test('should stop walking when callback returns false', () => {
      document.body.innerHTML = `
        <div id="parent">
          <span id="child1">Child 1</span>
          <span id="child2">Child 2</span>
        </div>
      `;
      
      const visited = [];
      const parent = document.getElementById('parent');
      
      walk(parent, (el) => {
        visited.push(el.id || el.tagName.toLowerCase());
        if (el.id === 'child1') return false;
      });
      
      expect(visited).toContain('parent');
      expect(visited).toContain('child1');
      expect(visited).not.toContain('child2');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should debounce function execution', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);
      
      debouncedFunc();
      debouncedFunc();
      debouncedFunc();
      
      expect(func).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(func).toHaveBeenCalledTimes(1);
    });

    test('should pass arguments to debounced function', () => {
      const func = jest.fn();
      const debouncedFunc = debounce(func, 100);
      
      debouncedFunc('arg1', 'arg2');
      
      jest.advanceTimersByTime(100);
      
      expect(func).toHaveBeenCalledWith('arg1', 'arg2');
    });
  });

  describe('throttle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test('should throttle function execution', () => {
      const func = jest.fn();
      const throttledFunc = throttle(func, 100);
      
      throttledFunc();
      throttledFunc();
      throttledFunc();
      
      expect(func).toHaveBeenCalledTimes(1);
      
      jest.advanceTimersByTime(100);
      
      throttledFunc();
      expect(func).toHaveBeenCalledTimes(2);
    });
  });

  describe('safeQuerySelector', () => {
    test('should return element for valid selector', () => {
      document.body.innerHTML = '<div id="test">Hello</div>';
      
      const element = safeQuerySelector('#test');
      expect(element).toBeTruthy();
      expect(element.id).toBe('test');
    });

    test('should return null for invalid selector', () => {
      const element = safeQuerySelector('invalid[selector');
      expect(element).toBeNull();
    });

    test('should search within parent element', () => {
      document.body.innerHTML = `
        <div id="parent">
          <span id="child">Child</span>
        </div>
        <span id="other">Other</span>
      `;
      
      const parent = document.getElementById('parent');
      const element = safeQuerySelector('#child', parent);
      
      expect(element).toBeTruthy();
      expect(element.id).toBe('child');
    });
  });

  describe('safeQuerySelectorAll', () => {
    test('should return elements for valid selector', () => {
      document.body.innerHTML = '<div class="test">1</div><div class="test">2</div>';
      
      const elements = safeQuerySelectorAll('.test');
      expect(elements).toHaveLength(2);
    });

    test('should return empty NodeList for invalid selector', () => {
      const elements = safeQuerySelectorAll('invalid[selector');
      expect(elements).toHaveLength(0);
    });
  });

  describe('safeAddEventListener', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should add event listener to valid element', () => {
      const element = document.createElement('div');
      const handler = jest.fn();
      
      safeAddEventListener(element, 'click', handler);
      
      element.click();
      expect(handler).toHaveBeenCalled();
    });

    test('should warn for invalid element', () => {
      safeAddEventListener(null, 'click', jest.fn());
      
      expect(consoleSpy).toHaveBeenCalledWith('Invalid element for event listener');
    });
  });

  describe('isElementVisible', () => {
    test('should return true for visible element', () => {
      document.body.innerHTML = '<div id="visible">Visible</div>';
      const element = document.getElementById('visible');
      
      expect(isElementVisible(element)).toBe(true);
    });

    test('should return false for null element', () => {
      expect(isElementVisible(null)).toBe(false);
    });

    test('should return false for element with display none', () => {
      document.body.innerHTML = '<div id="hidden" style="display: none">Hidden</div>';
      const element = document.getElementById('hidden');
      
      expect(isElementVisible(element)).toBe(false);
    });
  });

  describe('scrollIntoView', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('should scroll valid element into view', () => {
      document.body.innerHTML = '<div id="target">Target</div>';
      const element = document.getElementById('target');
      element.scrollIntoView = jest.fn();
      const scrollIntoViewSpy = jest.spyOn(element, 'scrollIntoView');
      
      scrollIntoView(element);
      
      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    });

    test('should warn for invalid element', () => {
      scrollIntoView(null);
      
      expect(consoleSpy).toHaveBeenCalledWith('Element does not support scrollIntoView');
    });
  });

  describe('Integration Tests', () => {
    test('should handle complex DOM operations', () => {
      document.body.innerHTML = `
        <div id="container">
          <button class="btn" data-action="click">Click me</button>
          <div class="content" style="display: none">Content</div>
        </div>
      `;
      
      const container = safeQuerySelector('#container');
      const button = safeQuerySelector('.btn', container);
      const content = safeQuerySelector('.content', container);
      
      expect(container).toBeTruthy();
      expect(button).toBeTruthy();
      expect(content).toBeTruthy();
      expect(isElementVisible(content)).toBe(false);
    });

    test('should handle event listener lifecycle', () => {
      document.body.innerHTML = '<button id="btn">Button</button>';
      
      const button = document.getElementById('btn');
      const handler = jest.fn();
      
      safeAddEventListener(button, 'click', handler);
      button.click();
      expect(handler).toHaveBeenCalled();
      
      safeRemoveEventListener(button, 'click', handler);
      button.click();
      expect(handler).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });
});
