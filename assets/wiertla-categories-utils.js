/**
 * Wiertla Categories - Utility Functions
 * Shared utility functions for the Wiertla CNC product categories system
 */

// Initialize global WiertlaCNC object if it doesn't exist
if (!window.WiertlaCNC) {
  window.WiertlaCNC = {};
}

// Shared price formatting function
window.WiertlaCNC.formatPrice = function(price, productSku = 'Unknown') {
  if (price !== undefined && price !== null && price !== '') {
    // Convert to string for consistent handling
    const priceStr = String(price).trim();
    
    // Check if price is zero or empty
    if (priceStr === '' || priceStr === '0' || priceStr === '0.0' || price === 0 || priceStr === '0.00' || priceStr === 'null' || priceStr === 'undefined') {
      return '-';
    }
    
    // If price already has "zł", use as is
    if (priceStr.includes('zł')) {
      return priceStr;
    }
    
    // If price is a raw number (like "1100.0" or "890"), add "zł"
    // More robust regex to catch various number formats
    if (priceStr.match(/^\d+\.?\d*$/) || priceStr.match(/^\d+$/) || priceStr.match(/^\d+\.0+$/)) {
      return priceStr + ' zł';
    }
    
    // If it's a valid number but in string format, try to format it
    const numValue = parseFloat(priceStr);
    if (!isNaN(numValue) && numValue > 0) {
      return numValue.toString() + ' zł';
    }
  }
  return '-';
};

// Format symbol consistently
window.WiertlaCNC.formatSymbol = function(symbol) {
  if (!symbol || symbol === '-') return '-';
  return symbol;
};

// Check if product has valid rent data
window.WiertlaCNC.hasValidRent = function(product) {
  return (product.rent || product.custom_rent) && 
         (product.rent || product.custom_rent) !== '' && 
         (product.rent || product.custom_rent) !== '-' && 
         (product.rent || product.custom_rent) !== null && 
         (product.rent || product.custom_rent) !== 'undefined';
};

// Check if product has valid rent price
window.WiertlaCNC.hasValidRentPrice = function(product) {
  return (product.rent_price || product.custom_rent_value) && 
         (product.rent_price || product.custom_rent_value) !== '' && 
         (product.rent_price || product.custom_rent_value) !== '-' && 
         (product.rent_price || product.custom_rent_value) !== null && 
         (product.rent_price || product.custom_rent_value) !== 'undefined';
};

// Check if product has valid rent value
window.WiertlaCNC.hasValidRentValue = function(product) {
  return (product.rent_value || product.custom_rent_value) && 
         (product.rent_value || product.custom_rent_value) !== '' && 
         (product.rent_value || product.custom_rent_value) !== '-' && 
         (product.rent_value || product.custom_rent_value) !== null && 
         (product.rent_value || product.custom_rent_value) !== 'undefined';
};

// Get product icon URL
window.WiertlaCNC.getProductIcon = function(product) {
  const type = (product.custom_typ || product.rodzaj || '').toString().toLowerCase();
  const iconMap = {
    'wiertła': '{{ "ico_big_wiertla.svg" | asset_url }}',
    'wiertla': '{{ "ico_big_wiertla.svg" | asset_url }}',
    'płytkowe': '{{ "ico_big_plytkowe.svg" | asset_url }}',
    'plytkowe': '{{ "ico_big_plytkowe.svg" | asset_url }}',
    'koronki': '{{ "ico_big_koronki.svg" | asset_url }}',
    'dsk': '{{ "ico_big_plytkowe.svg" | asset_url }}'
  };
  return iconMap[type] || '{{ "ico_big_wiertla.svg" | asset_url }}';
};

// Format product diameter
window.WiertlaCNC.formatDiameter = function(product) {
  const fi = product.custom_fi;
  if (!fi || fi === '-') return '-';
  return `⌀${fi}`;
};

// Format product length
window.WiertlaCNC.formatLength = function(product) {
  return (product.metafields && product.metafields.custom && product.metafields.custom.custom_working_length) || 
         product.custom_working_length || 
         product.custom_xd || 
         '-';
};

// Helper function to check Shopify availability
window.WiertlaCNC.isShopifyAvailable = function(product) {
  function getNumber(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseFloat(val.replace(',', '.'));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  
  const inventory = getNumber(product.inventory_quantity);
  const productQty = getNumber(product.product_qty);
  const quantity = getNumber(product.quantity);
  
  if (inventory > 0 || productQty > 0 || quantity > 0) {
    return true;
  }
  
  if (product.variants && Array.isArray(product.variants)) {
    return product.variants.some(variant => getNumber(variant.inventory_quantity) > 0);
  }
  
  return false;
};

// Normalize UI category labels (PL/EN) to internal keys
window.WiertlaCNC.normalizeCategory = function(value) {
  if (!value) return 'wszystkie';
  
  const normalized = value.toLowerCase().trim();
  const mapping = {
    'all': 'wszystkie',
    'wszystkie': 'wszystkie',
    'crown': 'koronkowe',
    'koronkowe': 'koronkowe',
    'plate': 'plytkowe',
    'płytkowe': 'plytkowe',
    'plytkowe': 'plytkowe',
    'solid': 'vhm',
    'vhm': 'vhm',
    'sandvik': 'sandvik',
    'ksem': 'ksem',
    'amec': 'amec'
  };
  
  return mapping[normalized] || normalized;
};

// Update URL parameters
window.WiertlaCNC.updateUrlParams = function() {
  const url = new URL(window.location);
  
  // Update mainType parameter
  if (window.WiertlaCNC.activeTabType) {
    url.searchParams.set('mainType', window.WiertlaCNC.activeTabType);
  }
  
  // Update category parameter
  if (window.selectedCategory) {
    url.searchParams.set('category', window.selectedCategory);
  }
  
  // Update typ parameter
  if (window.WiertlaCNC.filters && window.WiertlaCNC.filters.typ && window.WiertlaCNC.filters.typ !== '') {
    url.searchParams.set('typ', window.WiertlaCNC.filters.typ);
  } else {
    url.searchParams.delete('typ');
  }
  
  // Update perPage parameter
  if (window.itemsPerPage && window.itemsPerPage !== 250) {
    url.searchParams.set('perPage', window.itemsPerPage);
  }
  
  // Update the URL without reloading the page
  window.history.replaceState({}, '', url);
};

// Initialize global products array
window.WiertlaCNC.products = [];
window.products = []; // For compatibility

// Initialize filters
if (!window.WiertlaCNC.filters) {
  window.WiertlaCNC.filters = {
    typ: '',
    crown: '',
    manufacturer: '',
    search: '',
    category: ''
  };
}

// Initialize current filters
if (!window.currentFilters) {
  window.currentFilters = {
    typ: '',
    crown: '',
    manufacturer: '',
    search: '',
    category: ''
  };
}

// Initialize filter state
if (!window.filterState) {
  window.filterState = {
    condition: 'nowe'
  };
}

// Initialize pagination
window.currentPage = 1;
window.itemsPerPage = 100;
window.totalPages = 1;
