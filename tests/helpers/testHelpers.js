// Test helpers and utilities

/**
 * Creates a DOM element with the given HTML
 * @param {string} html - HTML string to create
 * @returns {HTMLElement} Created element
 */
export const createElement = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.firstElementChild;
};

/**
 * Creates a mock DOM with the given structure
 * @param {string} structure - HTML structure
 * @returns {Document} Mock document
 */
export const createMockDOM = (structure = '') => {
  document.body.innerHTML = structure;
  return document;
};

/**
 * Simulates a click event
 * @param {HTMLElement} element - Element to click
 * @param {Object} options - Click options
 */
export const simulateClick = (element, options = {}) => {
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    ...options
  });
  element.dispatchEvent(event);
};

/**
 * Simulates a change event
 * @param {HTMLElement} element - Element to change
 * @param {string} value - New value
 */
export const simulateChange = (element, value) => {
  element.value = value;
  const event = new Event('change', {
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
};

/**
 * Simulates a keydown event
 * @param {HTMLElement} element - Element to trigger event on
 * @param {string} key - Key to press
 */
export const simulateKeydown = (element, key) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true
  });
  element.dispatchEvent(event);
};

/**
 * Waits for a specified amount of time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after the delay
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Waits for an element to appear in the DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<HTMLElement>} Promise that resolves with the element
 */
export const waitForElement = (selector, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      } else {
        setTimeout(checkElement, 10);
      }
    };
    
    checkElement();
  });
};

/**
 * Mocks the WiertlaCNC global object
 * @param {Object} overrides - Override default values
 */
export const mockWiertlaCNC = (overrides = {}) => {
  window.WiertlaCNC = {
    products: [],
    activeTabType: 'wiertla',
    filters: {
      category: '',
      manufacturer: '',
      search: '',
      perPage: 50,
      page: 1
    },
    tabPrefixMapping: {
      'wiertla': ['VW', 'WV', 'PR', 'WW', 'PS', 'WK', 'WA'],
      'plytki': ['PW', 'PD'],
      'koronki': ['KK', 'KW', 'KI', 'KT', 'KS', 'KA', 'KG']
    },
    ...overrides
  };
};

/**
 * Mocks the WiertlaTranslations global object
 * @param {Object} overrides - Override default values
 */
export const mockWiertlaTranslations = (overrides = {}) => {
  window.WiertlaTranslations = {
    pl: {
      wiertla_categories: {
        icons: {
          crown: 'KORONKI',
          plate: 'PŁYTKI',
          vhm: 'VHM'
        },
        manufacturer: 'Producent',
        no_results: 'Brak wyników'
      },
      header: {
        nav: {
          home: 'Strona Główna',
          drills: 'WIERTŁA'
        }
      },
      footer: {
        copyright: '© 2024 All rights reserved'
      },
      product: {
        price: 'Cena: {price}',
        price_with_currency: 'Cena: {price} {currency}'
      },
      order: {
        summary: 'Zamówienie: {items} sztuk za {total} {currency}'
      }
    },
    en: {
      wiertla_categories: {
        icons: {
          crown: 'CROWNS',
          plate: 'PLATES',
          vhm: 'VHM'
        },
        manufacturer: 'Manufacturer',
        no_results: 'No results'
      },
      header: {
        nav: {
          home: 'Homepage',
          drills: 'DRILLS'
        }
      },
      footer: {
        copyright: '© 2024 All rights reserved'
      },
      product: {
        price: 'Price: {price}',
        price_with_currency: 'Price: {price} {currency}'
      },
      order: {
        summary: 'Order: {items} items for {total} {currency}'
      }
    },
    de: {
      wiertla_categories: {
        icons: {
          crown: 'KRONEN',
          plate: 'PLATTEN',
          vhm: 'VHM'
        },
        manufacturer: 'Hersteller',
        no_results: 'Keine Ergebnisse'
      },
      header: {
        nav: {
          home: 'Startseite',
          drills: 'BOHRER'
        }
      },
      footer: {
        copyright: '© 2024 Alle Rechte vorbehalten'
      },
      product: {
        price: 'Preis: {price}',
        price_with_currency: 'Preis: {price} {currency}'
      },
      order: {
        summary: 'Bestellung: {items} Artikel für {total} {currency}'
      }
    },
    ...overrides
  };
};

/**
 * Creates a mock fetch response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status code
 * @returns {Promise<Response>} Mock fetch response
 */
export const createMockFetchResponse = (data, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data))
  });
};

/**
 * Mocks the fetch function
 * @param {Object} responses - Object mapping URLs to responses
 */
export const mockFetch = (responses = {}) => {
  global.fetch = jest.fn((url) => {
    const response = responses[url] || responses['*'] || createMockFetchResponse({});
    return response;
  });
};

/**
 * Creates a mock URL with search parameters
 * @param {string} baseUrl - Base URL
 * @param {Object} params - URL parameters
 * @returns {string} Complete URL with parameters
 */
export const createMockURL = (baseUrl = 'http://localhost:3000', params = {}) => {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  return url.toString();
};

/**
 * Mocks the window.location object
 * @param {string} href - Full URL
 */
export const mockLocation = (href) => {
  const url = new URL(href);
  Object.defineProperty(window, 'location', {
    value: {
      href,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      hostname: url.hostname,
      port: url.port,
      protocol: url.protocol
    },
    writable: true
  });
};

/**
 * Creates a mock IntersectionObserver
 */
export const mockIntersectionObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  };
  
  global.IntersectionObserver = jest.fn().mockImplementation(() => mockObserver);
  return mockObserver;
};

/**
 * Creates a mock ResizeObserver
 */
export const mockResizeObserver = () => {
  const mockObserver = {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  };
  
  global.ResizeObserver = jest.fn().mockImplementation(() => mockObserver);
  return mockObserver;
};

/**
 * Asserts that an element has the correct text content
 * @param {HTMLElement} element - Element to check
 * @param {string} expectedText - Expected text content
 */
export const assertTextContent = (element, expectedText) => {
  expect(element.textContent.trim()).toBe(expectedText);
};

/**
 * Asserts that an element has the correct class
 * @param {HTMLElement} element - Element to check
 * @param {string} className - Expected class name
 */
export const assertHasClass = (element, className) => {
  expect(element.classList.contains(className)).toBe(true);
};

/**
 * Asserts that an element is visible
 * @param {HTMLElement} element - Element to check
 */
export const assertIsVisible = (element) => {
  expect(element.style.display).not.toBe('none');
  expect(element.offsetHeight).toBeGreaterThan(0);
};

/**
 * Asserts that an element is hidden
 * @param {HTMLElement} element - Element to check
 */
export const assertIsHidden = (element) => {
  expect(element.style.display).toBe('none');
};

/**
 * Creates a mock event listener
 * @param {string} eventType - Type of event
 * @param {Function} handler - Event handler function
 * @returns {Object} Mock event listener
 */
export const createMockEventListener = (eventType, handler) => {
  return {
    eventType,
    handler,
    remove: jest.fn()
  };
};

/**
 * Mocks addEventListener and removeEventListener
 */
export const mockEventListeners = () => {
  const listeners = [];
  
  window.addEventListener = jest.fn((eventType, handler) => {
    listeners.push({ eventType, handler });
  });
  
  window.removeEventListener = jest.fn((eventType, handler) => {
    const index = listeners.findIndex(
      listener => listener.eventType === eventType && listener.handler === handler
    );
    if (index > -1) {
      listeners.splice(index, 1);
    }
  });
  
  return listeners;
};
