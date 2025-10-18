/**
 * Wiertla Categories - Filtering Logic
 * Product filtering and search functionality for the Wiertla CNC product categories system
 */

// Filter products based on current filters
function filterProducts() {
  let filteredProducts = window.WiertlaCNC?.products || [];

  if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
    return [];
  }
  
  // Helper function to check Shopify availability
  function getNumber(val){
    var n = Number((val || '').toString().replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  function isShopifyAvailable(product){
    if (product == null) return false;
    // Only check Shopify's native availability - require actual inventory
    if (getNumber(product.inventory_quantity) > 0) return true;
    if (Array.isArray(product.variants)){
      for (var i=0;i<product.variants.length;i++){
        var v = product.variants[i] || {};
        if (getNumber(v.inventory_quantity) > 0) return true;
      }
    }
    // Don't trust product.available flag alone - require inventory
    return false;
  }
  
  // FIRST: Filter by availability - only show products that are available
  filteredProducts = filteredProducts.filter(product => {
    return isShopifyAvailable(product);
  });
  
  // Safety: ensure helpers exist even if defined later in other scopes
  if (typeof rodzajSynonyms === 'undefined') {
    var rodzajSynonyms = {
      plytki: {
        'wcmx': ['wcmx', 'wc', 'wcm'],
        'lcmx': ['lcmx', 'lcm'],
        '811': ['811'],
        'dft': ['dft'],
        '880': ['880'],
        'wogx': ['wogx'],
        'spgx': ['spgx', 'spgm', 'spg'],
        'p284': ['p284', 'p484']
      },
      koronki: {
        'ksem': ['ksem'],
        'idi': ['idi'],
        'p600': ['p600'],
        'icm': ['icm', 'icmx'],
        'icp': ['icp'],
        '870': ['870'],
        'amec': ['amec'],
        'ktip': ['ktip']
      }
    };
  }
  if (typeof includesAny === 'undefined') {
    var includesAny = function(text, needles) {
      const t = (text || '').toLowerCase();
      return Array.isArray(needles) && needles.some(n => t.includes(n));
    };
  }
  
  // Apply tab type filter first (wiertla, plytki, koronki)
  const activeTabType = window.WiertlaCNC.activeTabType || 'wiertla';
  let validPrefixes = window.WiertlaCNC.tabPrefixMapping[activeTabType] || [];
  
  // If we're on Wiertła tab and a wiertła sub-category is selected, narrow prefixes accordingly
  // Normalize selectedCategory (PL/EN chips) before using
  if (typeof window.WiertlaCNC.normalizeCategory === 'function' && window.selectedCategory) {
    window.selectedCategory = window.WiertlaCNC.normalizeCategory(window.selectedCategory);
  }
  if (activeTabType === 'wiertla' && window.selectedCategory && window.selectedCategory !== 'wszystkie') {
    const narrowed = window.WiertlaCNC.wiertlaCategoryToPrefixes?.[window.selectedCategory];
    if (Array.isArray(narrowed) && narrowed.length > 0) {
      validPrefixes = narrowed;
    }
  }
  
  if (validPrefixes.length > 0) {
    let beforeFilterCount = filteredProducts.length;
    
    filteredProducts = filteredProducts.filter(product => {
      const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
      if (!sku || sku.length < 2) {
        return false;
      }
      
      const skuPrefix = sku.substring(0, 2).toUpperCase();
      
      // Strict check by prefix for all tabs, including 'koronki'
      const shouldInclude = validPrefixes.includes(skuPrefix);
      return shouldInclude;
    });
    
    // Group filtered products by SKU prefix for verification
    const skuGroups = {};
    filteredProducts.forEach(product => {
      const sku = product.sku || product.custom_symbol || '';
      const prefix = sku.substring(0, 2).toUpperCase();
      if (!skuGroups[prefix]) {
        skuGroups[prefix] = [];
      }
      skuGroups[prefix].push(sku);
    });
    
    // Verify expected patterns
    if (activeTabType === 'wiertla') {
      const expectedPrefixes = ['VW', 'WV', 'PR', 'WW', 'PS', 'WK'];
    } else if (activeTabType === 'plytki') {
      const expectedPrefixes = ['PW'];

    } else if (activeTabType === 'koronki') {
      const expectedPrefixes = ['KK', 'KW', 'KI', 'KT', 'KS', 'KA', 'KG'];
    }
  }

  // Apply search filter if exists
  const searchTerm = window.currentFilters?.search?.toLowerCase();
  if (searchTerm && searchTerm.trim() !== '') {
    filteredProducts = filteredProducts.filter(product => {
      const searchableFields = [
        product.title,
        product.custom_symbol,
        product.custom_kod_producenta,
        product.vendor,
        product.custom_manufacturer,
        product.custom_typ,
        product.rodzaj,
        product.sku
      ].filter(Boolean).map(field => field.toString().toLowerCase());

      return searchableFields.some(field => field.includes(searchTerm));
    });
  }
  
  // Apply category filter if not "wszystkie"
  if (window.selectedCategory && window.selectedCategory !== 'wszystkie') {
    let beforeCategoryCount = filteredProducts.length;
    const activeTabType = window.WiertlaCNC.activeTabType || 'wiertla';
    
    filteredProducts = filteredProducts.filter(product => {
      // For Wiertła tab, prefixes already narrowed the dataset; keep all
      if (activeTabType === 'wiertla') {
        return true;
      }
      
      // For other tabs, apply category-specific filtering
      const productTyp = (product.custom_typ || product.rodzaj || '').toLowerCase();
      const productVendor = (product.vendor || product.custom_manufacturer || '').toLowerCase();
      const productTitle = (product.title || '').toLowerCase();
      const categoryLower = window.selectedCategory.toLowerCase();
      
      let matches = false;
      
      // Unified matching logic for all tabs
      if (activeTabType === 'wiertla') {
        switch (categoryLower) {
          case 'plytkowe':
            matches = productTyp.includes('plytkowe') || 
                     productTyp.includes('plate');
            break;
          
          case 'koronkowe':
            matches = productTyp.includes('koronkowe') || 
                     productTyp.includes('crown') ||
                     productTyp.includes('koronka');
            break;
          
          case 'vhm':
            matches = productTyp.includes('vhm') || 
                     productTyp.includes('solid') ||
                     productTyp.includes('carbide');
            break;
          
          case 'sandvik':
            // For Sandvik 880: Check for "880" in custom_typ field specifically
            matches = productTyp.includes('880');
            
            // Debug sandvik matching
            if (matches || productTitle.includes('880')) {
            }
            break;
          
          case 'ksem':
            matches = productTyp.includes('ksem') || 
                     productVendor.includes('ksem') ||
                     productTitle.includes('ksem');
            break;
          
          case 'amec':
            matches = productTyp.includes('amec') || 
                     productVendor.includes('amec') ||
                     productTitle.includes('amec');
            break;
          
          default:
            // Generic case-insensitive matching
            matches = productTyp.includes(categoryLower) || 
                     productVendor.includes(categoryLower) ||
                     productTitle.includes(categoryLower);
            break;
        }
      } else if (activeTabType === 'plytki') {
        // For płytki tab, use rodzaj synonyms
        const synonyms = rodzajSynonyms.plytki[categoryLower];
        if (synonyms) {
          matches = includesAny(productTyp, synonyms) || 
                   includesAny(productTitle, synonyms) ||
                   includesAny(product.sku || '', synonyms);
        }
      } else if (activeTabType === 'koronki') {
        // For koronki tab, use rodzaj synonyms
        const synonyms = rodzajSynonyms.koronki[categoryLower];
        if (synonyms) {
          matches = includesAny(productTyp, synonyms) || 
                   includesAny(productTitle, synonyms) ||
                   includesAny(product.sku || '', synonyms);
        }
      }
      
      // Debug logging for problematic categories
      if (categoryLower === 'ksem' || categoryLower === 'amec' || categoryLower === 'sandvik' || categoryLower === '880') {
        const productIndex = filteredProducts.indexOf(product);
        if (productIndex < 3) { // Log first 3 products for brevity
          
          // Special debug for 880/Sandvik products
          if (categoryLower === 'sandvik' || categoryLower === '880') {
            const has880InTyp = productTyp.includes('880');
            const has880InTitle = productTitle.includes('880');
            const has880InSymbol = (product.custom_symbol || '').toLowerCase().includes('880');
            const hasSandvikInVendor = productVendor.includes('sandvik');
            
          }
        }
      }
      
      return matches;
    });
    
    console.groupEnd();
  }

  // Apply type filter - BUT skip if we already applied a category filter that found products
  if (window.WiertlaCNC.filters.typ && window.WiertlaCNC.filters.typ !== 'all' && window.WiertlaCNC.filters.typ !== '') {
    let beforeTypeCount = filteredProducts.length;
    
    const expectedTypeValue = window.WiertlaCNC.filters.typ;
    
    // IMPORTANT: If we already filtered by category and the type matches the category, 
    // don't apply additional typ filtering as products may not have custom_typ populated
    const categoryAlreadyFiltered = window.selectedCategory && window.selectedCategory !== 'wszystkie';
    const typeMatchesCategory = expectedTypeValue === window.selectedCategory;
    
    if (categoryAlreadyFiltered && typeMatchesCategory) {
    } else {
      
      if (expectedTypeValue) {
        filteredProducts = filteredProducts.filter(product => {
          // Check multiple possible field names for TYP
          const typValue = product.custom_typ;
          const matches = typValue && typValue?.toLowerCase()?.includes(expectedTypeValue?.toLowerCase() || '');
          
          
          return matches;
        });
        
      } else {
      }
    }
  }
  
  // If we're in koronki tab, apply filter for specific koronki types
  if (window.WiertlaCNC.activeTabType === 'koronki' && window.WiertlaCNC.filters.category && window.WiertlaCNC.filters.category !== '' && window.WiertlaCNC.filters.category !== 'wszystkie') {
    const koronkiType = window.WiertlaCNC.filters.category.toUpperCase();
    filteredProducts = filteredProducts.filter(product => {
      const sku = product.sku || product.custom_symbol || '';
      const title = product.title || '';
      
      // Check if the product contains the selected koronki type in SKU or title
      return sku.toUpperCase().includes(koronkiType) || title.toUpperCase().includes(koronkiType);
    });
  }
  
  // If crown type filter exists (KK, KI, etc.), apply it
  if (window.WiertlaCNC.activeTabType === 'koronki' && window.WiertlaCNC.filters.crown && window.WiertlaCNC.filters.crown !== 'all') {
    filteredProducts = filteredProducts.filter(product => {
      const sku = product.sku || product.custom_symbol || '';
      return sku.toUpperCase().includes(window.WiertlaCNC.filters.crown.toUpperCase());
    });
  }

  // Apply manufacturer filter
  if (window.WiertlaCNC.filters.manufacturer && window.WiertlaCNC.filters.manufacturer !== 'all') {
    filteredProducts = filteredProducts.filter(product => {
      const vendor = (product.vendor || product.custom_manufacturer || '').toLowerCase();
      return vendor.includes(window.WiertlaCNC.filters.manufacturer.toLowerCase());
    });
  }

  // Tab-specific sorting
  if (activeTabType === 'wiertla') {
    filteredProducts.sort((a, b) => {
      const aFi = parseFloat(a.custom_fi || a.custom_srednica || 0);
      const bFi = parseFloat(b.custom_fi || b.custom_srednica || 0);
      return aFi - bFi;
    });
  }

  // Sort by FI (diameter) in ascending order (rosnąco) for all tab types
  // Products without FI/średnica are pushed to the end
  filteredProducts.sort((a, b) => {
    const getFiValue = (product) => {
      const fi = product.custom_fi || product.custom_srednica || product.fi || 
                 (product.metafields && product.metafields.custom && product.metafields.custom.diameter) || 
                 product.diameter;
      const numValue = parseFloat(fi);
      return isNaN(numValue) ? Number.POSITIVE_INFINITY : numValue;
    };
    
    const fiA = getFiValue(a);
    const fiB = getFiValue(b);
    const aFinite = isFinite(fiA);
    const bFinite = isFinite(fiB);
    
    // Explicitly push non-finite (missing) values to the end
    if (!aFinite && bFinite) return 1;
    if (aFinite && !bFinite) return -1;
    if (!aFinite && !bFinite) return 0;
    
    // Sort in ascending order (smallest to largest)
    return fiA - fiB;
  });

  return filteredProducts;
}

// Make filterProducts globally accessible
window.filterProducts = filterProducts;

// Add a temporary filter function that can be called from the console
window.tempFilterByTitle = function(searchTerm) {
  // Store the original allProducts
  if (!window._originalProducts) {
    window._originalProducts = [...allProducts];
  }
  
  // Filter products by title
  allProducts = window._originalProducts.filter(product => {
    const title = (product.title || '').toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });
  
  // Apply filters to update the table
  if (window.applyFilters) {
    window.applyFilters();
  }
  
  // Log the number of filtered products
};

// Function to reset the temporary filter
window.resetTempFilter = function() {
  if (window._originalProducts) {
    allProducts = [...window._originalProducts];
    if (window.applyFilters) {
    window.applyFilters();
  }
  }
};

// Apply filters and pagination
function applyFilters() {
  // Get filtered products using filterProducts function
  const filteredProducts = filterProducts();
  
  // Update pagination
  window.totalPages = Math.ceil(filteredProducts.length / window.itemsPerPage);
  
  // Reset page if needed
  if (window.currentPage > window.totalPages) {
    window.currentPage = window.totalPages > 0 ? window.totalPages : 1;
  }
  
  // Calculate slice indexes for pagination
  const startIndex = (window.currentPage - 1) * window.itemsPerPage;
  const endIndex = startIndex + window.itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);
  
  // Generate table with filtered and paginated products
  generateTable(productsToShow);
  updatePaginationButtons();
  
  // Update results count
  const resultsCount = document.querySelector('.wiertla-categories__results-count');
  const resultsNumbers = document.querySelector('#resultsCount');
  
  if (resultsCount && resultsNumbers) {
    const startDisplay = filteredProducts.length > 0 ? startIndex + 1 : 0;
    const endDisplay = Math.min(endIndex, filteredProducts.length);
    const format = resultsCount.textContent || 'Wyświetlono wyniki {0}-{1} z {2}';
    resultsNumbers.textContent = format
      .replace('{0}', startDisplay)
      .replace('{1}', endDisplay)
      .replace('{2}', filteredProducts.length);
  }
  
  // Synchronize active states for category icons
  document.querySelectorAll('.wiertla-categories__icon-item').forEach(item => {
    const category = item.getAttribute('data-category');
    if (category === window.selectedCategory) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Synchronize active states for filter buttons
  document.querySelectorAll('.wiertla-categories__filter-button').forEach(btn => {
    const filterType = btn.getAttribute('data-filter');
    if (filterType === window.selectedCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Update fullscreen mode if active
  const fullscreenMode = document.querySelector('.wiertla-categories__fullscreen-mode');
  if (fullscreenMode && fullscreenMode.classList.contains('active')) {
    if (window.applyFullscreenFilters) {
      window.applyFullscreenFilters();
    }
  }
  
  // Update URL parameters
  window.WiertlaCNC.updateUrlParams();
}

// Make functions globally available
window.applyFilters = applyFilters;
window.filterProducts = filterProducts;
