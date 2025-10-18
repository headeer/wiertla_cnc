/**
 * Wiertla Categories - Table Generation
 * Table rendering and pagination functionality for the Wiertla CNC product categories system
 */

// Generate table with products
function generateTable(products) {
  console.log('[Wiertla] generateTable called with', products.length, 'products');
  const tableBody = document.querySelector('.wiertla-categories__table tbody');
  if (!tableBody) {
    console.error('Table body element not found');
    return;
  }

  // Clear existing table content
  tableBody.innerHTML = '';

  // Check if products array is valid
  if (!Array.isArray(products) || products.length === 0) {
    const noResultsRow = document.createElement('tr');
    noResultsRow.innerHTML = `
      <td colspan="7" class="wiertla-categories__table-cell" style="text-align: center; padding: 20px;">
        Brak wyników
      </td>
    `;
    tableBody.appendChild(noResultsRow);
    return;
  }

  // Safety filter: ONLY show items that have stock/availability
  function __getNumberStrict(val){
    var n = Number((val || '').toString().replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }
  function __hasAvailabilityStrict(p){
    if (!p) return false;
    // Only check Shopify's native availability - require actual inventory
    if (__getNumberStrict(p.inventory_quantity) > 0) return true;
    if (Array.isArray(p.variants)){
      for (var i=0;i<p.variants.length;i++){
        var vv = p.variants[i] || {};
        if (__getNumberStrict(vv.inventory_quantity) > 0) return true;
      }
    }
    // Don't trust product.available flag alone - require inventory
    return false;
  }
  function __hasSkuStrict(p){
    try { return !!(p && p.sku && String(p.sku).trim() && String(p.sku).trim() !== '-'); } catch(_) { return false; }
  }
  const __safeProducts = products.filter(function(p){
    // Only show products that have availability AND have a SKU
    return __hasAvailabilityStrict(p) && __hasSkuStrict(p);
  });

  if (__safeProducts.length === 0) {
    const noResultsRow = document.createElement('tr');
    noResultsRow.innerHTML = `
      <td colspan="7" class="wiertla-categories__table-cell" style="text-align: center; padding: 20px;">
        Brak wyników
      </td>
    `;
    tableBody.appendChild(noResultsRow);
    return;
  }

  // Create preview container if it doesn't exist
  let previewContainer = document.querySelector('.wiertla-categories__preview-container');
  if (!previewContainer) {
    previewContainer = document.createElement('div');
    previewContainer.className = 'wiertla-categories__preview-container';
    previewContainer.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 300px;
      height: 100vh;
      background: white;
      z-index: 1000;
      padding: 20px;
      display: none;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    `;
    previewContainer.innerHTML = `
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
        <img src="" alt="" style="max-width: 100%; max-height: 100%; object-fit: contain;">
      </div>
    `;
    document.body.appendChild(previewContainer);
  }

  // Helper to resolve best image URL from various shapes
  function resolveImageUrl(prod, fallback){
    try {
      var candidates = [];
      if (prod && typeof prod === 'object') {
        if (prod.featured_image) candidates.push(prod.featured_image.src || prod.featured_image);
        if (prod.image) candidates.push(prod.image.src || prod.image);
        if (prod.featured_media && prod.featured_media.preview_image) candidates.push(prod.featured_media.preview_image.src);
        if (Array.isArray(prod.images) && prod.images.length) candidates.push(prod.images[0].src || prod.images[0]);
        if (Array.isArray(prod.media) && prod.media.length) {
          var m0 = prod.media[0];
          if (m0 && m0.preview_image) candidates.push(m0.preview_image.src);
        }
        if (prod.thumbnail) candidates.push(prod.thumbnail);
        if (prod.preview_image) candidates.push(prod.preview_image.src || prod.preview_image);
        if (Array.isArray(prod.variants) && prod.variants.length) {
          var v0 = prod.variants[0];
          if (v0 && v0.featured_image) candidates.push(v0.featured_image.src || v0.featured_image);
        }
        if (prod.large_image) candidates.push(prod.large_image);
      }
      for (var i=0;i<candidates.length;i++){
        var u = (candidates[i] || '').toString().trim();
        if (u && u !== 'null' && u !== 'undefined') {
          return u;
        }
      }
    } catch(e) {}
    var fb = fallback || "{{ 'custom_icons.png' | asset_url }}";
    return fb;
  }

  // Generate table rows using the provided products
  __safeProducts.forEach((product, index) => {
    if (!product) {
      console.warn('Invalid product data at index:', index);
      return;
    }

    const row = document.createElement('tr');
    row.className = 'wiertla-categories__table-row';
    row.setAttribute('data-product-id', product.id || '');
    row.setAttribute('data-href', product.url || '');
    row.setAttribute('data-handle', product.handle || '');
    
    // Add data attributes for filtering
    row.setAttribute('data-category', product.custom_category || '');
    row.setAttribute('data-status', product.rentable ? 'true' : 'false');
    row.setAttribute('data-type', product.type || '');
    row.setAttribute('data-crown', product.custom_crown || '');
    row.setAttribute('data-vendor', product.vendor || product.custom_manufacturer || '');
    row.setAttribute('data-sku', product.sku || product.custom_symbol || product.custom_kod_producenta || '');

    // Define icon mapping (row icon only, not for hover preview)
    const iconMap = {
      'VW': "{{ 'image-8.png' | asset_url }}",
      'PR': "{{ 'ico_plytkowe.png' | asset_url }}",
      'WW': "{{ 'ico_vhm.png' | asset_url }}",
      'PS': "{{ 'ico_sandvik.png' | asset_url }}",
      'WK': "{{ 'ico_ksem_table.png' | asset_url }}",
      'WV': "{{ 'ico_sandvik.png' | asset_url }}",
      'IS': "{{ 'ico_big_koronkowe.svg' | asset_url }}",
      'WA': "{{ 'ico_amec_table.png' | asset_url }}"
    };
    function getActiveTabType() {
      const activeTab = document.querySelector('.wiertla-categories__tab.active');
      return activeTab ? activeTab.getAttribute('data-tab-type') : 'wiertla';
    }
    
    // Get SKU prefix for icon
    const skuPrefix = product.sku?.substring(0, 2) || '';
    const iconUrl = iconMap[skuPrefix] || '';

    // Always set image data for the row preview functionality using robust resolver
    const imageUrl = resolveImageUrl(product, "{{ 'custom_icons.png' | asset_url }}");
    row.setAttribute('data-image', imageUrl);
    
    const activeTabType = getActiveTabType();
    
    // Generate row content based on screen width
    if (window.innerWidth <= 1024) {
      // Mobile view
      if (activeTabType === 'wiertla') {
        row.innerHTML = `
          <td class="wiertla-categories__table-cell">
            <button type="button" class="wiertla-categories__mobile-card" data-product-id="${product.id || ''}" data-product-image="${product.image || ''}" data-product-url="/products/${product.handle || product.id || ''}">
              <div class="wiertla-categories__mobile-top">
                <div class="wiertla-categories__mobile-image" style="display:none;"></div>
                <div class="wiertla-categories__mobile-fi">
                  <span class="mobile-value">${window.WiertlaCNC.formatDiameter(product)}</span>
                </div>
                <div class="wiertla-categories__mobile-dimension">
                  ${window.WiertlaCNC.formatLength(product)}
                </div>
                <div class="wiertla-categories__mobile-price">${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}
                  ${window.WiertlaCNC.hasValidRent(product) && (window.WiertlaCNC.hasValidRentPrice(product) || window.WiertlaCNC.hasValidRentValue(product)) ? ` <img src="{{ 'event.png' | asset_url }}" alt="Event" width="20" height="20" loading="lazy" style="margin-left: 8px; vertical-align: middle;">` : ''}
                </div>
              </div>
              <div class="wiertla-categories__mobile-bottom">
                <div class="wiertla-categories__mobile-vendor">
                  ${window.WiertlaCNC.formatSymbol(product.vendor || product.custom_manufacturer || '-')}
                </div>
                <div class="wiertla-categories__mobile-symbol">
                  ${(() => {
                    const raw = (product.custom_symbol || product.custom_kod_producenta || '-').toString();
                    const short = raw.length > 9 ? raw.slice(0, 8) + '…' : raw;
                    return window.WiertlaCNC.formatSymbol(short);
                  })()}
                </div>
                <div class="wiertla-categories__mobile-price-wrapper">
                </div>
              </div>
            </button>
          </td>
        `;
      } else if (activeTabType === 'plytki') {
        // Mobile: Płytki layout
        row.innerHTML = `
          <td class="wiertla-categories__table-cell">
            <button type="button" class="wiertla-categories__mobile-card" data-product-id="${product.id || ''}" data-product-url="/products/${product.handle || product.id || ''}">
              <div class="wiertla-categories__mobile-top">
                <div class="wiertla-categories__mobile-image" style="display:none;"></div>
                <div class="wiertla-categories__mobile-vendor">${window.WiertlaCNC.formatSymbol(product.custom_manufacturer || product.vendor || '-')}</div>
                <div class="wiertla-categories__mobile-price">${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}${window.WiertlaCNC.hasValidRent(product) && (window.WiertlaCNC.hasValidRentPrice(product) || window.WiertlaCNC.hasValidRentValue(product)) ? ` <img src="{{ 'event.png' | asset_url }}" alt="Event" width="20" height="20" loading="lazy" style="margin-left: 8px; vertical-align: middle;">` : ''}</div>
              </div>
              <div class="wiertla-categories__mobile-bottom">
                <div class="wiertla-categories__mobile-symbol">${window.WiertlaCNC.formatSymbol(product.custom_kod_producenta || '-')}</div>
                <div class="wiertla-categories__mobile-price-wrapper">
                  <div class="wiertla-categories__mobile-quantity">${(() => { 
                    var q = 0; 
                    var pq = Number(product && product.product_qty); 
                    var qy = Number(product && product.quantity); 
                    if (!Number.isNaN(pq) && pq > 0) { q = pq; } 
                    else if (!Number.isNaN(qy) && qy > 0) { q = qy; } 
                    else { 
                      if (typeof product.inventory_quantity === 'number') q += product.inventory_quantity; 
                      if (Array.isArray(product.variants)) { 
                        product.variants.forEach(function(v){ 
                          if (v && typeof v.inventory_quantity === 'number') q += v.inventory_quantity; 
                        }); 
                      } 
                    } 
                    return q > 0 ? String(q) : '-'; 
                  })()}</div>
                </div>
              </div>
            </button>
          </td>
        `;
      } else {
        // Mobile: Koronki layout
        row.innerHTML = `
          <td class="wiertla-categories__table-cell">
            <button type="button" class="wiertla-categories__mobile-card" data-product-id="${product.id || ''}" data-product-url="/products/${product.handle || product.id || ''}">
              <div class="wiertla-categories__mobile-top">
                <div class="wiertla-categories__mobile-image" style="display:none;"></div>
                <div class="wiertla-categories__mobile-fi"><span class="mobile-value">${(() => { 
                  const fi = product.custom_fi || (product.metafields && product.metafields.custom && (product.metafields.custom.srednica || product.metafields.custom.diameter)) || product.custom_srednica || product.custom_srednica_display || ''; 
                  const v = (fi || '').toString().trim(); 
                  return v ? ('⌀ ' + v) : '-'; 
                })()}</span></div>
                <div class="wiertla-categories__mobile-vendor">${window.WiertlaCNC.formatSymbol(product.custom_manufacturer || product.vendor || '-')}</div>
                <div class="wiertla-categories__mobile-price">${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}${window.WiertlaCNC.hasValidRent(product) && (window.WiertlaCNC.hasValidRentPrice(product) || window.WiertlaCNC.hasValidRentValue(product)) ? ` <img src="{{ 'event.png' | asset_url }}" alt="Event" width="20" height="20" loading="lazy" style="margin-left: 8px; vertical-align: middle;">` : ''}</div>
              </div>
              <div class="wiertla-categories__mobile-bottom">
                <div class="wiertla-categories__mobile-symbol">${window.WiertlaCNC.formatSymbol(product.custom_kod_producenta || '-')}</div>
                <div class="wiertla-categories__mobile-price-wrapper">
                  <div class="wiertla-categories__mobile-quantity">${(() => { 
                    var q = 0; 
                    var pq = Number(product && product.product_qty); 
                    var qy = Number(product && product.quantity); 
                    if (!Number.isNaN(pq) && pq > 0) { q = pq; } 
                    else if (!Number.isNaN(qy) && qy > 0) { q = qy; } 
                    else { 
                      if (typeof product.inventory_quantity === 'number') q += product.inventory_quantity; 
                      if (Array.isArray(product.variants)) { 
                        product.variants.forEach(function(v){ 
                          if (v && typeof v.inventory_quantity === 'number') q += v.inventory_quantity; 
                        }); 
                      } 
                    } 
                    return q > 0 ? String(q) : '-'; 
                  })()}</div>
                </div>
              </div>
            </button>
          </td>
        `;
      }
    } else {
      // Desktop view
      if (activeTabType === 'wiertla') {
        // Desktop view for Wiertla: Typ | ⌀ Fi | D/mm | Symbol | Producent | Cena netto
        row.innerHTML = `
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${iconUrl ? `<img src="${iconUrl}" alt="${product.type || 'Product'}" width="34" height="34" loading="lazy">` : '-'}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatDiameter(product)}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatLength(product)}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatSymbol(product.custom_symbol || product.custom_kod_producenta || '-')}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatSymbol(product.vendor || product.custom_manufacturer || '-')}
          </td>
          ${product.custom_rent_value ? `<td class="wiertla-categories__table-cell" title="Wynajem">${product.custom_rent_value}</td>` : ''}
          <td class="wiertla-categories__table-cell">
            <div class="wiertla-categories__price-wrapper">
              <span class="wiertla-categories__price" data-href="/products/${product.handle}">${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}</span>
              ${window.WiertlaCNC.hasValidRent(product) && (window.WiertlaCNC.hasValidRentPrice(product) || window.WiertlaCNC.hasValidRentValue(product)) ? `
                <button class="wiertla-categories__rent-button" data-product-id="${product.id}"
                  data-symbol="${(product.custom_symbol || product.custom_kod_producenta || (product.metafields && product.metafields.custom && (product.metafields.custom.symbol || product.metafields.custom.kod_producenta)) || product.symbol || product.sku || '').toString().replace(/"/g, '&quot;')}">
                  <span>RENT A TOOL</span>
                </button>
              ` : ''}
            </div>
          </td>
        `;
      } else if (activeTabType === 'koronki') {
        // Desktop view for Koronki: ⌀ Fi | Producent | Kod producenta | Ilość | Cena netto
        row.innerHTML = `
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${(() => {
              const fi = product.custom_fi || (product.metafields && product.metafields.custom && product.metafields.custom.srednica) || product.custom_srednica || product.custom_srednica_display || '';
              const v = (fi || '').toString().trim();
              return v ? ('⌀ ' + v) : '-';
            })()}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatSymbol(product.custom_manufacturer || product.vendor || '-')}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatSymbol(product.custom_kod_producenta || '-')}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${(() => {
              var q = 0;
              var pq = Number(product && product.product_qty);
              var qy = Number(product && product.quantity);
              if (!Number.isNaN(pq) && pq > 0) {
                q = pq;
              } else if (!Number.isNaN(qy) && qy > 0) {
                q = qy;
              } else {
                if (typeof product.inventory_quantity === 'number') q += product.inventory_quantity;
                if (Array.isArray(product.variants)) {
                  product.variants.forEach(function(v){ if (v && typeof v.inventory_quantity === 'number') q += v.inventory_quantity; });
                }
              }
              return q > 0 ? String(q) : '-';
            })()}
          </td>
          <td class="wiertla-categories__table-cell">
            <div class="wiertla-categories__price-wrapper">
              <span class="wiertla-categories__price" data-href="/products/${product.handle}">${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}</span>
              ${window.WiertlaCNC.hasValidRent(product) && (window.WiertlaCNC.hasValidRentPrice(product) || window.WiertlaCNC.hasValidRentValue(product)) ? `
                <button class="wiertla-categories__rent-button" data-product-id="${product.id}"
                  data-symbol="${(product.custom_symbol || product.custom_kod_producenta || (product.metafields && product.metafields.custom && (product.metafields.custom.symbol || product.metafields.custom.kod_producenta)) || product.symbol || product.sku || '').toString().replace(/"/g, '&quot;')}">
                  <span>RENT A TOOL</span>
                </button>
              ` : ''}
            </div>
          </td>
        `;
      } else {
        // Desktop view for Płytki: Producent | Kod producenta | Ilość | Cena netto
        row.innerHTML = `
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatSymbol(product.custom_manufacturer || product.vendor || '-')}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${window.WiertlaCNC.formatSymbol(product.custom_kod_producenta || '-')}
          </td>
          <td class="wiertla-categories__table-cell" data-href="/products/${product.handle || ''}">
            ${(() => {
              var q = 0;
              var pq = Number(product && product.product_qty);
              var qy = Number(product && product.quantity);
              if (!Number.isNaN(pq) && pq > 0) {
                q = pq;
              } else if (!Number.isNaN(qy) && qy > 0) {
                q = qy;
              } else {
                if (typeof product.inventory_quantity === 'number') q += product.inventory_quantity;
                if (Array.isArray(product.variants)) {
                  product.variants.forEach(function(v){ if (v && typeof v.inventory_quantity === 'number') q += v.inventory_quantity; });
                }
              }
              return q > 0 ? String(q) : '-';
            })()}
          </td>
          <td class="wiertla-categories__table-cell">
            <div class="wiertla-categories__price-wrapper">
              <span class="wiertla-categories__price" data-href="/products/${product.handle}">${window.WiertlaCNC.formatPrice(product.price, product.sku || product.custom_symbol || 'Unknown')}</span>
              ${window.WiertlaCNC.hasValidRent(product) && (window.WiertlaCNC.hasValidRentPrice(product) || window.WiertlaCNC.hasValidRentValue(product)) ? `
                <button class="wiertla-categories__rent-button" data-product-id="${product.id}"
                  data-symbol="${(product.custom_symbol || product.custom_kod_producenta || (product.metafields && product.metafields.custom && (product.metafields.custom.symbol || product.metafields.custom.kod_producenta)) || product.symbol || product.sku || '').toString().replace(/"/g, '&quot;')}">
                  <span>RENT A TOOL</span>
                </button>
              ` : ''}
            </div>
          </td>
        `;
      }
    }

    // Add click event for row navigation
    row.addEventListener('click', function(e) {
      // Don't navigate if clicking on rent button or mobile card
      if (e.target.closest('.wiertla-categories__rent-button') || e.target.closest('.wiertla-categories__mobile-card')) {
        return;
      }
      
      const href = this.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });

    tableBody.appendChild(row);
  });
}

// Update pagination buttons
function updatePaginationButtons() {
  const prevButton = document.querySelector('#prevPage');
  const nextButton = document.querySelector('#nextPage');
  const fullscreenPrevButton = document.querySelector('#fullscreenPrevPage');
  const fullscreenNextButton = document.querySelector('#fullscreenNextPage');
  
  if (prevButton) {
    prevButton.disabled = window.currentPage <= 1;
    prevButton.classList.toggle('disabled', window.currentPage <= 1);
  }
  
  if (nextButton) {
    nextButton.disabled = window.currentPage >= window.totalPages;
    nextButton.classList.toggle('disabled', window.currentPage >= window.totalPages);
  }
  
  if (fullscreenPrevButton) {
    fullscreenPrevButton.disabled = window.currentPage <= 1;
    fullscreenPrevButton.classList.toggle('disabled', window.currentPage <= 1);
  }
  
  if (fullscreenNextButton) {
    fullscreenNextButton.disabled = window.currentPage >= window.totalPages;
    fullscreenNextButton.classList.toggle('disabled', window.currentPage >= window.totalPages);
  }
}

// Make functions globally available
window.generateTable = generateTable;
window.updatePaginationButtons = updatePaginationButtons;
