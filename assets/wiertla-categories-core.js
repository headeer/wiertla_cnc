/**
 * Wiertla Categories - Core Functionality
 * Core initialization and event handling for the Wiertla CNC product categories system
 */

// Define isMobileView at the very start so it's available throughout the codebase
let isMobileView = window.innerWidth <= 1024;

// Update category icons based on active tab
function updateCategoryIcons() {
  const tabType = window.WiertlaCNC.activeTabType;
  const allIcons = document.querySelectorAll('.wiertla-categories__icon-item');
  
  // Define categories per tab exactly as specified
  const wiertlaCategories = ['koronkowe', 'plytkowe', 'vhm', 'sandvik', 'ksem', 'amec'];
  const plytkiCategories = ['wcmx', 'lcmx', '811', 'dft', '880', 'wogx', 'spgx', 'p284'];
  const koronkiCategories = ['ksem', 'idi', 'p600', 'icm', 'icp', '870', 'amec', 'ktip'];
  
  let visibleIcons = [];
  let currentTabCategories = [];
  let currentTabClass = '';
  
  // Determine which categories and tab class to show for current tab
  if (tabType === 'wiertla') {
    currentTabCategories = wiertlaCategories;
    currentTabClass = 'wiertla-tab-wiertla';
  } else if (tabType === 'plytki') {
    currentTabCategories = plytkiCategories;
    currentTabClass = 'wiertla-tab-plytki';
  } else if (tabType === 'koronki') {
    currentTabCategories = koronkiCategories;
    currentTabClass = 'wiertla-tab-koronki';
  }
  
  allIcons.forEach(icon => {
    const category = icon.getAttribute('data-category');
    
    // Always show "wszystkie" (all) category regardless of tab
    if (category === 'wszystkie') {
      icon.style.display = '';
      visibleIcons.push(category);
      return;
    }
    
    // Check if icon belongs to current tab AND has correct category
    const belongsToCurrentTab = icon.classList.contains(currentTabClass);
    const hasCorrectCategory = currentTabCategories.includes(category);
    
    if (belongsToCurrentTab && hasCorrectCategory) {
      icon.style.display = '';
      visibleIcons.push(category);
    } else {
      icon.style.display = 'none';
    }
  });
}

// Initialize core functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Force check mobile view
  isMobileView = window.innerWidth <= 1024;
  
  // Initialize the active tab type (wiertla, plytki, koronki)
  window.WiertlaCNC.activeTabType = 'wiertla';
  
  // Define SKU prefix mapping for each tab type
  window.WiertlaCNC.tabPrefixMapping = {
    'wiertla': ['VW', 'WV', 'PR', 'WW', 'PS', 'WK', 'WA'],
    'plytki': ['PW', 'PD'],
    'koronki': ['KK', 'KW', 'KI', 'KT', 'KS', 'KA', 'KG']
  };
  
  // Sub-categories for the Wiertła tab mapped to SKU prefixes
  window.WiertlaCNC.wiertlaCategoryToPrefixes = {
    'koronkowe': ['VW', 'WV'],
    'plytkowe': ['PR'],
    'vhm': ['WW'],
    'sandvik': ['PS'],
    'ksem': ['WK'],
    'amec': ['WA']
  };

  // Expose fullscreen helpers to window for manual debugging
  try {
    if (!window.WiertlaCNC) window.WiertlaCNC = {};
    window.WiertlaCNC.applyFullscreenFilters = function() {
      try { console.log('[Wiertla] manual call → applyFullscreenFilters'); } catch (e) {}
        try { if (window.applyFullscreenFilters) window.applyFullscreenFilters(); } catch (e) { console.error(e); }
    };
    window.WiertlaCNC.debugState = function() {
      const state = {
        activeTabType: window.WiertlaCNC.activeTabType,
        itemsPerPage: window.itemsPerPage,
        currentPage: window.currentPage,
        productsLen: window.WiertlaCNC && window.WiertlaCNC.products ? window.WiertlaCNC.products.length : 'n/a'
      };
      console.table(state);
      return state;
    };
  } catch (e) {}

  // Log and trigger when fullscreen is toggled via button
  document.addEventListener('click', function(e) {
    const fsBtn = e.target.closest('.wiertla-categories__fullscreen-btn');
    if (!fsBtn) return;

    // If the button is inside the fullscreen header, it's the CLOSE button → do nothing here
    if (fsBtn.closest('.wiertla-categories__fullscreen-header')) return;

    try { console.log('[Wiertla] fullscreen open button clicked'); } catch (e2) {}
    // Open fullscreen and clone content
    setTimeout(function(){
      try { window.openWiertlaFullscreen && window.openWiertlaFullscreen(); } catch (e4) { console.error(e4); }
    }, 100);
  });

  // Observe fullscreen activation and render
  (function observeFullscreen() {
    const fs = document.querySelector('.wiertla-categories__fullscreen-mode');
    if (!fs) return;
    
    const obs = new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.attributeName === 'class') {
          const isActive = fs.classList.contains('active');
          try { console.log('[Wiertla] fullscreen active:', isActive); } catch (e) {}
          if (isActive) {
            try { if (window.applyFullscreenFilters) window.applyFullscreenFilters(); } catch (e) { console.error(e); }
          }
        }
      });
    });
    obs.observe(fs, { attributes: true });
  })();

  // Add event listeners for the status filter buttons (Nowe/Używane)
  const statusFilterButtons = document.querySelectorAll('.wiertla-categories__status-filter');
  
  statusFilterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Check if this button is already active
      const isAlreadyActive = this.classList.contains('active');
      
      // Remove active class from all status filter buttons
      statusFilterButtons.forEach(btn => btn.classList.remove('active'));
      
      // If it was already active, reset the filter
      if (isAlreadyActive) {
        window.WiertlaCNC.filters.condition = null;
        window.filterState.condition = null;
      } else {
        // Add active class to clicked button
        this.classList.add('active');
        
        // Set the condition filter based on the button text
        if (this.textContent.trim().toLowerCase().includes('nowe')) {
          window.WiertlaCNC.filters.condition = 'nowe';
          window.filterState.condition = 'nowe';
        } else if (this.textContent.trim().toLowerCase().includes('używane')) {
          window.WiertlaCNC.filters.condition = 'uzywane';
          window.filterState.condition = 'uzywane';
        }
      }
      
      // Apply filters to update the product list
      window.currentPage = 1;
      if (window.applyFilters) {
        window.applyFilters();
      }
    });
  });

  // Set default condition filter to 'nowe' on page load
  window.WiertlaCNC.filters.condition = 'nowe';
  window.filterState = window.filterState || {};
  window.filterState.condition = 'nowe';
  
  // Add event listeners for tab buttons
  const tabButtons = document.querySelectorAll('.wiertla-categories__tab');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabType = this.getAttribute('data-tab-type');
      if (!tabType) {
        return;
      }
      
      // Remove active class from all tabs
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Update active tab type
      window.WiertlaCNC.activeTabType = tabType;
      
      // Update URL with mainType parameter
      const url = new URL(window.location);
      url.searchParams.set('mainType', tabType);
      window.history.pushState({}, '', url);
      
      // Reset pagination
      window.currentPage = 1;
      
      // Reset any active category selection when switching tabs
      document.querySelectorAll('.wiertla-categories__icon-item').forEach(icon => {
        icon.classList.remove('active');
      });
      
      // Set "Wszystkie" icon as active
      const wszystkieIcon = document.querySelector('.wiertla-categories__icon-item[data-category="wszystkie"]');
      if (wszystkieIcon) {
        wszystkieIcon.classList.add('active');
      }
      
      // Update category icons based on the active tab
      updateCategoryIcons();
      
      // Apply filters with the new tab type
      if (window.applyFilters) {
        window.applyFilters();
      }
    });
  });

  // Small delay to ensure everything is loaded
  setTimeout(function() {
    // Update category icons based on the active tab
    updateCategoryIcons();
    
    if (window.applyFilters) {
      window.applyFilters();
    }
    
    // Background: fetch full catalog lazily (incremental pages)
    try {
      if (window.WiertlaCNC && window.WiertlaCNC.hydrateAllShopProductsIncremental) {
        window.WiertlaCNC.hydrateAllShopProductsIncremental();
      }
    } catch (e) {}
    
    // Force another check after a short delay in case of any race conditions
    setTimeout(function() {
      try {
        if (window.WiertlaCNC && window.WiertlaCNC.hydrateAllShopProductsIncremental) {
          window.WiertlaCNC.hydrateAllShopProductsIncremental();
        }
      } catch (e) {}
    }, 100);
  });
});

// Define openRentModal function
if (!window.WiertlaCNC) {
  window.WiertlaCNC = {};
}
window.WiertlaCNC.openRentModal = function(product) {
  const modal = document.querySelector('.wiertla-categories__mobile-rent-modal');
  if (!modal) {
    console.error('Rent modal not found');
    return;
  }

  // Update modal content
  const title = modal.querySelector('.wiertla-categories__mobile-rent-title');
  if (title) {
    title.textContent = product.title;
  }

  // Show the modal
  modal.classList.add('active');
  
  // Add close functionality
  const closeButton = modal.querySelector('.wiertla-categories__mobile-rent-close');
  if (closeButton) {
    closeButton.onclick = function() {
      modal.classList.remove('active');
    };
  }

  // Add click outside handler
  modal.onclick = function(event) {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  };
};

// Language switcher API - This is being replaced by our new translation system
window.WiertlaCNC.changeLanguage = function(language) {
  // Implementation would go here
  console.log('Language changed to:', language);
};

// Initialize mobile filter bar
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile filter bar
  const mobileFilterBar = document.querySelector('.wiertla-categories__mobile-filter-bar');
  const mobileFilterModal = document.querySelector('.wiertla-categories__mobile-filter-modal');
  
  if (mobileFilterBar) {
    // Add click event for the filter button
    const filterButton = mobileFilterBar.querySelector('.wiertla-categories__mobile-filter-button');
    if (filterButton) {
      filterButton.addEventListener('click', function() {
        if (mobileFilterModal) {
          mobileFilterModal.classList.add('active');
        }
      });
    }
    
    // Add click events for per page buttons
    const perPageButtons = mobileFilterBar.querySelectorAll('.wiertla-categories__mobile-per-page-button');
    perPageButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        perPageButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update items per page
        const newItemsPerPage = parseInt(button.getAttribute('data-items'));
        window.itemsPerPage = newItemsPerPage;
        window.currentPage = 1;
        
  // Apply filters to update the table
  if (window.applyFilters) {
    window.applyFilters();
  }
      });
    });
  }
  
  // Handle mobile per-page buttons independently since they might not be in the filter bar
  const mobilePerPageButtons = document.querySelectorAll('.wiertla-categories__mobile-per-page-button');
  mobilePerPageButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      mobilePerPageButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Update items per page
      const newItemsPerPage = parseInt(button.getAttribute('data-items') || button.getAttribute('data-value'));
      window.itemsPerPage = newItemsPerPage;
      window.currentPage = 1;
      
  // Apply filters to update the table
  if (window.applyFilters) {
    window.applyFilters();
  }
    });
  });
  
  // Make sure the filter modal close button works
  const filterModalCloseButton = document.querySelector('.wiertla-categories__mobile-filter-close');
  if (filterModalCloseButton) {
    filterModalCloseButton.addEventListener('click', function() {
      if (mobileFilterModal) {
        mobileFilterModal.classList.remove('active');
      }
    });
  }
});

// Load products from JSON endpoint
async function loadProducts() {
  try {
    const response = await fetch('/collections/wiertla-products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data && data.products && Array.isArray(data.products)) {
      window.WiertlaCNC.products = data.products;
      console.log(`[Wiertla] Loaded ${data.products.length} products from JSON endpoint`);
      return data.products;
    } else {
      console.error('[Wiertla] Invalid product data structure:', data);
      return [];
    }
  } catch (error) {
    console.error('[Wiertla] Error loading products:', error);
    return [];
  }
}

// Initialize product table data
let allProducts = Array.isArray(window.WiertlaCNC?.products) ? window.WiertlaCNC.products : [];

// Create hover preview element
const hoverPreview = document.createElement('div');
hoverPreview.className = 'wiertla-categories__hover-preview';
hoverPreview.innerHTML = `
  <div class="wiertla-categories__hover-preview-inner">
    <div class="wiertla-categories__hover-preview-content">
      <div class="wiertla-categories__hover-preview-image">
        <img src="" alt="" class="wiertla-categories__hover-preview-img">
      </div>
      <div class="wiertla-categories__hover-preview-text">
        <h3 class="wiertla-categories__hover-preview-title"></h3>
        <p class="wiertla-categories__hover-preview-description"></p>
      </div>
    </div>
  </div>
`;
document.body.appendChild(hoverPreview);

// Set search input placeholder
const searchInput = document.querySelector('.wiertla-search__input');
if (searchInput) {
  searchInput.placeholder = 'Szukaj produktów...';
} else {
  console.error('Search input not found');
}

// Initialize variables
window.currentPage = 1;
window.itemsPerPage = 100;
window.totalPages = 1;

// Initialize current filters
if (!window.currentFilters) {
  window.currentFilters = {
    typ: '',
    crown: '',
    manufacturer: '',
    search: ''
  };
}

// Detect Shopify language from the html lang attribute
let shopifyLanguage = document.documentElement.lang || 'pl';

// Initialize translations based on Shopify language
const translations = {
  'pl': {
    'fullscreen_title': 'Katalog wierteł CNC',
    'fullscreen_description': 'Stale poszerzamy stan magazynowy, aktualizując ofertę o nowe modele wierteł CNC',
    'close_fullscreen': 'Zamknij tryb pełnoekranowy',
    
    // Categories and filters
    'all': 'Wszystkie',
    'drill_type': 'Typ wiertła',
    'crown_type': 'Typ koronki',
    'manufacturer': 'Producent',
    'show_previous': 'Poprzednia',
    'show_next': 'Następna',
    'show': 'Pokaż',
    'per_page': '/ na stronę',
    
    // Table headers
    'type': 'Typ',
    'diameter': 'Średnica',
    'length': 'Długość',
    'symbol': 'Symbol',
    'vendor': 'Producent',
    'price': 'Cena netto',
    
    // Categories
    'crown': 'KORONKOWE',
    'plate': 'PŁYTKOWE',
    'vhm': 'VHM',
    'sandvik': 'SANDVIK',
    'ksem': 'KSEM',
    'amec': 'AMEC'
  },
  'en': {
    'fullscreen_title': 'CNC Drill Catalog',
    'fullscreen_description': 'Choose the drill you are interested in from our store\'s extensive selection.',
    'close_fullscreen': 'CLOSE FULLSCREEN',
    
    // Categories and filters
    'all': 'All',
    'drill_type': 'Drill type',
    'crown_type': 'Crown type',
    'manufacturer': 'Manufacturer',
    'show_previous': 'Previous',
    'show_next': 'Next',
    'show': 'Show',
    'per_page': '/ per page',
    
    // Table headers
    'type': 'Type',
    'diameter': 'Diameter',
    'length': 'Length',
    'symbol': 'Symbol',
    'vendor': 'Manufacturer',
    'price': 'Net price',
    
    // Categories
    'crown': 'CROWN',
    'plate': 'PLATE',
    'vhm': 'VHM',
    'sandvik': 'SANDVIK',
    'ksem': 'KSEM',
    'amec': 'AMEC'
  },
  'de': {
    'fullscreen_title': 'CNC-Bohrer-Katalog',
    'fullscreen_description': 'Wählen Sie den gewünschten Bohrer aus unserem umfangreichen Sortiment.',
    'close_fullscreen': 'VOLLBILD SCHLIESSEN',
    
    // Categories and filters
    'all': 'Alle',
    'drill_type': 'Bohrertyp',
    'crown_type': 'Kronentyp',
    'manufacturer': 'Hersteller',
    'show_previous': 'Vorherige',
    'show_next': 'Nächste',
    'show': 'Zeigen',
    'per_page': '/ pro Seite',
    
    // Table headers
    'type': 'Typ',
    'diameter': 'Durchmesser',
    'length': 'Länge',
    'symbol': 'Symbol',
    'vendor': 'Hersteller',
    'price': 'Nettopreis',
    
    // Categories
    'crown': 'KRONE',
    'plate': 'PLATTE',
    'vhm': 'VHM',
    'sandvik': 'SANDVIK',
    'ksem': 'KSEM',
    'amec': 'AMEC'
  }
};

// Default to Polish if language not supported
let currentLanguage = translations[shopifyLanguage] ? shopifyLanguage : 'pl';

// Check for stored language preference first, then use Shopify language or default to Polish
const storedLanguage = localStorage.getItem('shopify_locale');
if (storedLanguage && translations[storedLanguage]) {
  currentLanguage = storedLanguage;
} else {
  currentLanguage = translations[shopifyLanguage] ? shopifyLanguage : 'pl';
}

// Set the HTML lang attribute to match the selected language
document.documentElement.lang = currentLanguage;

// Watch for language changes in the Shopify language selector
document.addEventListener('click', function(e) {
  const langLink = e.target.closest('a[href*="/collections/"]');
  if (langLink) {
    const href = langLink.getAttribute('href');
    const langMatch = href.match(/\/collections\/[^\/]*\/([a-z]{2})/);
    if (langMatch) {
      const lang = langMatch[1];
      if (translations[lang]) {
        currentLanguage = lang;
        updateUILanguage();
      }
    }
  }
});

// Function to update UI text based on current language
function updateUILanguage() {
  // Simplified version - just update the results text
  const resultsText = document.querySelector('.wiertla-categories__results-text');
  if (resultsText) {
    resultsText.textContent = 'Wyświetlono wyniki ';
  }
  
  // Re-apply filters to update any text in the table
  if (window.applyFilters) {
    window.applyFilters();
  }
}

// Make necessary functions globally available
window.updateCategoryIcons = updateCategoryIcons;
window.updateUILanguage = updateUILanguage;
window.handleCategoryChange = function(category) {
  window.selectedCategory = category;
  window.currentPage = 1;
  if (window.applyFilters) {
    window.applyFilters();
  }
};

window.handleItemsPerPageChange = function(newItemsPerPage) {
  itemsPerPage = parseInt(newItemsPerPage);
  currentPage = 1;
  
  // Sync desktop per-page buttons
  document.querySelectorAll('.wiertla-categories__per-page-button').forEach(function(btn) {
    if (parseInt(btn.getAttribute('data-value')) === itemsPerPage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Sync mobile per-page buttons 
  document.querySelectorAll('.wiertla-categories__mobile-per-page-button').forEach(function(btn) {
    if (parseInt(btn.getAttribute('data-value')) === itemsPerPage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  if (window.applyFilters) {
    window.applyFilters();
  }
};

// Function to change language - Remove this in favor of our new translation system
window.changeLanguage = function(language) {
  if (translations[language]) {
    currentLanguage = language;
    document.documentElement.lang = language;
    localStorage.setItem('shopify_locale', language);
    updateUILanguage();
  }
};

// Function to update UI text based on current language
function updateUILanguage() {
  // Update pagination buttons
  document.querySelectorAll('#prevPage, #fullscreenPrevPage').forEach(btn => {
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = translations[currentLanguage].show_previous;
    }
  });
  
  document.querySelectorAll('#nextPage, #fullscreenNextPage').forEach(btn => {
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = translations[currentLanguage].show_next;
    }
  });
  
  // Update table headers
  const tableHeaders = document.querySelectorAll('.wiertla-categories__table th');
  if (tableHeaders.length >= 6) {
    tableHeaders[0].textContent = translations[currentLanguage].type;
    tableHeaders[1].textContent = translations[currentLanguage].diameter;
    tableHeaders[2].textContent = translations[currentLanguage].length;
    tableHeaders[3].textContent = translations[currentLanguage].symbol;
    tableHeaders[4].textContent = translations[currentLanguage].vendor;
    tableHeaders[5].textContent = translations[currentLanguage].price;
  }
  
  // Update filter dropdowns
  const typeFilter = document.querySelector('.wiertla-categories__filter[data-filter="type"]');
  if (typeFilter && typeFilter.options.length > 0) {
    typeFilter.options[0].textContent = translations[currentLanguage].drill_type;
  }
  
  const crownFilter = document.querySelector('.wiertla-categories__filter[data-filter="crown"]');
  if (crownFilter && crownFilter.options.length > 0) {
    crownFilter.options[0].textContent = translations[currentLanguage].crown_type;
  }
  
  const manufacturerFilter = document.querySelector('.wiertla-categories__filter[data-filter="manufacturer"]');
  if (manufacturerFilter && manufacturerFilter.options.length > 0) {
    manufacturerFilter.options[0].textContent = translations[currentLanguage].manufacturer;
  }
  
  // Update per-page labels
  document.querySelectorAll('.wiertla-categories__per-page-label').forEach((label, index) => {
    if (index === 0) {
      label.textContent = translations[currentLanguage].show + ' 50' + translations[currentLanguage].per_page;
    } else if (index === 1) {
      label.textContent = translations[currentLanguage].show + ' 100' + translations[currentLanguage].per_page;
    } else if (index === 2) {
      label.textContent = translations[currentLanguage].show + ' 250' + translations[currentLanguage].per_page;
    }
  });
  
  // Update "Wszystkie" button text
  document.querySelectorAll('.wiertla-categories__filter-button[data-filter="wszystkie"]').forEach(btn => {
    btn.textContent = translations[currentLanguage].all;
  });
  
  // Update category icons label text
  document.querySelectorAll('.wiertla-categories__icon-item').forEach(item => {
    const label = item.querySelector('.wiertla-categories__icon-label');
    const category = item.getAttribute('data-category');
    
    if (label && category) {
      switch (category) {
        case 'wszystkie':
          label.textContent = translations[currentLanguage].all;
          break;
        case 'koronkowe':
          label.textContent = translations[currentLanguage].crown;
          break;
        case 'plytkowe':
          label.textContent = translations[currentLanguage].plate;
          break;
        case 'vhm':
          label.textContent = translations[currentLanguage].vhm;
          break;
        case 'sandvik':
          label.textContent = translations[currentLanguage].sandvik;
          break;
        case 'ksem':
          label.textContent = translations[currentLanguage].ksem;
          break;
        case 'amec':
          label.textContent = translations[currentLanguage].amec;
          break;
      }
    }
  });
  
  // Update fullscreen elements if they exist
  const fullscreenTitle = document.querySelector('.wiertla-categories__fullscreen-title h2');
  if (fullscreenTitle) {
    fullscreenTitle.textContent = translations[currentLanguage].fullscreen_title;
  }
  
  const fullscreenDesc = document.querySelector('.wiertla-categories__fullscreen-title p');
  if (fullscreenDesc) {
    fullscreenDesc.textContent = translations[currentLanguage].fullscreen_description;
  }
  
  const fullscreenClose = document.querySelector('.wiertla-categories__fullscreen-close span');
  if (fullscreenClose) {
    fullscreenClose.textContent = translations[currentLanguage].close_fullscreen;
  }
  
  // Update preview elements
  const previewTitle = document.querySelector('.wiertla-categories__preview-title');
  if (previewTitle) {
    previewTitle.textContent = translations[currentLanguage].preview_title;
  }
  
  const previewText = document.querySelector('.wiertla-categories__preview-text');
  if (previewText) {
    previewText.textContent = translations[currentLanguage].preview_instruction;
  }
  
  // Update the results text
  const resultsText = document.querySelector('.wiertla-categories__results-text');
  if (resultsText) {
    resultsText.textContent = 'Wyświetlono wyniki ';
  }
  
  // Re-apply filters to update any text in the table
  if (window.applyFilters) {
    window.applyFilters();
  }
}

// Calculate initial totalPages
totalPages = Math.ceil(allProducts.length / itemsPerPage);

// Update hover preview position

// Initialize UI with current language
updateUILanguage();

// Set active language button
document.querySelectorAll('.wiertla-categories__language-btn').forEach(btn => {
  if (btn.getAttribute('data-lang') === currentLanguage) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }
});

// Connect header language switcher to our translation system
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    const langLink = e.target.closest('.header__lang-links a');
    if (langLink) {
      const href = langLink.getAttribute('href');
      const langMatch = href.match(/\/collections\/[^\/]*\/([a-z]{2})/);
      if (langMatch) {
        const lang = langMatch[1];
        if (lang && translations[lang]) {
          window.changeLanguage(lang);
          
          // Update active state in the header language links
          document.querySelectorAll('.header__lang-links a').forEach(l => {
            l.classList.remove('active');
          });
          langLink.classList.add('active');
        }
      }
    }
  });
  
  // Set initial active state for the header language links
  document.querySelectorAll('.header__lang-links a').forEach(link => {
    const href = link.getAttribute('href');
    const langMatch = href.match(/\/collections\/[^\/]*\/([a-z]{2})/);
    if (langMatch && langMatch[1] === currentLanguage) {
      link.classList.add('active');
    }
  });
});

// Watch for language changes in the header
document.addEventListener('click', function(e) {
  const langLink = e.target.closest('.header__lang-links a');
  if (langLink) {
    const href = langLink.getAttribute('href');
    const langMatch = href.match(/\/collections\/[^\/]*\/([a-z]{2})/);
    if (langMatch) {
      const lang = langMatch[1];
      if (lang && translations[lang]) {
        window.changeLanguage(lang);
        
        // Update active state in the header language links
        document.querySelectorAll('.header__lang-links a').forEach(l => {
          l.classList.remove('active');
        });
        langLink.classList.add('active');
      }
    }
  }
});

// After DOM is fully loaded, force a redraw based on current size
document.addEventListener('DOMContentLoaded', function() {
  const currentIsMobileView = window.innerWidth <= 1024;
  // Update global isMobileView
  isMobileView = currentIsMobileView;
  
  // Force a redraw after DOM is fully loaded
  setTimeout(function() {
    if (window.applyFilters) {
    window.applyFilters();
  }
  }, 100);
});

// Add ONE resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function() {
    const newIsMobileView = window.innerWidth <= 1024;
    if (newIsMobileView !== isMobileView) {
      isMobileView = newIsMobileView;
      if (window.applyFilters) {
    window.applyFilters();
  }
    }
  }, 250);
});

// Make functions globally available
window.loadProducts = loadProducts;
window.updateCategoryIcons = updateCategoryIcons;
window.updateUILanguage = updateUILanguage;
