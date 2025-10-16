// Console script to analyze products currently displayed in the table
// Paste this script into the browser console to get a summary of products and their SKU prefixes

(function analyzeProductsInTable() {
  console.log('🔍 Analyzing products currently displayed in table...');
  console.log('=' .repeat(60));
  
  try {
    // Get all product rows from the table
    const productRows = document.querySelectorAll('tr[data-product-id], tr[data-product-handle], .wiertla-categories__table tbody tr:not(:first-child)');
    
    if (productRows.length === 0) {
      console.log('❌ No product rows found in the table');
      console.log('💡 Make sure you are on a page with a product table');
      return;
    }
    
    console.log(`📊 Found ${productRows.length} products in the table`);
    console.log('');
    
    // Analyze SKU prefixes
    const skuPrefixes = {};
    const productDetails = [];
    let totalProducts = 0;
    
    productRows.forEach((row, index) => {
      try {
        // Try different selectors to find SKU
        let sku = '';
        let productTitle = '';
        let productId = '';
        
        // Look for SKU in various possible locations
        const skuElement = row.querySelector('[data-sku], .sku, .product-sku, td:nth-child(2), td:nth-child(3)');
        if (skuElement) {
          sku = skuElement.textContent?.trim() || skuElement.getAttribute('data-sku') || '';
        }
        
        // Look for product title
        const titleElement = row.querySelector('[data-title], .product-title, .title, td:first-child, a[href*="/products/"]');
        if (titleElement) {
          productTitle = titleElement.textContent?.trim() || titleElement.getAttribute('data-title') || '';
        }
        
        // Look for product ID
        productId = row.getAttribute('data-product-id') || row.getAttribute('data-product-handle') || '';
        
        // If no SKU found, try to extract from title or other attributes
        if (!sku) {
          // Try to find SKU in data attributes
          const dataSku = row.getAttribute('data-sku');
          if (dataSku) {
            sku = dataSku;
          } else {
            // Try to extract from title or other text content
            const allText = row.textContent || '';
            const skuMatch = allText.match(/\b[A-Z]{2,4}\d{2,6}\b/);
            if (skuMatch) {
              sku = skuMatch[0];
            }
          }
        }
        
        if (sku) {
          // Extract prefix (first 2-4 characters)
          const prefix = sku.substring(0, 2).toUpperCase();
          
          if (!skuPrefixes[prefix]) {
            skuPrefixes[prefix] = {
              count: 0,
              examples: []
            };
          }
          
          skuPrefixes[prefix].count++;
          if (skuPrefixes[prefix].examples.length < 3) {
            skuPrefixes[prefix].examples.push(sku);
          }
          
          totalProducts++;
        }
        
        // Store product details
        productDetails.push({
          index: index + 1,
          sku: sku || 'N/A',
          title: productTitle || 'N/A',
          id: productId || 'N/A'
        });
        
      } catch (error) {
        console.warn(`⚠️ Error processing row ${index + 1}:`, error);
      }
    });
    
    // Display summary
    console.log('📈 SKU PREFIX SUMMARY:');
    console.log('=' .repeat(40));
    
    if (Object.keys(skuPrefixes).length === 0) {
      console.log('❌ No SKU prefixes found');
      console.log('💡 The table might not contain SKU information or use different selectors');
    } else {
      // Sort prefixes by count (descending)
      const sortedPrefixes = Object.entries(skuPrefixes)
        .sort(([,a], [,b]) => b.count - a.count);
      
      sortedPrefixes.forEach(([prefix, data]) => {
        const percentage = ((data.count / totalProducts) * 100).toFixed(1);
        console.log(`${prefix}: ${data.count} products (${percentage}%)`);
        console.log(`   Examples: ${data.examples.join(', ')}`);
      });
      
      console.log('');
      console.log(`📊 TOTAL: ${totalProducts} products with SKU prefixes`);
    }
    
    // Display detailed product list (first 10)
    console.log('');
    console.log('📋 PRODUCT DETAILS (first 10):');
    console.log('=' .repeat(50));
    
    productDetails.slice(0, 10).forEach(product => {
      console.log(`${product.index}. SKU: ${product.sku} | Title: ${product.title.substring(0, 50)}${product.title.length > 50 ? '...' : ''}`);
    });
    
    if (productDetails.length > 10) {
      console.log(`... and ${productDetails.length - 10} more products`);
    }
    
    // Additional analysis
    console.log('');
    console.log('🔍 ADDITIONAL ANALYSIS:');
    console.log('=' .repeat(30));
    
    // Check if we're in a filtered view
    const currentFilters = window.WiertlaCNC?.filters || {};
    if (currentFilters.category && currentFilters.category !== 'wszystkie') {
      console.log(`🎯 Current category filter: ${currentFilters.category}`);
    }
    
    if (currentFilters.page) {
      console.log(`📄 Current page: ${currentFilters.page}`);
    }
    
    if (currentFilters.perPage) {
      console.log(`📊 Items per page: ${currentFilters.perPage}`);
    }
    
    // Check for search term
    const searchInput = document.querySelector('input[type="search"], input[name="search"], .search-input');
    if (searchInput && searchInput.value) {
      console.log(`🔍 Search term: "${searchInput.value}"`);
    }
    
    // Check active tab
    if (window.WiertlaCNC?.activeTabType) {
      console.log(`🏷️ Active tab: ${window.WiertlaCNC.activeTabType}`);
    }
    
    // Return data for further analysis
    return {
      totalProducts: productDetails.length,
      skuPrefixes,
      productDetails,
      filters: currentFilters
    };
    
  } catch (error) {
    console.error('❌ Error analyzing products:', error);
    console.log('💡 Make sure you are on a page with a product table');
  }
})();

// Alternative function for more detailed analysis
function detailedProductAnalysis() {
  console.log('🔬 Starting detailed product analysis...');
  
  // Get all possible product data sources
  const sources = {
    'window.WiertlaCNC.products': window.WiertlaCNC?.products,
    'window.products': window.products,
    'table rows': document.querySelectorAll('tr[data-product-id], tr[data-product-handle]'),
    'product cards': document.querySelectorAll('[data-product-id], [data-product-handle]')
  };
  
  console.log('📊 Available data sources:');
  Object.entries(sources).forEach(([name, data]) => {
    if (Array.isArray(data)) {
      console.log(`  ${name}: ${data.length} items`);
    } else if (data) {
      console.log(`  ${name}: ${data.length || 'unknown'} items`);
    } else {
      console.log(`  ${name}: not available`);
    }
  });
  
  // Analyze window.WiertlaCNC.products if available
  if (window.WiertlaCNC?.products && Array.isArray(window.WiertlaCNC.products)) {
    console.log('');
    console.log('🔍 Analyzing window.WiertlaCNC.products:');
    
    const allProducts = window.WiertlaCNC.products;
    const skuPrefixes = {};
    
    allProducts.forEach(product => {
      const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
      if (sku) {
        const prefix = sku.substring(0, 2).toUpperCase();
        if (!skuPrefixes[prefix]) {
          skuPrefixes[prefix] = 0;
        }
        skuPrefixes[prefix]++;
      }
    });
    
    console.log(`📊 Total products in memory: ${allProducts.length}`);
    console.log('📈 SKU prefix distribution:');
    
    Object.entries(skuPrefixes)
      .sort(([,a], [,b]) => b - a)
      .forEach(([prefix, count]) => {
        const percentage = ((count / allProducts.length) * 100).toFixed(1);
        console.log(`  ${prefix}: ${count} (${percentage}%)`);
      });
  }
}

// Export functions for reuse
if (typeof window !== 'undefined') {
  window.analyzeProductsInTable = analyzeProductsInTable;
  window.detailedProductAnalysis = detailedProductAnalysis;
  console.log('💡 Functions available: analyzeProductsInTable(), detailedProductAnalysis()');
}
