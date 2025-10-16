// Unit tests for DOM utilities

import { createMockDOM } from '../../helpers/testHelpers.js';

// Mock DOM utility functions that would be extracted from the main code
// These are the functions we want to test in isolation

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null
 */
const getElementById = (id) => {
  return document.getElementById(id);
};

/**
 * Get elements by class name
 * @param {string} className - Class name
 * @returns {HTMLCollection} Elements with the class
 */
const getElementsByClassName = (className) => {
  return document.getElementsByClassName(className);
};

/**
 * Get elements by tag name
 * @param {string} tagName - Tag name
 * @returns {HTMLCollection} Elements with the tag
 */
const getElementsByTagName = (tagName) => {
  return document.getElementsByTagName(tagName);
};

/**
 * Create element with attributes
 * @param {string} tagName - Tag name
 * @param {Object} attributes - Element attributes
 * @returns {HTMLElement} Created element
 */
const createElementWithAttributes = (tagName, attributes = {}) => {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

/**
 * Add class to element
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name to add
 */
const addClass = (element, className) => {
  if (element && element.classList) {
    element.classList.add(className);
  }
};

/**
 * Remove class from element
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name to remove
 */
const removeClass = (element, className) => {
  if (element && element.classList) {
    element.classList.remove(className);
  }
};

/**
 * Toggle class on element
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name to toggle
 */
const toggleClass = (element, className) => {
  if (element && element.classList) {
    element.classList.toggle(className);
  }
};

/**
 * Check if element has class
 * @param {HTMLElement} element - Element
 * @param {string} className - Class name to check
 * @returns {boolean} True if element has class
 */
const hasClass = (element, className) => {
  return element && element.classList && element.classList.contains(className);
};

/**
 * Set element text content
 * @param {HTMLElement} element - Element
 * @param {string} text - Text content
 */
const setTextContent = (element, text) => {
  if (element) {
    element.textContent = text;
  }
};

/**
 * Get element text content
 * @param {HTMLElement} element - Element
 * @returns {string} Text content
 */
const getTextContent = (element) => {
  return element ? element.textContent : '';
};

/**
 * Set element inner HTML
 * @param {HTMLElement} element - Element
 * @param {string} html - HTML content
 */
const setInnerHTML = (element, html) => {
  if (element) {
    element.innerHTML = html;
  }
};

/**
 * Get element inner HTML
 * @param {HTMLElement} element - Element
 * @returns {string} HTML content
 */
const getInnerHTML = (element) => {
  return element ? element.innerHTML : '';
};

/**
 * Show element
 * @param {HTMLElement} element - Element
 */
const showElement = (element) => {
  if (element) {
    element.style.display = '';
    element.style.visibility = 'visible';
  }
};

/**
 * Hide element
 * @param {HTMLElement} element - Element
 */
const hideElement = (element) => {
  if (element) {
    element.style.display = 'none';
  }
};

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element
 * @returns {boolean} True if element is visible
 */
const isElementVisible = (element) => {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
};

/**
 * Scroll element into view
 * @param {HTMLElement} element - Element
 * @param {Object} options - Scroll options
 */
const scrollIntoView = (element, options = {}) => {
  if (element && element.scrollIntoView) {
    element.scrollIntoView(options);
  }
};

/**
 * Get element position
 * @param {HTMLElement} element - Element
 * @returns {Object} Position object with top, left, width, height
 */
const getElementPosition = (element) => {
  if (!element) return { top: 0, left: 0, width: 0, height: 0 };
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height
  };
};

/**
 * Add event listener to element
 * @param {HTMLElement} element - Element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 */
const addEventListener = (element, event, handler, options = {}) => {
  if (element && element.addEventListener) {
    element.addEventListener(event, handler, options);
  }
};

/**
 * Remove event listener from element
 * @param {HTMLElement} element - Element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 */
const removeEventListener = (element, event, handler, options = {}) => {
  if (element && element.removeEventListener) {
    element.removeEventListener(event, handler, options);
  }
};

/**
 * Dispatch event on element
 * @param {HTMLElement} element - Element
 * @param {Event} event - Event to dispatch
 */
const dispatchEvent = (element, event) => {
  if (element && element.dispatchEvent) {
    element.dispatchEvent(event);
  }
};

describe('DOM Utilities', () => {
  beforeEach(() => {
    createMockDOM(`
      <div id="test-element" class="test-class">
        <span class="test-class">Test content</span>
        <p>Paragraph content</p>
      </div>
    `);
    
    // Mock event listener methods
    const testElement = document.getElementById('test-element');
    if (testElement) {
      testElement.addEventListener = jest.fn();
      testElement.removeEventListener = jest.fn();
      testElement.dispatchEvent = jest.fn();
    }
  });

  describe('Element Selection', () => {
    test('should get element by ID', () => {
      const element = getElementById('test-element');
      expect(element).toBeTruthy();
      expect(element.id).toBe('test-element');
    });

    test('should return null for non-existent ID', () => {
      const element = getElementById('non-existent');
      expect(element).toBeNull();
    });

    test('should get elements by class name', () => {
      const elements = getElementsByClassName('test-class');
      expect(elements).toHaveLength(2);
    });

    test('should get elements by tag name', () => {
      const elements = getElementsByTagName('span');
      expect(elements).toHaveLength(1);
    });
  });

  describe('Element Creation', () => {
    test('should create element with attributes', () => {
      const element = createElementWithAttributes('div', {
        id: 'new-element',
        class: 'new-class',
        'data-test': 'test-value'
      });
      
      expect(element.tagName).toBe('DIV');
      expect(element.id).toBe('new-element');
      expect(element.className).toBe('new-class');
      expect(element.getAttribute('data-test')).toBe('test-value');
    });

    test('should create element without attributes', () => {
      const element = createElementWithAttributes('span');
      expect(element.tagName).toBe('SPAN');
      expect(element.attributes).toHaveLength(0);
    });
  });

  describe('Class Management', () => {
    let element;

    beforeEach(() => {
      element = getElementById('test-element');
    });

    test('should add class to element', () => {
      addClass(element, 'new-class');
      expect(element.classList.contains('new-class')).toBe(true);
    });

    test('should remove class from element', () => {
      removeClass(element, 'test-class');
      expect(element.classList.contains('test-class')).toBe(false);
    });

    test('should toggle class on element', () => {
      expect(element.classList.contains('test-class')).toBe(true);
      toggleClass(element, 'test-class');
      expect(element.classList.contains('test-class')).toBe(false);
      toggleClass(element, 'test-class');
      expect(element.classList.contains('test-class')).toBe(true);
    });

    test('should check if element has class', () => {
      expect(hasClass(element, 'test-class')).toBe(true);
      expect(hasClass(element, 'non-existent')).toBe(false);
    });

    test('should handle null element gracefully', () => {
      expect(() => {
        addClass(null, 'test');
        removeClass(null, 'test');
        toggleClass(null, 'test');
        hasClass(null, 'test');
      }).not.toThrow();
    });
  });

  describe('Content Management', () => {
    let element;

    beforeEach(() => {
      element = getElementById('test-element');
    });

    test('should set and get text content', () => {
      setTextContent(element, 'New text content');
      expect(getTextContent(element)).toBe('New text content');
    });

    test('should set and get inner HTML', () => {
      setInnerHTML(element, '<strong>Bold text</strong>');
      expect(getInnerHTML(element)).toBe('<strong>Bold text</strong>');
    });

    test('should handle null element gracefully', () => {
      expect(getTextContent(null)).toBe('');
      expect(getInnerHTML(null)).toBe('');
      expect(() => {
        setTextContent(null, 'test');
        setInnerHTML(null, 'test');
      }).not.toThrow();
    });
  });

  describe('Visibility Management', () => {
    let element;

    beforeEach(() => {
      element = getElementById('test-element');
    });

    test('should show element', () => {
      hideElement(element);
      expect(element.style.display).toBe('none');
      showElement(element);
      expect(element.style.display).toBe('');
      expect(element.style.visibility).toBe('visible');
    });

    test('should hide element', () => {
      showElement(element);
      hideElement(element);
      expect(element.style.display).toBe('none');
    });

    test('should check element visibility', () => {
      showElement(element);
      expect(isElementVisible(element)).toBe(true);
      hideElement(element);
      expect(isElementVisible(element)).toBe(false);
    });

    test('should handle null element gracefully', () => {
      expect(isElementVisible(null)).toBe(false);
      expect(() => {
        showElement(null);
        hideElement(null);
      }).not.toThrow();
    });
  });

  describe('Element Position', () => {
    let element;

    beforeEach(() => {
      element = getElementById('test-element');
      // Mock getBoundingClientRect
      element.getBoundingClientRect = jest.fn(() => ({
        top: 100,
        left: 200,
        width: 300,
        height: 400
      }));
    });

    test('should get element position', () => {
      const position = getElementPosition(element);
      expect(position).toEqual({
        top: 100,
        left: 200,
        width: 300,
        height: 400
      });
    });

    test('should return zero position for null element', () => {
      const position = getElementPosition(null);
      expect(position).toEqual({
        top: 0,
        left: 0,
        width: 0,
        height: 0
      });
    });
  });

  describe('Event Management', () => {
    let element;
    let handler;

    beforeEach(() => {
      element = getElementById('test-element');
      handler = jest.fn();
    });

    test('should add event listener', () => {
      addEventListener(element, 'click', handler);
      expect(element.addEventListener).toHaveBeenCalledWith('click', handler, {});
    });

    test('should remove event listener', () => {
      removeEventListener(element, 'click', handler);
      expect(element.removeEventListener).toHaveBeenCalledWith('click', handler, {});
    });

    test('should dispatch event', () => {
      const event = new Event('click');
      dispatchEvent(element, event);
      expect(element.dispatchEvent).toHaveBeenCalledWith(event);
    });

    test('should handle null element gracefully', () => {
      expect(() => {
        addEventListener(null, 'click', handler);
        removeEventListener(null, 'click', handler);
        dispatchEvent(null, new Event('click'));
      }).not.toThrow();
    });
  });

  describe('Scroll Management', () => {
    let element;

    beforeEach(() => {
      element = getElementById('test-element');
      element.scrollIntoView = jest.fn();
    });

    test('should scroll element into view', () => {
      scrollIntoView(element);
      expect(element.scrollIntoView).toHaveBeenCalledWith({});
    });

    test('should scroll element into view with options', () => {
      const options = { behavior: 'smooth' };
      scrollIntoView(element, options);
      expect(element.scrollIntoView).toHaveBeenCalledWith(options);
    });

    test('should handle null element gracefully', () => {
      expect(() => scrollIntoView(null)).not.toThrow();
    });
  });
});
