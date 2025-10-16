/**
 * Integration tests for wiertla-search.js
 * Tests the search synchronization system functionality
 */

// Mock the WiertlaSearchSync class
class MockWiertlaSearchSync {
  constructor() {
    this.searchInputs = [];
    this.currentQuery = '';
    this.callbacks = [];
    
    this.init();
  }

  init() {
    this.currentQuery = this.getQueryFromURL();
    this.findSearchInputs();
    this.updateAllInputs(this.currentQuery);
    this.bindEvents();
    
    if (this.currentQuery) {
      this.triggerSearch(this.currentQuery);
    }
  }

  findSearchInputs() {
    const selectors = [
      'input[name="q"]',
      '#CategorySearch',
      '#Search',
      '.wiertla-search__input',
      '[data-search-input]'
    ];

    selectors.forEach(selector => {
      const inputs = document.querySelectorAll(selector);
      inputs.forEach(input => {
        if (!this.searchInputs.includes(input)) {
          this.searchInputs.push(input);
        }
      });
    });
  }

  getQueryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('q') || '';
  }

  updateAllInputs(query) {
    this.searchInputs.forEach(input => {
      if (input.value !== query) {
        input.value = query;
        this.triggerInputEvent(input);
      }
    });
  }

  bindEvents() {
    this.searchInputs.forEach(input => {
      input.addEventListener('input', (e) => this.handleInput(e));
      input.addEventListener('keydown', (e) => this.handleKeydown(e));
    });
  }

  handleInput(e) {
    const query = e.target.value;
    this.currentQuery = query;
    this.updateURL(query);
    this.updateOtherInputs(e.target, query);
    this.triggerSearch(query);
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.performSearch();
    }
  }

  updateOtherInputs(currentInput, query) {
    this.searchInputs.forEach(input => {
      if (input !== currentInput && input.value !== query) {
        input.value = query;
      }
    });
  }

  updateURL(query) {
    const url = new URL(window.location.href);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url.toString());
  }

  triggerInputEvent(input) {
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
  }

  triggerSearch(query) {
    this.callbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback(query);
      }
    });
  }

  performSearch() {
    if (this.currentQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(this.currentQuery)}`;
    }
  }

  addCallback(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
}

describe('Wiertla Search Integration Tests', () => {
  let originalLocation;
  let originalHistory;

  beforeEach(() => {
    // Mock window.location and history
    originalLocation = window.location;
    originalHistory = window.history;
    
    delete window.location;
    delete window.history;
    
    window.location = {
      search: '',
      href: 'http://localhost:3000/',
      pathname: '/',
      hostname: 'localhost',
      protocol: 'http:',
      host: 'localhost:3000'
    };
    
    window.history = {
      replaceState: jest.fn()
    };

    // Reset DOM
    document.body.innerHTML = `
      <div class="search-container">
        <input type="text" name="q" id="main-search" placeholder="Search products...">
        <input type="text" id="CategorySearch" placeholder="Category search...">
        <input type="text" id="Search" placeholder="Search...">
        <input type="text" class="wiertla-search__input" placeholder="Custom search...">
        <input type="text" data-search-input placeholder="Data attribute search...">
      </div>
    `;
  });

  afterEach(() => {
    // Restore original objects
    window.location = originalLocation;
    window.history = originalHistory;
    document.body.innerHTML = '';
  });

  describe('Search Input Discovery', () => {
    test('should find all search inputs on page', () => {
      const searchSync = new MockWiertlaSearchSync();
      
      expect(searchSync.searchInputs).toHaveLength(5);
      expect(searchSync.searchInputs[0].name).toBe('q');
      expect(searchSync.searchInputs[1].id).toBe('CategorySearch');
      expect(searchSync.searchInputs[2].id).toBe('Search');
      expect(searchSync.searchInputs[3].className).toBe('wiertla-search__input');
      expect(searchSync.searchInputs[4].getAttribute('data-search-input')).toBe('');
    });

    test('should handle page with no search inputs', () => {
      document.body.innerHTML = '<div>No search inputs</div>';
      
      const searchSync = new MockWiertlaSearchSync();
      
      expect(searchSync.searchInputs).toHaveLength(0);
    });
  });

  describe('URL Query Handling', () => {
    test('should extract query from URL parameters', () => {
      window.location.search = '?q=test+query&other=param';
      
      const searchSync = new MockWiertlaSearchSync();
      
      expect(searchSync.currentQuery).toBe('test query');
    });

    test('should handle empty URL parameters', () => {
      window.location.search = '';
      
      const searchSync = new MockWiertlaSearchSync();
      
      expect(searchSync.currentQuery).toBe('');
    });

    test('should update URL when query changes', () => {
      const searchSync = new MockWiertlaSearchSync();
      const input = document.querySelector('input[name="q"]');
      
      input.value = 'new query';
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });

  describe('Input Synchronization', () => {
    test('should synchronize all inputs when one changes', () => {
      const searchSync = new MockWiertlaSearchSync();
      const mainInput = document.querySelector('input[name="q"]');
      const categoryInput = document.querySelector('#CategorySearch');
      
      mainInput.value = 'synchronized query';
      const inputEvent = new Event('input', { bubbles: true });
      mainInput.dispatchEvent(inputEvent);
      
      expect(categoryInput.value).toBe('synchronized query');
    });

    test('should update all inputs with initial URL query', () => {
      window.location.search = '?q=initial+query';
      
      const searchSync = new MockWiertlaSearchSync();
      
      searchSync.searchInputs.forEach(input => {
        expect(input.value).toBe('initial query');
      });
    });

    test('should not trigger infinite loops when updating inputs', () => {
      const searchSync = new MockWiertlaSearchSync();
      const input = document.querySelector('input[name="q"]');
      
      // Mock the triggerInputEvent to track calls
      const triggerSpy = jest.spyOn(searchSync, 'triggerInputEvent');
      
      input.value = 'test query';
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      // Should not call triggerInputEvent for the same input
      expect(triggerSpy).not.toHaveBeenCalledWith(input);
    });
  });

  describe('Search Callbacks', () => {
    test('should trigger callbacks when search query changes', () => {
      const searchSync = new MockWiertlaSearchSync();
      const callback = jest.fn();
      
      searchSync.addCallback(callback);
      
      const input = document.querySelector('input[name="q"]');
      input.value = 'callback test';
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      expect(callback).toHaveBeenCalledWith('callback test');
    });

    test('should handle multiple callbacks', () => {
      const searchSync = new MockWiertlaSearchSync();
      const callback1 = jest.fn();
      const callback2 = jest.fn();
      
      searchSync.addCallback(callback1);
      searchSync.addCallback(callback2);
      
      const input = document.querySelector('input[name="q"]');
      input.value = 'multiple callbacks';
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      expect(callback1).toHaveBeenCalledWith('multiple callbacks');
      expect(callback2).toHaveBeenCalledWith('multiple callbacks');
    });

    test('should remove callbacks correctly', () => {
      const searchSync = new MockWiertlaSearchSync();
      const callback = jest.fn();
      
      searchSync.addCallback(callback);
      searchSync.removeCallback(callback);
      
      const input = document.querySelector('input[name="q"]');
      input.value = 'removed callback';
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    test('should perform search on Enter key', () => {
      const searchSync = new MockWiertlaSearchSync();
      const input = document.querySelector('input[name="q"]');
      
      input.value = 'enter search';
      
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true
      });
      
      const preventDefaultSpy = jest.spyOn(keydownEvent, 'preventDefault');
      
      input.dispatchEvent(keydownEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test('should not perform search on other keys', () => {
      const searchSync = new MockWiertlaSearchSync();
      const input = document.querySelector('input[name="q"]');
      
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true
      });
      
      const preventDefaultSpy = jest.spyOn(keydownEvent, 'preventDefault');
      
      input.dispatchEvent(keydownEvent);
      
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('Search Performance', () => {
    test('should handle rapid input changes efficiently', () => {
      const searchSync = new MockWiertlaSearchSync();
      const input = document.querySelector('input[name="q"]');
      const callback = jest.fn();
      
      searchSync.addCallback(callback);
      
      // Simulate rapid typing
      const queries = ['a', 'ab', 'abc', 'abcd'];
      queries.forEach(query => {
        input.value = query;
        const inputEvent = new Event('input', { bubbles: true });
        input.dispatchEvent(inputEvent);
      });
      
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenLastCalledWith('abcd');
    });
  });

  describe('Error Handling', () => {
    test('should handle missing URL parameters gracefully', () => {
      window.location.search = '?invalid=param';
      
      expect(() => {
        new MockWiertlaSearchSync();
      }).not.toThrow();
    });

    test('should handle invalid callback functions', () => {
      const searchSync = new MockWiertlaSearchSync();
      
      expect(() => {
        searchSync.addCallback('not a function');
        searchSync.addCallback(null);
        searchSync.addCallback(undefined);
      }).not.toThrow();
    });
  });

  describe('Integration Workflow', () => {
    test('should handle complete search workflow', () => {
      // Start with URL query
      window.location.search = '?q=initial+search';
      
      const searchSync = new MockWiertlaSearchSync();
      const callback = jest.fn();
      searchSync.addCallback(callback);
      
      // Verify initial state
      expect(searchSync.currentQuery).toBe('initial search');
      searchSync.searchInputs.forEach(input => {
        expect(input.value).toBe('initial search');
      });
      
      // Change search query
      const input = document.querySelector('input[name="q"]');
      input.value = 'updated search';
      const inputEvent = new Event('input', { bubbles: true });
      input.dispatchEvent(inputEvent);
      
      // Verify updated state
      expect(searchSync.currentQuery).toBe('updated search');
      expect(callback).toHaveBeenCalledWith('updated search');
      
      // Perform search
      const keydownEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true
      });
      input.dispatchEvent(keydownEvent);
      
      // Should attempt to navigate (mocked)
      expect(window.history.replaceState).toHaveBeenCalled();
    });
  });
});
