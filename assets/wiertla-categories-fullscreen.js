/**
 * Wiertla Categories - Fullscreen Functionality
 * Fullscreen mode and related functionality for the Wiertla CNC product categories system
 */

// Apply filters to fullscreen mode
function applyFullscreenFilters() {
  try { console.log('[Fullscreen] applyFullscreenFilters start', { activeTabType: window.WiertlaCNC && window.WiertlaCNC.activeTabType, itemsPerPage: window.itemsPerPage, currentPage: window.currentPage }); } catch (e) {}
  const filteredProducts = window.filterProducts ? window.filterProducts() : [];
  try { console.log('[Fullscreen] filtered count', filteredProducts && filteredProducts.length); } catch (e) {}
  const startIndex = (window.currentPage - 1) * window.itemsPerPage;
  const endIndex = startIndex + window.itemsPerPage;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);
  
  const tableBody = document.querySelector('.wiertla-categories__fullscreen-content .wiertla-categories__table tbody') || document.getElementById('fullscreenProductsTableBody');
  try { console.log('[Fullscreen] tableBody found', !!tableBody); } catch (e) {}
  if (!tableBody) {
    console.error('[Fullscreen] table body element not found!');
    return;
  }
  
  tableBody.innerHTML = '';
  
  if (productsToShow.length === 0) {
    const noResultsRow = document.createElement('tr');
    noResultsRow.innerHTML = `<td colspan="7" style="text-align: center; padding: 20px;">Brak wyników</td>`;
    tableBody.appendChild(noResultsRow);
    try { console.log('[Fullscreen] no results'); } catch (e) {}
    return;
  }
  
  try { console.log('[Fullscreen] render rows', productsToShow.length); } catch (e) {}
  // Safety filter for fullscreen: ONLY show items with stock/availability AND valid SKU
  function __fsNum(v){ var n = Number((v||'').toString().replace(',', '.')); return isNaN(n)?0:n; }
  function __fsAvail(p){
    if (!p) return false;
    // Only check Shopify's native availability - require actual inventory
    if (__fsNum(p.inventory_quantity) > 0) return true;
    if (Array.isArray(p.variants)){
      for (var i=0;i<p.variants.length;i++){
        var vv = p.variants[i] || {};
        if (__fsNum(vv.inventory_quantity) > 0) return true;
      }
    }
    // Don't trust product.available flag alone - require inventory
    return false;
  }
  function __fsHasSku(p){ try { return !!(p && p.sku && String(p.sku).trim() && String(p.sku).trim() !== '-'); } catch(_) { return false; } }
  const productsToRender = productsToShow.filter(function(p){ return __fsAvail(p) && __fsHasSku(p); });
  
  productsToRender.forEach(product => {
    const row = document.createElement('tr');
    row.className = 'wiertla-categories__table-row';
    row.setAttribute('data-product-id', product.id);
    
    // Add data attributes for filtering
    row.setAttribute('data-category', product.custom_category || '');
    row.setAttribute('data-status', product.rentable ? 'true' : 'false');
    row.setAttribute('data-type', product.type || '');
    row.setAttribute('data-crown', product.custom_crown || '');
    row.setAttribute('data-vendor', product.vendor || product.custom_manufacturer || '');
    row.setAttribute('data-sku', product.sku || product.custom_symbol || product.custom_kod_producenta || '');
    const productUrl = (product.url && product.url !== '#') ? product.url : (product.handle ? ('/products/' + product.handle) : '');
    if (productUrl) row.setAttribute('data-href', productUrl);

    const fiVal = (function(p){
      const fi = p.custom_fi || p.custom_srednica || p.fi || (p.metafields && p.metafields.custom && p.metafields.custom.diameter) || p.diameter;
      if (!fi) return '-';
      const fiStr = String(fi).trim();
      return fiStr ? ('⌀ ' + fiStr.replace(/^⌀\s*/, '')) : '-';
    })(product);
    const lenVal = (function(p){
      const v = p.custom_working_length || p.custom_xd || (p.metafields && p.metafields.custom && p.metafields.custom.working_length) || p.length || p.d || p.depth;
      return (v && String(v).trim()) ? String(v) : '-';
    })(product);
    const symVal = (function(p){
      const v = p.custom_symbol || p.custom_kod_producenta || p.symbol || p.sku;
      return (v && String(v).trim()) ? String(v) : '-';
    })(product);
    try { console.log('[Fullscreen] row', { fi: fiVal, len: lenVal, sym: symVal }); } catch (e) {}
    
    row.innerHTML = `
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--type">
        <img src="${product.typeIcon}" alt="${product.type}" class="wiertla-categories__type-icon">
      </td>
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--diameter">
        ${fiVal}
      </td>
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--length">
        ${lenVal}
      </td>
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--symbol">
        ${symVal}
      </td>
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--vendor" data-href="/products/${product.handle || ''}">
        ${product.vendor || product.custom_manufacturer || '-'}
      </td>
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--price">
        ${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}
      </td>
      <td class="wiertla-categories__table-cell wiertla-categories__table-cell--name">
        ${product.name || '-'}
      </td>
    `;
    
    // Always set data-image with the product's real image when building the row
    (function setRowImageData() {
      var url = null;
      try {
        if (product && product.featured_media && product.featured_media.preview_image) url = product.featured_media.preview_image.src;
        if (!url && product && product.featured_image) url = product.featured_image.src || product.featured_image;
        if (!url && Array.isArray(product.images) && product.images.length) url = product.images[0].src || product.images[0];
        if (!url && product && product.image) url = product.image.src || product.image;
        if (!url && Array.isArray(product.media) && product.media.length && product.media[0].preview_image) url = product.media[0].preview_image.src;
        if (!url && Array.isArray(product.variants) && product.variants.length && product.variants[0].featured_image) url = product.variants[0].featured_image.src || product.variants[0].featured_image;
      } catch(e) {}
      if (!url) url = "{{ 'custom_icons.png' | asset_url }}";
      row.setAttribute('data-image', url);
    })();
    
    row.addEventListener('click', function(e) {
      if (e.target.tagName !== 'A' && e.target.tagName !== 'IMG') {
        const link = this.querySelector('.wiertla-categories__product-link');
        if (link) {
          window.location.href = link.getAttribute('href');
        }
      }
    });
    
    tableBody.appendChild(row);
  });
  
  // Update result count in fullscreen mode
  const resultsCount = document.getElementById('fullscreenResultsCount') || document.querySelector('.wiertla-categories__fullscreen-right .wiertla-categories__results-numbers');
  if (resultsCount) {
    const startIndex = (window.currentPage - 1) * window.itemsPerPage + 1;
    const endIndex = Math.min(startIndex + productsToRender.length - 1, filteredProducts.length);
    const format = 'Wyświetlono wyniki {0}-{1} z {2}';
    resultsCount.textContent = format.replace('{0}', startIndex).replace('{1}', endIndex).replace('{2}', filteredProducts.length);
  }
  
  // Update pagination buttons
  const prevButton = document.getElementById('fullscreenPrevPage') || document.querySelector('.wiertla-categories__fullscreen-right #prevPage');
  const nextButton = document.getElementById('fullscreenNextPage') || document.querySelector('.wiertla-categories__fullscreen-right #nextPage');
  
  if (prevButton) {
    prevButton.disabled = window.currentPage <= 1;
  }
  
  if (nextButton) {
    nextButton.disabled = window.currentPage >= window.totalPages;
  }
  
  // Synchronize active states for category icons in fullscreen view
  document.querySelectorAll('.wiertla-categories__fullscreen-content .wiertla-categories__icon-item').forEach(item => {
    const itemCategory = item.dataset.category;
    if (itemCategory === window.selectedCategory) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
  
  // Synchronize active states for filter buttons in fullscreen view
  document.querySelectorAll('.wiertla-categories__fullscreen-content .wiertla-categories__filter-button').forEach(btn => {
    const btnFilter = btn.getAttribute('data-filter');
    if (btnFilter === window.selectedCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Add fullscreen event listeners
function addFullscreenEventListeners() {
  // Handle fullscreen pagination
  const prevButton = document.getElementById('fullscreenPrevPage');
  const nextButton = document.getElementById('fullscreenNextPage');
  
  if (prevButton) {
    prevButton.addEventListener('click', function() {
      if (window.currentPage > 1) {
        window.currentPage--;
        window.applyFilters(); // Update main view
        applyFullscreenFilters(); // Update fullscreen view
      }
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function() {
      if (window.currentPage < window.totalPages) {
        window.currentPage++;
        window.applyFilters(); // Update main view
        applyFullscreenFilters(); // Update fullscreen view
      }
    });
  }
  
  // Handle fullscreen filters
  const filterSelects = document.querySelectorAll('.wiertla-categories__fullscreen-content .wiertla-categories__filter');
  
  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      const filterType = this.getAttribute('data-filter');
      window.currentFilters[filterType] = this.value;
      window.currentPage = 1;
      window.applyFilters(); // Update main view
      applyFullscreenFilters(); // Update fullscreen view
    });
  });
  
  // Handle fullscreen category icons
  const categoryIcons = document.querySelectorAll('.wiertla-categories__fullscreen-content .wiertla-categories__icon-item');
  
  categoryIcons.forEach(icon => {
    icon.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      window.selectedCategory = category;
      window.currentPage = 1;
      window.applyFilters(); // Update main view
      applyFullscreenFilters(); // Update fullscreen view
    });
  });
  
  // Handle fullscreen filter buttons
  const filterButtons = document.querySelectorAll('.wiertla-categories__fullscreen-content .wiertla-categories__filter-button');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterType = this.getAttribute('data-filter');
      window.selectedCategory = filterType;
      window.currentPage = 1;
      window.applyFilters(); // Update main view
      applyFullscreenFilters(); // Update fullscreen view
    });
  });
}

// Open fullscreen mode
function openWiertlaFullscreen() {
  const fullscreenMode = document.querySelector('.wiertla-categories__fullscreen-mode');
  if (!fullscreenMode) {
    console.error('Fullscreen mode element not found');
    return;
  }
  
  // Clone the main content to fullscreen
  const mainContent = document.querySelector('.wiertla-categories__content');
  const fullscreenContent = document.querySelector('.wiertla-categories__fullscreen-content');
  
  if (mainContent && fullscreenContent) {
    // Clear existing content
    fullscreenContent.innerHTML = '';
    
    // Clone the main content
    const clonedContent = mainContent.cloneNode(true);
    fullscreenContent.appendChild(clonedContent);
    
    // Add fullscreen-specific IDs to elements
    const clonedTable = fullscreenContent.querySelector('.wiertla-categories__table tbody');
    if (clonedTable) {
      clonedTable.id = 'fullscreenProductsTableBody';
    }
    
    const clonedResults = fullscreenContent.querySelector('.wiertla-categories__results-numbers');
    if (clonedResults) {
      clonedResults.id = 'fullscreenResultsCount';
    }
    
    const clonedPrevButton = fullscreenContent.querySelector('#prevPage');
    if (clonedPrevButton) {
      clonedPrevButton.id = 'fullscreenPrevPage';
    }
    
    const clonedNextButton = fullscreenContent.querySelector('#nextPage');
    if (clonedNextButton) {
      clonedNextButton.id = 'fullscreenNextPage';
    }
  }
  
  // Show fullscreen mode
  fullscreenMode.classList.add('active');
  
  // Apply filters to fullscreen
  applyFullscreenFilters();
  
  // Add event listeners for fullscreen elements
  addFullscreenEventListeners();
}

// Close fullscreen mode
function closeWiertlaFullscreen() {
  const fullscreenMode = document.querySelector('.wiertla-categories__fullscreen-mode');
  if (fullscreenMode) {
    fullscreenMode.classList.remove('active');
  }
}

// Make functions globally available
window.applyFullscreenFilters = applyFullscreenFilters;
window.addFullscreenEventListeners = addFullscreenEventListeners;
window.openWiertlaFullscreen = openWiertlaFullscreen;
window.closeWiertlaFullscreen = closeWiertlaFullscreen;
