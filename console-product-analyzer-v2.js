// Improved console script to analyze products currently displayed in the table
// This version specifically targets the wiertla-categories table structure

(function analyzeWiertlaProducts() {
  console.log('🔍 Analyzing Wiertla products in table...');
  console.log('=' .repeat(60));
  
  try {
    // Get all product rows from the wiertla categories table
    const productRows = document.querySelectorAll('.wiertla-categories__table tbody tr:not(:first-child)');
    
    if (productRows.length === 0) {
      console.log('❌ No product rows found in the wiertla-categories table');
      console.log('💡 Make sure you are on the wiertla categories page');
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
        let sku = '';
        let productTitle = '';
        let productId = '';
        let diameter = '';
        let manufacturer = '';
        
        // Look for SKU in the second column (index 1)
        const skuCell = row.children[1];
        if (skuCell) {
          sku = skuCell.textContent?.trim() || '';
        }
        
        // Look for product title in the first column
        const titleCell = row.children[0];
        if (titleCell) {
          productTitle = titleCell.textContent?.trim() || '';
        }
        
        // Look for diameter in the third column
        const diameterCell = row.children[2];
        if (diameterCell) {
          diameter = diameterCell.textContent?.trim() || '';
        }
        
        // Look for manufacturer in the fourth column
        const manufacturerCell = row.children[3];
        if (manufacturerCell) {
          manufacturer = manufacturerCell.textContent?.trim() || '';
        }
        
        // Try to get product ID from data attributes
        productId = row.getAttribute('data-product-id') || row.getAttribute('data-product-handle') || '';
        
        // If no SKU found in second column, try other methods
        if (!sku) {
          // Try to find SKU in data attributes
          const dataSku = row.getAttribute('data-sku');
          if (dataSku) {
            sku = dataSku;
          } else {
            // Try to extract SKU from title or other text content
            const allText = row.textContent || '';
            // Look for patterns like PW123, PS456, VH789, etc.
            const skuMatch = allText.match(/\b(PW|PS|VH|AM|KS|SA|KO|PL|WI|CN)\d{2,6}\b/i);
            if (skuMatch) {
              sku = skuMatch[0].toUpperCase();
            }
          }
        }
        
        if (sku) {
          // Extract prefix (first 2 characters)
          const prefix = sku.substring(0, 2).toUpperCase();
          
          if (!skuPrefixes[prefix]) {
            skuPrefixes[prefix] = {
              count: 0,
              examples: [],
              manufacturers: new Set()
            };
          }
          
          skuPrefixes[prefix].count++;
          if (skuPrefixes[prefix].examples.length < 5) {
            skuPrefixes[prefix].examples.push(sku);
          }
          
          if (manufacturer) {
            skuPrefixes[prefix].manufacturers.add(manufacturer);
          }
          
          totalProducts++;
        }
        
        // Store product details
        productDetails.push({
          index: index + 1,
          sku: sku || 'N/A',
          title: productTitle || 'N/A',
          diameter: diameter || 'N/A',
          manufacturer: manufacturer || 'N/A',
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
      
      // Show raw data for debugging
      console.log('');
      console.log('🔍 DEBUG: Raw table data (first 5 rows):');
      productRows.slice(0, 5).forEach((row, index) => {
        console.log(`Row ${index + 1}:`, Array.from(row.children).map(cell => cell.textContent?.trim()));
      });
    } else {
      // Sort prefixes by count (descending)
      const sortedPrefixes = Object.entries(skuPrefixes)
        .sort(([,a], [,b]) => b.count - a.count);
      
      sortedPrefixes.forEach(([prefix, data]) => {
        const percentage = ((data.count / totalProducts) * 100).toFixed(1);
        console.log(`${prefix}: ${data.count} products (${percentage}%)`);
        console.log(`   Examples: ${data.examples.join(', ')}`);
        if (data.manufacturers.size > 0) {
          console.log(`   Manufacturers: ${Array.from(data.manufacturers).join(', ')}`);
        }
      });
      
      console.log('');
      console.log(`📊 TOTAL: ${totalProducts} products with SKU prefixes`);
    }
    
    // Display detailed product list (first 10)
    console.log('');
    console.log('📋 PRODUCT DETAILS (first 10):');
    console.log('=' .repeat(50));
    
    productDetails.slice(0, 10).forEach(product => {
      console.log(`${product.index}. SKU: ${product.sku} | Title: ${product.title.substring(0, 40)}${product.title.length > 40 ? '...' : ''} | Diameter: ${product.diameter} | Manufacturer: ${product.manufacturer}`);
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
    
    // Analyze manufacturers
    const manufacturers = {};
    productDetails.forEach(product => {
      if (product.manufacturer && product.manufacturer !== 'N/A') {
        manufacturers[product.manufacturer] = (manufacturers[product.manufacturer] || 0) + 1;
      }
    });
    
    if (Object.keys(manufacturers).length > 0) {
      console.log('');
      console.log('🏭 MANUFACTURER DISTRIBUTION:');
      Object.entries(manufacturers)
        .sort(([,a], [,b]) => b - a)
        .forEach(([manufacturer, count]) => {
          const percentage = ((count / productDetails.length) * 100).toFixed(1);
          console.log(`  ${manufacturer}: ${count} (${percentage}%)`);
        });
    }
    
    // Return data for further analysis
    return {
      totalProducts: productDetails.length,
      skuPrefixes,
      productDetails,
      manufacturers,
      filters: currentFilters
    };
    
  } catch (error) {
    console.error('❌ Error analyzing products:', error);
    console.log('💡 Make sure you are on the wiertla categories page');
  }
})();

// Function to analyze all products in memory (not just displayed)
function analyzeAllProductsInMemory() {
  console.log('🔬 Analyzing all products in memory...');
  
  if (!window.WiertlaCNC?.products || !Array.isArray(window.WiertlaCNC.products)) {
    console.log('❌ No products found in window.WiertlaCNC.products');
    return;
  }
  
  const allProducts = window.WiertlaCNC.products;
  const skuPrefixes = {};
  const manufacturers = {};
  let totalProducts = 0;
  
  allProducts.forEach(product => {
    const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || '';
    const manufacturer = product.vendor || product.manufacturer || '';
    
    if (sku) {
      const prefix = sku.substring(0, 2).toUpperCase();
      
      if (!skuPrefixes[prefix]) {
        skuPrefixes[prefix] = {
          count: 0,
          examples: [],
          manufacturers: new Set()
        };
      }
      
      skuPrefixes[prefix].count++;
      if (skuPrefixes[prefix].examples.length < 5) {
        skuPrefixes[prefix].examples.push(sku);
      }
      
      if (manufacturer) {
        skuPrefixes[prefix].manufacturers.add(manufacturer);
      }
      
      totalProducts++;
    }
    
    if (manufacturer) {
      manufacturers[manufacturer] = (manufacturers[manufacturer] || 0) + 1;
    }
  });
  
  console.log(`📊 Total products in memory: ${allProducts.length}`);
  console.log(`📊 Products with SKU: ${totalProducts}`);
  console.log('');
  
  console.log('📈 SKU PREFIX DISTRIBUTION (ALL PRODUCTS):');
  console.log('=' .repeat(50));
  
  Object.entries(skuPrefixes)
    .sort(([,a], [,b]) => b.count - a.count)
    .forEach(([prefix, data]) => {
      const percentage = ((data.count / totalProducts) * 100).toFixed(1);
      console.log(`${prefix}: ${data.count} products (${percentage}%)`);
      console.log(`   Examples: ${data.examples.join(', ')}`);
      if (data.manufacturers.size > 0) {
        console.log(`   Manufacturers: ${Array.from(data.manufacturers).join(', ')}`);
      }
    });
  
  console.log('');
  console.log('🏭 MANUFACTURER DISTRIBUTION (ALL PRODUCTS):');
  console.log('=' .repeat(50));
  
  Object.entries(manufacturers)
    .sort(([,a], [,b]) => b - a)
    .forEach(([manufacturer, count]) => {
      const percentage = ((count / allProducts.length) * 100).toFixed(1);
      console.log(`${manufacturer}: ${count} (${percentage}%)`);
    });
  
  return {
    totalProducts: allProducts.length,
    productsWithSku: totalProducts,
    skuPrefixes,
    manufacturers
  };
}

// Export functions for reuse
if (typeof window !== 'undefined') {
  window.analyzeWiertlaProducts = analyzeWiertlaProducts;
  window.analyzeAllProductsInMemory = analyzeAllProductsInMemory;
  console.log('💡 Functions available: analyzeWiertlaProducts(), analyzeAllProductsInMemory()');
}
