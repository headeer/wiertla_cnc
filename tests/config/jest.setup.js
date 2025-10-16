// Jest setup file for Wiertla CNC testing
require('@testing-library/jest-dom');

// Mock global objects that might be used in the theme
global.window = {
  ...global.window,
  location: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:3000'
  },
  localStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  sessionStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn()
};

// Mock Shopify global objects
global.Shopify = {
  theme: {
    id: 'test-theme-id',
    name: 'Test Theme'
  },
  routes: {
    root_url: '/',
    account_url: '/account',
    account_login_url: '/account/login',
    account_register_url: '/account/register',
    account_logout_url: '/account/logout'
  }
};

// Mock console methods to reduce noise in tests (but allow real console for translation system)
global.console = {
  ...console,
  log: jest.fn(),
  warn: console.warn, // Keep real console.warn for translation system
  error: console.error // Keep real console.error for translation system
};

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Setup test environment for each test
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset DOM
  document.body.innerHTML = '';
  
  // Reset window location (avoid navigation in jsdom)
  delete window.location;
  window.location = {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn()
  };
});

// Cleanup after each test
afterEach(() => {
  // Clean up any timers
  jest.clearAllTimers();
});
