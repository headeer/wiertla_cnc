/**
 * Corrected Console Analyzer - Reads actual data instead of displayed text
 */

(function() {
  console.log('🔧 Corrected Wiertla CNC Table Analyzer Starting...');
  
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
      
      // Get actual data from data attributes instead of displayed text
      const actualSku = row.getAttribute('data-sku') || '';
      const actualVendor = row.getAttribute('data-vendor') || '';
      const productId = row.getAttribute('data-product-id') || '';
      
      let product = {
        index: index + 1,
        category: currentCategory,
        available: false,
        quantity: 0,
        price: '',
        manufacturer: actualVendor,
        sku: actualSku,
        diameter: '',
        length: '',
        type: '',
        productId: productId
      };
      
      // Parse based on category - use actual data attributes
      if (currentCategory === 'wiertla') {
        // WIERTŁA: Typ, ⌀ Fi, D/mm, Symbol, Producent, Cena netto
        if (cells.length >= 6) {
          product.type = cells[0]?.textContent?.trim() || '';
          product.diameter = cells[1]?.textContent?.trim() || '';
          product.length = cells[2]?.textContent?.trim() || '';
          // Use actual SKU from data attribute, not displayed text
          product.sku = actualSku;
          product.manufacturer = actualVendor;
          product.price = cells[5]?.textContent?.trim() || '';
          
          // Check availability - products with valid SKU and data-product-id are available
          const hasValidSku = product.sku && product.sku !== '-' && product.sku.trim() !== '';
          const hasProductId = product.productId && product.productId !== '';
          product.available = hasValidSku && hasProductId;
          product.quantity = hasValidSku ? 1 : 0; // Assume 1 if available
        }
      } else if (currentCategory === 'plytki') {
        // PŁYTKI: Producent, Kod producenta, Ilość, Cena netto
        if (cells.length >= 4) {
          product.manufacturer = actualVendor;
          product.sku = actualSku;
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
          product.manufacturer = actualVendor;
          product.sku = actualSku;
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
  console.log('📊 CORRECTED WIERTLA CNC TABLE ANALYSIS RESULTS');
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
  
  // Show any products that might be incorrectly identified as unavailable
  const potentiallyIncorrect = analysis.products.filter(p => !p.available && p.sku && p.sku !== '-');
  if (potentiallyIncorrect.length > 0) {
    console.log(`\n⚠️ Products that might be incorrectly identified as unavailable:`);
    potentiallyIncorrect.forEach(product => {
      console.log(`   ${product.sku} - ${product.manufacturer} - ${product.price}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Make analysis available globally for further inspection
  window.wiertlaTableAnalysisCorrected = analysis;
  console.log('💾 Corrected analysis saved to window.wiertlaTableAnalysisCorrected for further inspection');
  
  return analysis;
})();

