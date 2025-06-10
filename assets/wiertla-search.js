/**
 * Wiertla Search Synchronization System
 * Handles multiple search inputs and keeps them synchronized via URL parameters
 */

class WiertlaSearchSync {
  constructor() {
    this.searchInputs = [];
    this.currentQuery = '';
    this.callbacks = [];
    
    this.init();
  }

  init() {
    // Get initial query from URL
    this.currentQuery = this.getQueryFromURL();
    
    // Find all search inputs on the page
    this.findSearchInputs();
    
    // Set initial values
    this.updateAllInputs(this.currentQuery);
    
    // Bind events
    this.bindEvents();
    
    // Initialize search if there's a query
    if (this.currentQuery) {
      this.triggerSearch(this.currentQuery);
    }
  }

  findSearchInputs() {
    // Find various search input selectors
    const selectors = [
      'input[name="q"]', // Standard search inputs
      '#CategorySearch', // Categories search
      '#Search', // Main search
      '.wiertla-search__input', // Custom search inputs
      '[data-search-input]' // Inputs with search data attribute
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

  bindEvents() {
    // Bind to all search inputs
    this.searchInputs.forEach(input => {
      // Input event for real-time sync
      input.addEventListener('input', (e) => {
        this.handleInputChange(e.target.value);
      });

      // Form submission
      const form = input.closest('form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleSearch(input.value);
        });
      }
    });

    // Listen for URL changes (back/forward buttons)
    window.addEventListener('popstate', () => {
      const newQuery = this.getQueryFromURL();
      this.updateAllInputs(newQuery);
      this.triggerSearch(newQuery);
    });
  }

  handleInputChange(query) {
    this.currentQuery = query;
    this.updateAllInputs(query);
    
    // Debounced search
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.triggerSearch(query);
    }, 300);
  }

  handleSearch(query) {
    this.currentQuery = query;
    this.updateURL(query);
    this.updateAllInputs(query);
    this.triggerSearch(query);
  }

  updateAllInputs(query) {
    this.searchInputs.forEach(input => {
      if (input.value !== query) {
        input.value = query;
      }
    });
  }

  updateURL(query) {
    const url = new URL(window.location);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    
    // Update URL without reload
    window.history.pushState({ query }, '', url);
  }

  getQueryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  triggerSearch(query) {
    // Update global search filters if they exist
    if (window.currentFilters) {
      window.currentFilters.search = query;
    }

    // Trigger table filtering if the function exists
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
    }

    // Call registered callbacks
    this.callbacks.forEach(callback => {
      if (typeof callback === 'function') {
        callback(query);
      }
    });
  }

  // Public method to register search callbacks
  onSearch(callback) {
    this.callbacks.push(callback);
  }

  // Public method to programmatically set search
  setSearch(query) {
    this.handleSearch(query);
  }

  // Public method to get current search
  getSearch() {
    return this.currentQuery;
  }
}

// Initialize the search sync system
let searchSync;

document.addEventListener('DOMContentLoaded', function() {
  searchSync = new WiertlaSearchSync();
  
  // Make it globally available
  window.WiertlaSearchSync = searchSync;
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WiertlaSearchSync;
}
