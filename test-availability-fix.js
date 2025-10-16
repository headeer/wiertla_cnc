/**
 * Test script to verify availability filtering is working
 * Paste this into browser console to test
 */

(function() {
  console.log('🔧 Testing Availability Filter Fix...');
  
  // Check if products are being filtered correctly
  if (window.WiertlaCNC && window.WiertlaCNC.products) {
    const totalProducts = window.WiertlaCNC.products.length;
    console.log(`📊 Total products in WiertlaCNC: ${totalProducts}`);
    
    // Check availability of first 10 products
    const sampleProducts = window.WiertlaCNC.products.slice(0, 10);
    console.log('\n📋 Sample Products Availability:');
    
    sampleProducts.forEach((product, index) => {
      const sku = product.sku || product.custom_symbol || product.custom_kod_producenta || 'No SKU';
      const inventory = product.inventory_quantity || 0;
      const available = product.available;
      const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
      const variantInventory = hasVariants ? product.variants.map(v => v.inventory_quantity || 0) : [];
      
      console.log(`${index + 1}. ${sku}:`);
      console.log(`   Inventory: ${inventory}`);
      console.log(`   Available: ${available}`);
      console.log(`   Variants: ${variantInventory.join(', ') || 'None'}`);
      
      // Check if this product should be shown
      const shouldShow = inventory > 0 || available === true || variantInventory.some(qty => qty > 0);
      console.log(`   Should Show: ${shouldShow ? '✅' : '❌'}`);
    });
    
    // Force re-apply filters
    console.log('\n🔄 Re-applying filters...');
    if (typeof window.applyFilters === 'function') {
      window.applyFilters();
      console.log('✅ Filters re-applied');
    } else {
      console.log('❌ applyFilters function not found');
    }
    
    // Check current table
    const table = document.querySelector('.wiertla-categories__table');
    const tbody = table?.querySelector('#productsTableBody');
    const rows = tbody?.querySelectorAll('tr:not([style*="display: none"])') || [];
    
    console.log(`\n📋 Current table rows: ${rows.length}`);
    
    if (rows.length > 0) {
      console.log('\n🔍 Checking first 5 table rows:');
      rows.slice(0, 5).forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
          const sku = cells[3]?.textContent?.trim() || 'No SKU';
          const manufacturer = cells[4]?.textContent?.trim() || 'No Manufacturer';
          console.log(`${index + 1}. ${sku} - ${manufacturer}`);
        }
      });
    }
    
  } else {
    console.log('❌ WiertlaCNC.products not found');
  }
  
  console.log('\n✅ Test complete!');
})();
