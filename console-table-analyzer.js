/**
 * Wiertla CNC Table Analyzer - Console Script
 * Paste this into browser console to analyze the products table
 */

(function() {
  console.log('🔧 Wiertla CNC Table Analyzer Starting...');
  
  // Find the main table
  const table = document.querySelector('.wiertla-categories__table');
  if (!table) {
    console.error('❌ Table not found! Make sure you are on the correct page.');
    return;
  }
  
  const tbody = table.querySelector('#productsTableBody');
  if (!tbody) {
    console.error('❌ Table body not found!');
    return;
  }
  
  // Check if table shows "no results" message
  const noResultsCell = tbody.querySelector('td[colspan]');
  if (noResultsCell && noResultsCell.textContent.includes('Brak wyników')) {
    console.log('⚠️ Table shows "No results" message. This might mean:');
    console.log('   1. No products are loaded yet');
    console.log('   2. Filters are applied that hide all products');
    console.log('   3. Products are still loading');
    console.log('   Try waiting a moment or clearing filters.');
    return;
  }
  
  // Get all product rows
  const productRows = tbody.querySelectorAll('tr:not([style*="display: none"])');
  console.log(`📊 Found ${productRows.length} product rows in table`);
  
  if (productRows.length === 0) {
    console.log('⚠️ No product rows found. Table might be empty or still loading.');
    return;
  }
  
  // Analyze table headers to determine current category
  const wiertlaHeader = table.querySelector('.wiertla-categories__table-header-wiertla');
  const plytkiHeader = table.querySelector('.wiertla-categories__table-header-plytki');
  const koronkiHeader = table.querySelector('.wiertla-categories__table-header-koronki');
  
  let currentCategory = 'unknown';
  if (wiertlaHeader && wiertlaHeader.style.display !== 'none') {
    currentCategory = 'wiertla';
  } else if (plytkiHeader && plytkiHeader.style.display !== 'none') {
    currentCategory = 'plytki';
  } else if (koronkiHeader && koronkiHeader.style.display !== 'none') {
    currentCategory = 'koronki';
  }
  
  console.log(`🏷️ Current category: ${currentCategory}`);
  
  // Analyze products based on category
  const analysis = {
    total: productRows.length,
    available: 0,
    unavailable: 0,
    products: [],
    manufacturers: {},
    categories: {}
  };
  
  productRows.forEach((row, index) => {
    try {
      const cells = row.querySelectorAll('td');
      if (cells.length === 0) return;
      
      let product = {
        index: index + 1,
        category: currentCategory,
        available: false,
        quantity: 0,
        price: '',
        manufacturer: '',
        sku: '',
        diameter: '',
        length: '',
        type: ''
      };
      
      // Parse based on category
      if (currentCategory === 'wiertla') {
        // WIERTŁA: Typ, ⌀ Fi, D/mm, Symbol, Producent, Cena netto
        if (cells.length >= 6) {
          product.type = cells[0]?.textContent?.trim() || '';
          product.diameter = cells[1]?.textContent?.trim() || '';
          product.length = cells[2]?.textContent?.trim() || '';
          product.sku = cells[3]?.textContent?.trim() || '';
          product.manufacturer = cells[4]?.textContent?.trim() || '';
          product.price = cells[5]?.textContent?.trim() || '';
          
          // Check availability (look for quantity indicators or availability classes)
          const hasQuantity = product.sku && product.sku !== '-';
          const hasPrice = product.price && product.price !== '-' && product.price !== '';
          product.available = hasQuantity && hasPrice;
          product.quantity = hasQuantity ? 1 : 0; // Assume 1 if available
        }
      } else if (currentCategory === 'plytki') {
        // PŁYTKI: Producent, Kod producenta, Ilość, Cena netto
        if (cells.length >= 4) {
          product.manufacturer = cells[0]?.textContent?.trim() || '';
          product.sku = cells[1]?.textContent?.trim() || '';
          const quantityText = cells[2]?.textContent?.trim() || '';
          product.price = cells[3]?.textContent?.trim() || '';
          
          // Parse quantity
          const quantityMatch = quantityText.match(/(\d+)/);
          product.quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
          product.available = product.quantity > 0;
        }
      } else if (currentCategory === 'koronki') {
        // KORONKI: ⌀ Fi, Producent, Kod producenta, Ilość, Cena netto
        if (cells.length >= 5) {
          product.diameter = cells[0]?.textContent?.trim() || '';
          product.manufacturer = cells[1]?.textContent?.trim() || '';
          product.sku = cells[2]?.textContent?.trim() || '';
          const quantityText = cells[3]?.textContent?.trim() || '';
          product.price = cells[4]?.textContent?.trim() || '';
          
          // Parse quantity
          const quantityMatch = quantityText.match(/(\d+)/);
          product.quantity = quantityMatch ? parseInt(quantityMatch[1]) : 0;
          product.available = product.quantity > 0;
        }
      }
      
      // Update analysis
      if (product.available) {
        analysis.available++;
      } else {
        analysis.unavailable++;
      }
      
      analysis.products.push(product);
      
      // Track manufacturers
      if (product.manufacturer) {
        if (!analysis.manufacturers[product.manufacturer]) {
          analysis.manufacturers[product.manufacturer] = { total: 0, available: 0 };
        }
        analysis.manufacturers[product.manufacturer].total++;
        if (product.available) {
          analysis.manufacturers[product.manufacturer].available++;
        }
      }
      
    } catch (error) {
      console.warn(`⚠️ Error parsing row ${index + 1}:`, error);
    }
  });
  
  // Display results
  console.log('\n' + '='.repeat(60));
  console.log('📊 WIERTLA CNC TABLE ANALYSIS RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n🏷️ Category: ${currentCategory.toUpperCase()}`);
  console.log(`📦 Total Products: ${analysis.total}`);
  console.log(`✅ Available: ${analysis.available} (${analysis.total > 0 ? ((analysis.available / analysis.total) * 100).toFixed(1) : 0}%)`);
  console.log(`❌ Unavailable: ${analysis.unavailable} (${analysis.total > 0 ? ((analysis.unavailable / analysis.total) * 100).toFixed(1) : 0}%)`);
  
  // Manufacturer breakdown
  if (Object.keys(analysis.manufacturers).length > 0) {
    console.log(`\n📈 Manufacturers:`);
    Object.entries(analysis.manufacturers).forEach(([manufacturer, stats]) => {
      const rate = stats.total > 0 ? ((stats.available / stats.total) * 100).toFixed(1) : 0;
      console.log(`   ${manufacturer}: ${stats.available}/${stats.total} (${rate}%)`);
    });
  }
  
  // Show sample products
  if (analysis.products.length > 0) {
    console.log(`\n📋 Sample Products (first 5):`);
    analysis.products.slice(0, 5).forEach(product => {
      const status = product.available ? '✅' : '❌';
      const qty = product.quantity > 0 ? `Qty: ${product.quantity}` : 'Out of stock';
      console.log(`   ${status} ${product.sku} - ${product.manufacturer} - ${qty} - ${product.price}`);
    });
    
    if (analysis.products.length > 5) {
      console.log(`   ... and ${analysis.products.length - 5} more products`);
    }
  }
  
  // Check for active filters
  const filterElements = document.querySelectorAll('.wiertla-categories__filter, .filter-active, [data-filter]');
  if (filterElements.length > 0) {
    console.log(`\n🔍 Active Filters: ${filterElements.length} filter(s) detected`);
    filterElements.forEach((filter, index) => {
      console.log(`   Filter ${index + 1}: ${filter.textContent?.trim() || filter.className}`);
    });
  }
  
  // Check for search input
  const searchInputs = document.querySelectorAll('input[type="search"], input[name="q"], input[placeholder*="search" i]');
  if (searchInputs.length > 0) {
    searchInputs.forEach((input, index) => {
      if (input.value) {
        console.log(`\n🔍 Search Query ${index + 1}: "${input.value}"`);
      }
    });
  }
  
  // Check tab state
  const activeTab = document.querySelector('.wiertla-categories__tab.active');
  if (activeTab) {
    console.log(`\n📑 Active Tab: ${activeTab.textContent?.trim()}`);
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Make analysis available globally for further inspection
  window.wiertlaTableAnalysis = analysis;
  console.log('💾 Analysis saved to window.wiertlaTableAnalysis for further inspection');
  
  // Additional debugging info
  console.log('\n🔧 Debugging Information:');
  console.log(`   Table element:`, table);
  console.log(`   Table body:`, tbody);
  console.log(`   Product rows:`, productRows);
  console.log(`   Analysis object:`, analysis);
  
  return analysis;
})();
